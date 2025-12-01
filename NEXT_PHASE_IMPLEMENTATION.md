# Next Phase Implementation Plan
## Priority 2 & 3 Sections for RINOS Bike AT

**Status**: Ready for Implementation
**Target**: Next.js/React Components
**Timeline**: 2-3 weeks

---

## 📦 Phase 2A: Core Content Sections (Week 1)

### 1. Featured Collection Component
**File**: `frontend/components/home/FeaturedCollection.tsx`

**Purpose**: Display a curated collection of products on homepage
**Shopify Source**: `featured-collection.liquid`

**Features Needed**:
- Product grid with 2-4 columns (responsive)
- Slider on mobile
- "Quick add" button
- Collection title and description
- "View all" link

**Props Interface**:
```typescript
interface FeaturedCollectionProps {
  title: string;
  description?: string;
  collectionId?: number;
  productsToShow: number;
  columns: {
    desktop: 3 | 4;
    mobile: 1 | 2;
  };
  showQuickAdd?: boolean;
}
```

---

### 2. Image Banner / Hero Component
**File**: `frontend/components/home/ImageBanner.tsx`

**Purpose**: Large hero banner with text overlay
**Shopify Source**: `image-banner.liquid`

**Features Needed**:
- Full-width or contained
- Image + optional second image (split)
- Text overlay with heading, subheading, button
- Content alignment (left/center/right)
- Mobile/desktop different images
- Optional overlay opacity

**Props Interface**:
```typescript
interface ImageBannerProps {
  image: string;
  image2?: string;
  heading: string;
  subheading?: string;
  buttonText?: string;
  buttonLink?: string;
  contentAlignment: 'left' | 'center' | 'right';
  overlayOpacity?: number;
  height: 'small' | 'medium' | 'large' | 'adapt';
}
```

---

### 3. Multi-Column Section
**File**: `frontend/components/home/MultiColumn.tsx`

**Purpose**: Feature blocks with icons/images
**Shopify Source**: `multicolumn.liquid`

**Features Needed**:
- 2-4 columns
- Image + title + text per column
- Optional button per column
- Responsive grid

**Props Interface**:
```typescript
interface Column {
  image?: string;
  title: string;
  text: string;
  buttonText?: string;
  buttonLink?: string;
}

interface MultiColumnProps {
  title?: string;
  columns: Column[];
  columnsDesktop: 2 | 3 | 4;
  columnsMobile: 1 | 2;
}
```

---

### 4. Image with Text
**File**: `frontend/components/home/ImageWithText.tsx`

**Purpose**: Side-by-side image and text block
**Shopify Source**: `image-with-text.liquid`

**Features Needed**:
- Image on left or right
- Text content with heading, paragraph, button
- Responsive (stacks on mobile)

**Props Interface**:
```typescript
interface ImageWithTextProps {
  image: string;
  imagePosition: 'left' | 'right';
  heading: string;
  text: string;
  buttonText?: string;
  buttonLink?: string;
}
```

---

### 5. Collapsible Content / Accordion
**File**: `frontend/components/home/CollapsibleContent.tsx`

**Purpose**: FAQ/expandable content sections
**Shopify Source**: `collapsible-content.liquid`

**Features Needed**:
- Accordion items
- Expand/collapse animation
- Rich text content support
- Optional icon

**Props Interface**:
```typescript
interface CollapsibleItem {
  heading: string;
  content: string;
  icon?: string;
}

interface CollapsibleContentProps {
  title?: string;
  items: CollapsibleItem[];
  allowMultipleOpen?: boolean;
}
```

---

## 📦 Phase 2B: RINOS Custom Sections (Week 2)

### 6. FAQ Sections (4 variants)
**Files**:
- `frontend/components/faq/FAQGeneral.tsx`
- `frontend/components/faq/FAQAssembly.tsx`
- `frontend/components/faq/FAQDelivery.tsx`
- `frontend/components/faq/FAQBikeSpec.tsx`

**Purpose**: Specialized FAQ sections for different topics
**Shopify Sources**: `section-faq-*.liquid`

**Features Needed**:
- Reuse CollapsibleContent component
- Pre-populated German content
- Category-specific icons
- Search functionality (future)

**Content Structure**:
```typescript
interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'assembly' | 'delivery' | 'bikespec';
}
```

**German Content Examples**:
```typescript
// FAQGeneral
{
  question: "Welche Zahlungsmethoden akzeptieren Sie?",
  answer: "Wir akzeptieren Kreditkarten, SEPA-Lastschrift, Sofortüberweisung und PayPal."
}

// FAQDelivery
{
  question: "Wie lange dauert die Lieferung nach Österreich?",
  answer: "Die Lieferung innerhalb Österreichs dauert in der Regel 3-5 Werktage."
}
```

---

### 7. Trust Marquee
**File**: `frontend/components/home/TrustMarquee.tsx`

**Purpose**: Scrolling trust badges/features
**Shopify Source**: `trust-marquee.liquid`

**Features Needed**:
- Auto-scrolling badges
- Infinite loop
- Icons + text
- Pause on hover

**Example Content**:
```typescript
const trustBadges = [
  { icon: 'shipping', text: 'Kostenloser Versand ab 100€' },
  { icon: 'warranty', text: '5 Jahre Garantie' },
  { icon: 'support', text: '24/7 Kundensupport' },
  { icon: 'returns', text: '30 Tage Rückgaberecht' }
];
```

---

### 8. Review Section
**File**: `frontend/components/reviews/ReviewSection.tsx`

**Purpose**: Customer reviews/testimonials
**Shopify Sources**: `review-section.liquid`, `review-section-small.liquid`

**Features Needed**:
- Star ratings
- Customer name and date
- Review text
- Product link
- Two variants: full and compact

**Props Interface**:
```typescript
interface Review {
  rating: number;
  author: string;
  date: string;
  text: string;
  productName?: string;
  verified?: boolean;
}

interface ReviewSectionProps {
  title: string;
  reviews: Review[];
  variant: 'full' | 'small';
  averageRating?: number;
  totalReviews?: number;
}
```

---

### 9. Bike Comparison Tables (3 variants)
**Files**:
- `frontend/components/comparison/ComparisonTable.tsx` (generic)
- `frontend/components/comparison/MTBComparison.tsx`
- `frontend/components/comparison/RoadComparison.tsx`

**Purpose**: Compare bike specifications side-by-side
**Shopify Sources**: `rinos-comparison-*.liquid`

**Features Needed**:
- Table with sticky header
- Highlight differences
- Filter by feature
- Responsive (horizontal scroll on mobile)
- German labels

**Data Structure**:
```typescript
interface BikeSpec {
  model: string;
  price: number;
  frame: string;
  fork: string;
  groupset: string;
  wheels: string;
  weight: string;
  sizes: string[];
}

interface ComparisonTableProps {
  bikes: BikeSpec[];
  category: 'mtb' | 'road' | 'gravel';
}
```

**Example German Labels**:
```typescript
const labels = {
  model: 'Modell',
  price: 'Preis',
  frame: 'Rahmen',
  fork: 'Gabel',
  groupset: 'Schaltgruppe',
  wheels: 'Laufräder',
  weight: 'Gewicht',
  sizes: 'Verfügbare Größen'
};
```

---

## 📦 Phase 2C: Additional Content (Week 3)

### 10. Slideshow Component
**File**: `frontend/components/home/Slideshow.tsx`

**Purpose**: Image carousel with auto-play
**Shopify Source**: `slideshow.liquid`

**Features Needed**:
- Auto-advance slides
- Navigation dots
- Previous/Next arrows
- Slide content (image + text + button)
- Transition effects

---

### 11. Rich Text Block
**File**: `frontend/components/home/RichText.tsx`

**Purpose**: Formatted text content
**Shopify Source**: `rich-text.liquid`

**Features Needed**:
- HTML content rendering
- Typography styling
- Heading sizes
- Text alignment

---

### 12. Email Signup Banner
**File**: `frontend/components/home/EmailSignup.tsx`

**Purpose**: Newsletter subscription
**Shopify Source**: `email-signup-banner.liquid`

**Features Needed**:
- Email input
- Submit button
- Success/error messages
- Background image support
- GDPR checkbox (Austria requirement)

**German Text**:
```typescript
{
  heading: 'Newsletter abonnieren',
  subheading: 'Erhalten Sie exklusive Angebote und Neuigkeiten',
  placeholder: 'Ihre E-Mail-Adresse',
  button: 'Abonnieren',
  gdpr: 'Ich stimme der Datenschutzerklärung zu',
  success: 'Vielen Dank für Ihre Anmeldung!',
  error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
}
```

---

### 13. Assembly Guide Component
**File**: `frontend/components/assembly/AssemblyGuide.tsx`

**Purpose**: Step-by-step bike assembly instructions
**Shopify Source**: `Gravel-assembly.liquid`

**Features Needed**:
- Step numbers
- Images per step
- Expand/collapse steps
- Video embed support
- German instructions
- Printable version

**Data Structure**:
```typescript
interface AssemblyStep {
  stepNumber: number;
  title: string;
  description: string;
  image?: string;
  video?: string;
  tools?: string[];
  estimatedTime?: string;
}
```

---

## 🏗️ Implementation Strategy

### Component Architecture

```
frontend/components/
├── home/
│   ├── FeaturedCollection.tsx
│   ├── ImageBanner.tsx
│   ├── MultiColumn.tsx
│   ├── ImageWithText.tsx
│   ├── CollapsibleContent.tsx
│   ├── TrustMarquee.tsx
│   ├── Slideshow.tsx
│   ├── RichText.tsx
│   └── EmailSignup.tsx
├── faq/
│   ├── FAQGeneral.tsx
│   ├── FAQAssembly.tsx
│   ├── FAQDelivery.tsx
│   └── FAQBikeSpec.tsx
├── reviews/
│   └── ReviewSection.tsx
├── comparison/
│   ├── ComparisonTable.tsx
│   ├── MTBComparison.tsx
│   └── RoadComparison.tsx
└── assembly/
    └── AssemblyGuide.tsx
```

---

## 📋 Implementation Checklist

### Week 1: Core Content Sections
- [ ] FeaturedCollection component
- [ ] ImageBanner component
- [ ] MultiColumn component
- [ ] ImageWithText component
- [ ] CollapsibleContent component

### Week 2: RINOS Custom Sections
- [ ] FAQ components (all 4)
- [ ] TrustMarquee component
- [ ] ReviewSection component
- [ ] Comparison tables (all 3)

### Week 3: Additional & Polish
- [ ] Slideshow component
- [ ] RichText component
- [ ] EmailSignup component
- [ ] AssemblyGuide component
- [ ] German translations for all components
- [ ] Mobile responsiveness testing
- [ ] Integration with home page

---

## 🌍 German Localization Requirements

All components need German content:

1. **Button Text**:
   - "View all" → "Alle anzeigen"
   - "Learn more" → "Mehr erfahren"
   - "Add to cart" → "In den Warenkorb"
   - "Subscribe" → "Abonnieren"

2. **Common Labels**:
   - "Price" → "Preis"
   - "Features" → "Eigenschaften"
   - "Specifications" → "Spezifikationen"
   - "Reviews" → "Bewertungen"

3. **Error Messages**:
   - "Required field" → "Pflichtfeld"
   - "Invalid email" → "Ungültige E-Mail-Adresse"
   - "Something went wrong" → "Etwas ist schief gelaufen"

---

## 🎨 Styling Guidelines

All components should follow existing design system:

```typescript
// Colors (from tailwind.config.js)
const colors = {
  primary: '#your-primary-color',
  secondary: '#your-secondary-color',
  // ... etc
};

// Typography
- Headings: font-normal
- Body: text-gray-600
- Buttons: btn btn-primary

// Spacing
- Container: max-w-container mx-auto px-4
- Section padding: py-8 or py-16
```

---

## 🧪 Testing Requirements

For each component:

1. **Functional Testing**:
   - Component renders correctly
   - Props work as expected
   - Interactive elements function
   - API integration works

2. **Responsive Testing**:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1280px+)

3. **Browser Testing**:
   - Chrome
   - Firefox
   - Safari
   - Edge

---

## 📦 Data Integration

Components will need to integrate with:

1. **Product API** (already exists)
   - `/api/products`
   - Featured collections

2. **Email API** (to implement)
   - Newsletter subscription endpoint

3. **Reviews API** (to implement)
   - Review submission
   - Review fetching

---

## 🚀 Deployment Strategy

After each component is completed:

1. Test locally
2. Commit to GitHub
3. Deploy to Vercel staging
4. QA testing
5. Deploy to production

---

## 📊 Success Metrics

Track these after implementation:

- Homepage bounce rate (should decrease)
- Time on site (should increase)
- Newsletter signups (new metric)
- Product comparison usage (new metric)
- FAQ section engagement (new metric)

---

## 🔗 Next Steps

1. **Review this plan** with stakeholders
2. **Prioritize** which sections to build first
3. **Start with** FeaturedCollection + ImageBanner (most visible)
4. **Iterate** based on feedback
5. **Launch** incrementally

---

**Estimated Development Time**: 2-3 weeks
**Components to Build**: 13 main components
**Languages**: English (dev) → German (production)
**Target Completion**: [Set date based on team capacity]
