# Shopify to Next.js Conversion Plan
## RINOS Bike EU → RINOS Bike AT

Source: `C:\Users\savae\Downloads\rinosbikeeu`
Target: `C:\Users\savae\Downloads\rinosbikeat`

---

## 📋 Complete Section Inventory

### ✅ PRIORITY 1: Core E-Commerce Sections (Convert First)

#### Product & Collection Sections
- **main-product.liquid** - Product detail page (CRITICAL)
- **main-collection-product-grid.liquid** - Product grid display
- **main-collection-banner.liquid** - Collection header/banner
- **featured-product.liquid** - Featured product showcase
- **featured-collection.liquid** - Featured collection display
- **related-products.liquid** - Product recommendations
- **quick-order-list.liquid** - Quick add to cart

#### Cart & Checkout
- **cart-drawer.liquid** - Shopping cart sidebar
- **cart-notification-product.liquid** - Add to cart notification
- **cart-notification-button.liquid** - Cart button notification
- **main-cart-items.liquid** - Cart items display
- **main-cart-footer.liquid** - Cart footer/totals
- **cart-icon-bubble.liquid** - Cart icon with count
- **cart-live-region-text.liquid** - Screen reader cart updates

#### Navigation & Header
- **header.liquid** - Main navigation header
- **announcement-bar.liquid** - Top announcement banner
- **predictive-search.liquid** - Search autocomplete

#### Footer
- **footer.liquid** - Site footer

---

### ⭐ PRIORITY 2: Custom RINOS Brand Sections

#### Product Comparisons (UNIQUE TO RINOS)
- **rinos-comparison-1.liquid** - Product comparison tool
- **rinos-comparison-table-mtb-edition.liquid** - MTB bike comparison
- **rinos-comparison-table-road.liquid** - Road bike comparison
- **compare-on-page-odin.liquid** - On-page comparison widget

#### Custom Hero/Gallery Sections
- **herobannererika.liquid** - Custom hero banner
- **JavisGalleryRinos.liquid** - Custom image gallery
- **ISO-Video-section.liquid** - Video showcase
- **promovideo.liquid** - Promotional video
- **video-javi-w.liquid** - Custom video widget
- **video.liquid** - Standard video section

#### Product Assembly & Info
- **Gravel-assembly.liquid** - Gravel bike assembly guide
- **anglesports-frame-size.liquid** - Frame size calculator
- **Road-2025-board.liquid** - 2025 road bikes showcase

#### Reviews & Trust
- **review-section.liquid** - Product reviews
- **review-section-small.liquid** - Compact reviews
- **Trudi-widget.liquid** - Trust widget (Trustpilot/reviews)
- **trust-marquee.liquid** - Trust badges marquee

#### FAQ Sections (IMPORTANT FOR AUSTRIA)
- **section-faq-general.liquid** - General FAQs
- **section-faq-assembly.liquid** - Assembly instructions FAQs
- **section-faq-delivery.liquid** - Shipping/delivery FAQs
- **section-faq-bikespec.liquid** - Bike specifications FAQs

---

### 📦 PRIORITY 3: Standard Content Sections

#### Content Blocks
- **image-banner.liquid** - Hero/banner images
- **image-with-text.liquid** - Image + text blocks
- **slideshow.liquid** - Image carousel
- **multicolumn.liquid** - Multi-column layout
- **multirow.liquid** - Multi-row layout
- **collage.liquid** - Image collage
- **rich-text.liquid** - Rich text editor content
- **collapsible-content.liquid** - Accordion/FAQ blocks

#### Marketing
- **email-signup-banner.liquid** - Newsletter signup
- **newsletter.liquid** - Newsletter form
- **conversionbanner-2.liquid** - Conversion banner

#### Blog
- **featured-blog.liquid** - Blog post showcase
- **main-blog.liquid** - Blog listing page
- **main-article.liquid** - Blog post page

---

### 🔧 PRIORITY 4: Utility & System Sections

#### User Account Pages
- **main-account.liquid** - Account dashboard
- **main-login.liquid** - Login page
- **main-register.liquid** - Registration page
- **main-activate-account.liquid** - Account activation
- **main-addresses.liquid** - Address management
- **main-order.liquid** - Order details
- **main-reset-password.liquid** - Password reset

#### Search & Collections
- **main-search.liquid** - Search results page
- **collection-list.liquid** - Collections overview
- **main-list-collections.liquid** - Collection listing

#### Other
- **main-404.liquid** - 404 error page
- **main-page.liquid** - Static page template
- **contact-form.liquid** - Contact form
- **apps.liquid** - Third-party app container
- **custom-liquid.liquid** - Custom code section
- **main-password-header.liquid** - Password-protected header
- **main-password-footer.liquid** - Password-protected footer

---

## 🎨 Conversion Strategy

### Phase 1: Core E-Commerce (Week 1-2)
1. Product detail page with variations
2. Product grid/collection pages
3. Cart functionality
4. Header/Footer navigation
5. Search functionality

### Phase 2: RINOS Custom Features (Week 3-4)
1. Bike comparison tools (CRITICAL for Austria market)
2. Assembly guides and calculators
3. FAQ sections (translate to German)
4. Custom video/gallery sections
5. Trust/review widgets

### Phase 3: Content & Marketing (Week 5)
1. Hero banners and image sections
2. Blog functionality
3. Newsletter signup
4. Static content pages

### Phase 4: User Account System (Week 6)
1. Login/Registration (ALREADY DONE ✅)
2. Account dashboard
3. Order history
4. Address management

---

## 🔄 Conversion Approach: Shopify Liquid → Next.js React

### General Pattern:

**Shopify Liquid:**
```liquid
{% for product in collection.products %}
  <div class="product-card">
    <img src="{{ product.featured_image | img_url: 'medium' }}">
    <h3>{{ product.title }}</h3>
    <p>{{ product.price | money }}</p>
  </div>
{% endfor %}
```

**Next.js/React Equivalent:**
```tsx
{products.map((product) => (
  <div key={product.id} className="product-card">
    <img src={product.primary_image} alt={product.articlename} />
    <h3>{product.articlename}</h3>
    <p>{formatCurrency(product.price)}</p>
  </div>
))}
```

---

## 📊 Section Priority Matrix

| Section | Priority | Complexity | Austria-Specific | Status |
|---------|----------|------------|------------------|--------|
| Product Detail | CRITICAL | High | No | 🟡 In Progress |
| Cart | CRITICAL | High | No | 🟡 In Progress |
| Comparison Tables | HIGH | Medium | Yes (localization) | ⚪ Not Started |
| FAQ Sections | HIGH | Low | Yes (translate) | ⚪ Not Started |
| Assembly Guides | MEDIUM | Medium | Yes (localization) | ⚪ Not Started |
| Reviews | MEDIUM | Medium | No | ⚪ Not Started |
| Account Pages | MEDIUM | Low | No | 🟢 Login/Register Done |

---

## 🌍 Austria-Specific Considerations

1. **Language**: All sections need German translation
2. **Currency**: EUR (already configured)
3. **Shipping**: Austrian-specific delivery info in FAQ
4. **Legal**: Austrian/EU legal requirements (Impressum, DSGVO)
5. **Payment**: SEPA, Sofort, Austrian payment methods

---

## 📝 Next Steps

1. **Review this list** with stakeholders
2. **Prioritize** which custom sections are essential
3. **Extract** Shopify Liquid files for top priority sections
4. **Convert** one section at a time to Next.js
5. **Test** each section before moving to next
6. **Localize** content for Austrian market

---

## 💡 Recommendations

### Must Convert:
- All product/cart/checkout sections
- Bike comparison tools (unique selling point)
- FAQ sections (customer support)
- Assembly guides (reduce support tickets)

### Can Skip/Simplify:
- Some custom video sections (use standard video component)
- Duplicate banner/hero sections (consolidate)
- Shopify-specific password protection pages

### Should Enhance:
- Frame size calculator (adapt for Austrian sizing)
- Payment options (add Austrian-specific methods)
- Shipping calculator (Austrian postal codes)

---

**Total Sections Found**: 67 sections + 40+ snippets
**Core Sections to Convert**: ~35-40
**Estimated Timeline**: 6-8 weeks for full conversion
