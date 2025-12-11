"""
Pages API Router
For managing custom pages and blocks in the page builder system
Requires admin authentication for write operations
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy import func, desc
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

from database.connection import get_db
from models.page import Page, PageBlock
from models.user import WebUser
from api.utils.auth_dependencies import get_current_user

router = APIRouter(prefix="/pages", tags=["Pages"])


# ============================================================================
# PYDANTIC SCHEMAS
# ============================================================================

class BlockCreate(BaseModel):
    block_type: str
    block_order: int = 0
    is_visible: bool = True
    configuration: Dict[str, Any] = Field(default_factory=dict)


class BlockUpdate(BaseModel):
    block_type: Optional[str] = None
    block_order: Optional[int] = None
    is_visible: Optional[bool] = None
    configuration: Optional[Dict[str, Any]] = None


class PageCreate(BaseModel):
    slug: str
    title: str
    show_in_header: bool = False
    menu_position: int = 0
    menu_label: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_published: bool = False
    blocks: List[BlockCreate] = Field(default_factory=list)


class PageUpdate(BaseModel):
    title: Optional[str] = None
    show_in_header: Optional[bool] = None
    menu_position: Optional[int] = None
    menu_label: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_published: Optional[bool] = None


class BlockReorder(BaseModel):
    block_orders: List[Dict[str, int]]  # [{"block_id": 1, "block_order": 0}, ...]


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def require_admin(current_user: WebUser = Depends(get_current_user)):
    """Dependency to require admin access"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# ============================================================================
# PUBLIC ENDPOINTS (No auth required - for frontend rendering)
# ============================================================================

@router.get("/public/menu")
async def get_menu_pages(db: Session = Depends(get_db)):
    """
    Get all published pages that should appear in the header menu.
    Public endpoint - no authentication required.
    """
    try:
        # First check if the table exists and has any data
        total_pages = db.query(Page).count()
        print(f"[Pages API] Total pages in database: {total_pages}")

        # Query for published pages that should show in header
        pages = db.query(Page).filter(
            Page.is_published == True,
            Page.show_in_header == True
        ).order_by(Page.menu_position).all()

        print(f"[Pages API] Menu pages found: {len(pages)}")
        for p in pages:
            print(f"  - {p.slug}: {p.menu_label or p.title}")

        return {
            "pages": [
                {
                    "page_id": p.page_id,
                    "slug": p.slug,
                    "title": p.title,
                    "menu_label": p.menu_label or p.title,
                    "menu_position": p.menu_position
                }
                for p in pages
            ],
            "debug": {
                "total_pages": total_pages,
                "menu_pages": len(pages)
            }
        }
    except Exception as e:
        print(f"[Pages API] Error getting menu pages: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/public/{slug}")
async def get_public_page(slug: str, db: Session = Depends(get_db)):
    """
    Get a published page by slug with all its blocks.
    Public endpoint - no authentication required.
    """
    try:
        page = db.query(Page).filter(
            Page.slug == slug,
            Page.is_published == True
        ).first()

        if not page:
            raise HTTPException(status_code=404, detail="Page not found")

        # Get blocks ordered by block_order
        blocks = db.query(PageBlock).filter(
            PageBlock.page_id == page.page_id,
            PageBlock.is_visible == True
        ).order_by(PageBlock.block_order).all()

        return {
            "page_id": page.page_id,
            "slug": page.slug,
            "title": page.title,
            "meta_title": page.meta_title or page.title,
            "meta_description": page.meta_description,
            "blocks": [block.to_dict() for block in blocks]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting public page: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# ADMIN ENDPOINTS - Pages CRUD
# ============================================================================

@router.get("")
async def get_pages(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    published_only: Optional[bool] = None,
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Get all pages for admin with pagination"""
    try:
        query = db.query(Page)

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                Page.title.ilike(search_term) | Page.slug.ilike(search_term)
            )

        if published_only:
            query = query.filter(Page.is_published == True)

        total = query.count()

        pages = query.order_by(Page.menu_position, Page.created_at.desc())\
            .offset((page - 1) * page_size)\
            .limit(page_size)\
            .all()

        return {
            "pages": [p.to_dict(include_blocks=False) for p in pages],
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size
        }
    except Exception as e:
        print(f"Error getting pages: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{page_id}")
async def get_page(
    page_id: int,
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Get a single page with all its blocks for editing"""
    try:
        page = db.query(Page).filter(Page.page_id == page_id).first()

        if not page:
            raise HTTPException(status_code=404, detail="Page not found")

        return page.to_dict(include_blocks=True)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting page: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("")
async def create_page(
    data: PageCreate,
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Create a new page"""
    try:
        # Check if slug already exists
        existing = db.query(Page).filter(Page.slug == data.slug).first()
        if existing:
            raise HTTPException(status_code=400, detail="A page with this slug already exists")

        # Create the page
        page = Page(
            slug=data.slug,
            title=data.title,
            show_in_header=data.show_in_header,
            menu_position=data.menu_position,
            menu_label=data.menu_label,
            meta_title=data.meta_title,
            meta_description=data.meta_description,
            is_published=data.is_published,
            published_at=datetime.utcnow() if data.is_published else None,
            created_by=admin.user_id
        )
        db.add(page)
        db.flush()  # Get the page_id

        # Create blocks if provided
        for i, block_data in enumerate(data.blocks):
            block = PageBlock(
                page_id=page.page_id,
                block_type=block_data.block_type,
                block_order=block_data.block_order if block_data.block_order else i,
                is_visible=block_data.is_visible,
                configuration=block_data.configuration
            )
            db.add(block)

        db.commit()
        db.refresh(page)

        return {
            "status": "success",
            "message": "Page created",
            "page": page.to_dict(include_blocks=True)
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error creating page: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{page_id}")
async def update_page(
    page_id: int,
    data: PageUpdate,
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Update page metadata (not blocks)"""
    try:
        page = db.query(Page).filter(Page.page_id == page_id).first()

        if not page:
            raise HTTPException(status_code=404, detail="Page not found")

        # Update fields if provided
        if data.title is not None:
            page.title = data.title
        if data.show_in_header is not None:
            page.show_in_header = data.show_in_header
        if data.menu_position is not None:
            page.menu_position = data.menu_position
        if data.menu_label is not None:
            page.menu_label = data.menu_label
        if data.meta_title is not None:
            page.meta_title = data.meta_title
        if data.meta_description is not None:
            page.meta_description = data.meta_description
        if data.is_published is not None:
            page.is_published = data.is_published
            if data.is_published and not page.published_at:
                page.published_at = datetime.utcnow()

        page.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(page)

        return {
            "status": "success",
            "message": "Page updated",
            "page": page.to_dict(include_blocks=False)
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error updating page: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{page_id}")
async def delete_page(
    page_id: int,
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Delete a page and all its blocks"""
    try:
        page = db.query(Page).filter(Page.page_id == page_id).first()

        if not page:
            raise HTTPException(status_code=404, detail="Page not found")

        db.delete(page)  # Blocks will be cascade deleted
        db.commit()

        return {"status": "success", "message": "Page deleted"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error deleting page: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# ADMIN ENDPOINTS - Blocks CRUD
# ============================================================================

@router.post("/{page_id}/blocks")
async def add_block(
    page_id: int,
    data: BlockCreate,
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Add a new block to a page"""
    try:
        # Verify page exists
        page = db.query(Page).filter(Page.page_id == page_id).first()
        if not page:
            raise HTTPException(status_code=404, detail="Page not found")

        # Get current max block_order
        max_order = db.query(func.max(PageBlock.block_order)).filter(
            PageBlock.page_id == page_id
        ).scalar() or -1

        block = PageBlock(
            page_id=page_id,
            block_type=data.block_type,
            block_order=data.block_order if data.block_order > 0 else max_order + 1,
            is_visible=data.is_visible,
            configuration=data.configuration
        )
        db.add(block)
        db.commit()
        db.refresh(block)

        return {
            "status": "success",
            "message": "Block added",
            "block": block.to_dict()
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error adding block: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{page_id}/blocks/{block_id}")
async def update_block(
    page_id: int,
    block_id: int,
    data: BlockUpdate,
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Update a block"""
    try:
        block = db.query(PageBlock).filter(
            PageBlock.block_id == block_id,
            PageBlock.page_id == page_id
        ).first()

        if not block:
            raise HTTPException(status_code=404, detail="Block not found")

        if data.block_type is not None:
            block.block_type = data.block_type
        if data.block_order is not None:
            block.block_order = data.block_order
        if data.is_visible is not None:
            block.is_visible = data.is_visible
        if data.configuration is not None:
            block.configuration = data.configuration

        block.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(block)

        return {
            "status": "success",
            "message": "Block updated",
            "block": block.to_dict()
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error updating block: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{page_id}/blocks/{block_id}")
async def delete_block(
    page_id: int,
    block_id: int,
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Delete a block from a page"""
    try:
        block = db.query(PageBlock).filter(
            PageBlock.block_id == block_id,
            PageBlock.page_id == page_id
        ).first()

        if not block:
            raise HTTPException(status_code=404, detail="Block not found")

        db.delete(block)
        db.commit()

        return {"status": "success", "message": "Block deleted"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error deleting block: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{page_id}/blocks/reorder")
async def reorder_blocks(
    page_id: int,
    data: BlockReorder,
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Reorder blocks within a page"""
    try:
        # Verify page exists
        page = db.query(Page).filter(Page.page_id == page_id).first()
        if not page:
            raise HTTPException(status_code=404, detail="Page not found")

        # Update each block's order
        for item in data.block_orders:
            block = db.query(PageBlock).filter(
                PageBlock.block_id == item["block_id"],
                PageBlock.page_id == page_id
            ).first()
            if block:
                block.block_order = item["block_order"]
                block.updated_at = datetime.utcnow()

        db.commit()

        return {"status": "success", "message": "Blocks reordered"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error reordering blocks: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# PUBLISH/UNPUBLISH
# ============================================================================

@router.post("/{page_id}/publish")
async def publish_page(
    page_id: int,
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Publish a page"""
    try:
        page = db.query(Page).filter(Page.page_id == page_id).first()

        if not page:
            raise HTTPException(status_code=404, detail="Page not found")

        page.is_published = True
        page.published_at = datetime.utcnow()
        page.updated_at = datetime.utcnow()
        db.commit()

        return {"status": "success", "message": "Page published"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error publishing page: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{page_id}/unpublish")
async def unpublish_page(
    page_id: int,
    db: Session = Depends(get_db),
    admin: WebUser = Depends(require_admin)
):
    """Unpublish a page"""
    try:
        page = db.query(Page).filter(Page.page_id == page_id).first()

        if not page:
            raise HTTPException(status_code=404, detail="Page not found")

        page.is_published = False
        page.updated_at = datetime.utcnow()
        db.commit()

        return {"status": "success", "message": "Page unpublished"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error unpublishing page: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# BLOCK TEMPLATES
# ============================================================================

@router.get("/templates/blocks")
async def get_block_templates(admin: WebUser = Depends(require_admin)):
    """Get available block templates with their default configurations"""
    return {
        "templates": [
            {
                "block_type": "hero",
                "label": "Hero Banner",
                "description": "Full-width hero section with image, title, and call-to-action",
                "icon": "Image",
                "default_config": {
                    "image_url": "",
                    "title": "Hero Title",
                    "subtitle": "Subtitle text goes here",
                    "button_text": "Learn More",
                    "button_link": "/",
                    "overlay_opacity": 40,
                    "text_alignment": "center",
                    "height": "large"
                }
            },
            {
                "block_type": "text",
                "label": "Text Block",
                "description": "Rich text content block",
                "icon": "FileText",
                "default_config": {
                    "content": "<p>Enter your content here...</p>",
                    "alignment": "left",
                    "max_width": "800px"
                }
            },
            {
                "block_type": "image_gallery",
                "label": "Image Gallery",
                "description": "Grid of images with optional captions",
                "icon": "Grid",
                "default_config": {
                    "title": "",
                    "images": [],
                    "columns": 3,
                    "gap": "medium"
                }
            },
            {
                "block_type": "feature_grid",
                "label": "Feature Grid",
                "description": "Grid of features with icons",
                "icon": "LayoutGrid",
                "default_config": {
                    "title": "Our Features",
                    "subtitle": "",
                    "features": [
                        {"icon": "Star", "title": "Feature 1", "description": "Description here"},
                        {"icon": "Heart", "title": "Feature 2", "description": "Description here"},
                        {"icon": "Shield", "title": "Feature 3", "description": "Description here"}
                    ],
                    "columns": 3
                }
            },
            {
                "block_type": "cta",
                "label": "Call to Action",
                "description": "Highlighted call-to-action section",
                "icon": "MousePointer",
                "default_config": {
                    "title": "Ready to get started?",
                    "description": "Take action today",
                    "button_text": "Get Started",
                    "button_link": "/",
                    "background_color": "#000000",
                    "text_color": "#ffffff"
                }
            },
            {
                "block_type": "faq",
                "label": "FAQ Section",
                "description": "Accordion-style frequently asked questions",
                "icon": "HelpCircle",
                "default_config": {
                    "title": "Frequently Asked Questions",
                    "items": [
                        {"question": "Question 1?", "answer": "Answer 1"},
                        {"question": "Question 2?", "answer": "Answer 2"}
                    ]
                }
            },
            {
                "block_type": "video",
                "label": "Video Embed",
                "description": "Embedded YouTube or Vimeo video",
                "icon": "Video",
                "default_config": {
                    "title": "",
                    "video_url": "",
                    "autoplay": False,
                    "controls": True
                }
            },
            {
                "block_type": "product_showcase",
                "label": "Product Showcase",
                "description": "Display selected products",
                "icon": "ShoppingBag",
                "default_config": {
                    "title": "Featured Products",
                    "product_ids": [],
                    "columns": 4
                }
            },
            {
                "block_type": "spacer",
                "label": "Spacer",
                "description": "Add vertical space between blocks",
                "icon": "Minus",
                "default_config": {
                    "height": "medium",
                    "custom_height": 48
                }
            },
            {
                "block_type": "divider",
                "label": "Divider",
                "description": "Horizontal line separator",
                "icon": "Minus",
                "default_config": {
                    "style": "solid",
                    "color": "#e5e7eb",
                    "width": "full"
                }
            },
            {
                "block_type": "custom_html",
                "label": "Custom HTML",
                "description": "Raw HTML content (use with caution)",
                "icon": "Code",
                "default_config": {
                    "html": ""
                }
            }
        ]
    }
