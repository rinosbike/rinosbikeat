"""
Page and PageBlock Models
For the blocks-based page builder system
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database.connection import Base


class Page(Base):
    """
    Custom pages that can be created and managed in the admin panel.
    These pages can be added to the header navigation.
    """
    __tablename__ = "pages"

    page_id = Column(Integer, primary_key=True, index=True)

    # Page identification
    slug = Column(String(255), unique=True, nullable=False, index=True)  # URL slug (e.g., "about-us")
    title = Column(String(255), nullable=False)  # Page title

    # Navigation settings
    show_in_header = Column(Boolean, default=False)  # Show in main navigation
    menu_position = Column(Integer, default=0)  # Order in menu (lower = first)
    menu_label = Column(String(100), nullable=True)  # Custom label for menu (defaults to title)

    # SEO
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(Text, nullable=True)

    # Status
    is_published = Column(Boolean, default=False)
    published_at = Column(DateTime, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Created by (admin user)
    created_by = Column(Integer, ForeignKey("web_users.user_id"), nullable=True)

    # Relationships
    blocks = relationship("PageBlock", back_populates="page", cascade="all, delete-orphan", order_by="PageBlock.block_order")

    def __repr__(self):
        return f"<Page(page_id={self.page_id}, slug={self.slug}, title={self.title})>"

    def to_dict(self, include_blocks=False):
        result = {
            "page_id": self.page_id,
            "slug": self.slug,
            "title": self.title,
            "show_in_header": self.show_in_header,
            "menu_position": self.menu_position,
            "menu_label": self.menu_label or self.title,
            "meta_title": self.meta_title,
            "meta_description": self.meta_description,
            "is_published": self.is_published,
            "published_at": self.published_at.isoformat() if self.published_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "created_by": self.created_by
        }
        if include_blocks:
            result["blocks"] = [block.to_dict() for block in self.blocks]
        return result


class PageBlock(Base):
    """
    Individual blocks that make up a page.
    Each block has a type and configuration stored as JSON.
    """
    __tablename__ = "page_blocks"

    block_id = Column(Integer, primary_key=True, index=True)

    # Page relationship
    page_id = Column(Integer, ForeignKey("pages.page_id", ondelete="CASCADE"), nullable=False, index=True)

    # Block type (hero, text, image_gallery, feature_grid, cta, faq, video, product_showcase, custom_html, etc.)
    block_type = Column(String(50), nullable=False)

    # Order within the page
    block_order = Column(Integer, default=0)

    # Visibility
    is_visible = Column(Boolean, default=True)

    # Block configuration (JSON) - structure depends on block_type
    configuration = Column(JSON, nullable=False, default=dict)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    page = relationship("Page", back_populates="blocks")

    def __repr__(self):
        return f"<PageBlock(block_id={self.block_id}, type={self.block_type}, order={self.block_order})>"

    def to_dict(self):
        return {
            "block_id": self.block_id,
            "page_id": self.page_id,
            "block_type": self.block_type,
            "block_order": self.block_order,
            "is_visible": self.is_visible,
            "configuration": self.configuration,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


# Block type configurations reference:
# Each block type has a specific configuration structure
BLOCK_TYPE_SCHEMAS = {
    "hero": {
        "image_url": "string",
        "title": "string",
        "subtitle": "string",
        "button_text": "string (optional)",
        "button_link": "string (optional)",
        "overlay_opacity": "number (0-100, optional)",
        "text_alignment": "string (left|center|right, optional)",
        "height": "string (small|medium|large|full, optional)"
    },
    "text": {
        "content": "string (HTML/Markdown)",
        "alignment": "string (left|center|right, optional)",
        "max_width": "string (optional)"
    },
    "image_gallery": {
        "title": "string (optional)",
        "images": [
            {
                "url": "string",
                "alt": "string (optional)",
                "caption": "string (optional)"
            }
        ],
        "columns": "number (1-4, optional)",
        "gap": "string (small|medium|large, optional)"
    },
    "feature_grid": {
        "title": "string (optional)",
        "subtitle": "string (optional)",
        "features": [
            {
                "icon": "string",
                "title": "string",
                "description": "string"
            }
        ],
        "columns": "number (2-4, optional)"
    },
    "cta": {
        "title": "string",
        "description": "string (optional)",
        "button_text": "string",
        "button_link": "string",
        "background_color": "string (optional)",
        "text_color": "string (optional)"
    },
    "faq": {
        "title": "string (optional)",
        "items": [
            {
                "question": "string",
                "answer": "string"
            }
        ]
    },
    "video": {
        "title": "string (optional)",
        "video_url": "string (YouTube/Vimeo URL)",
        "autoplay": "boolean (optional)",
        "controls": "boolean (optional)"
    },
    "product_showcase": {
        "title": "string (optional)",
        "product_ids": ["string (articlenr)"],
        "columns": "number (2-4, optional)"
    },
    "spacer": {
        "height": "string (small|medium|large|custom)",
        "custom_height": "number (px, optional)"
    },
    "divider": {
        "style": "string (solid|dashed|dotted)",
        "color": "string (optional)",
        "width": "string (full|medium|small)"
    },
    "custom_html": {
        "html": "string (raw HTML)"
    }
}
