# Rinosbike.eu Styling Guide

## Extracted from GitHub Repository
Source: https://github.com/rinosbike/rinosbikeeu.git

## Page Layout (`base.css`)

### Container Widths
```css
.page-width {
  max-width: var(--page-width);  /* Set in theme settings */
  padding: 0 1.5rem;  /* 24px mobile */
}

@media screen and (min-width: 750px) {
  .page-width {
    padding: 0 5rem;  /* 80px tablet/desktop */
  }
}

@media screen and (min-width: 990px) {
  .header.page-width {
    padding-left: 5rem;
    padding-right: 5rem;
  }
}
```

### Section Spacing
```css
.section + .section {
  margin-top: var(--spacing-sections-mobile);
}

@media screen and (min-width: 750px) {
  .section + .section {
    margin-top: var(--spacing-sections-desktop);
  }
}
```

## Homepage Structure (`index.json`)

1. **Rich Text Section**
   - padding_top: 40
   - padding_bottom: 52

2. **Trust Marquee Banner**
   - bg_color: #000000
   - text_color: #FFFFFF
   - font_size: 14
   - speed: 30
   - padding_vertical: 12

3. **Image Banner (Hero)**
   - image_height: "medium"
   - image_overlay_opacity: 0-30
   - padding: varies

4. **Featured Blog**
   - columns_desktop: 3
   - post_limit: 3
   - padding_top: 36
   - padding_bottom: 36

5. **Featured Collection (Products)**
   - products_to_show: 4
   - columns_desktop: 4
   - columns_mobile: 2
   - padding_top: 44
   - padding_bottom: 36

6. **Image with Text**
   - padding_top: 36
   - padding_bottom: 36

## Key Design Tokens

### Spacing Scale (from Shopify theme)
- Mobile padding: 1.5rem (24px)
- Tablet padding: 5rem (80px)
- Desktop padding: 5rem (80px)
- Section spacing mobile: varies
- Section spacing desktop: varies

### Hero Image Heights
- Small: ~300px
- Medium: ~450px (DEFAULT)
- Large: ~600px

### Grid Columns
- Products: 2 mobile / 4 desktop
- Blog: 3 desktop
- Collections: varies

### Typography
- Heading sizes: h0, h1, h2
- Body text style

## Component Patterns

### Image Banner
- Fixed or parallax background
- Text overlay (top-left, top-right, center)
- Optional text box background
- Buttons (primary/secondary styles)

### Product Cards
- Secondary image on hover
- Vendor display optional
- Rating optional
- Quick add button optional
- Adapt image ratio

### Trust Banner
- Infinite scroll marquee
- Uppercase text
- Black background, white text
- 30s animation speed
