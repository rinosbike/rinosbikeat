# How to Use the Shopify-Style Sections

## Overview

This guide shows how to integrate the newly created comparison tables and sections into your product pages.

## Created Components

### ✅ Completed Components

1. **ComparisonTable.tsx** - Reusable comparison table component
2. **BikeComparisonSection.tsx** - Bike model comparison section
3. **FeaturesHighlight.tsx** - Features highlight with icons
4. **SpecificationsTable.tsx** - Technical specifications table

All components are in German and mobile-responsive.

---

## Usage Example 1: Full Product Page

Add these sections to your product detail page (`frontend/app/products/[id]/page.tsx`):

```tsx
import BikeComparisonSection from '@/components/produkte/BikeComparisonSection';
import FeaturesHighlight, { FeaturesCompact } from '@/components/produkte/FeaturesHighlight';
import SpecificationsTable from '@/components/produkte/SpecificationsTable';

export default function ProductPage({ params }: { params: { id: string } }) {
  // ... your existing product loading logic ...

  return (
    <div>
      {/* Existing product header, images, price, etc. */}

      {/* NEW: Compact features (right after Add to Cart) */}
      <div className="my-8">
        <FeaturesCompact />
      </div>

      {/* Existing product description */}

      {/* NEW: Full Features Highlight Section */}
      <FeaturesHighlight
        title="Warum Sandman 4.0?"
        columns={4}
      />

      {/* NEW: Technical Specifications */}
      <SpecificationsTable
        title="Technische Details"
        defaultExpanded={false}
      />

      {/* NEW: Model Comparison (if it's a Sandman bike) */}
      {product.articlename?.includes('Sandman') && (
        <BikeComparisonSection comparisonType="sandman" />
      )}

      {/* Existing related products, etc. */}
    </div>
  );
}
```

---

## Usage Example 2: Standalone Comparison Page

Create a dedicated comparison page (`frontend/app/vergleich/page.tsx`):

```tsx
import BikeComparisonSection from '@/components/produkte/BikeComparisonSection';

export default function VergleichPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          RINOS Bikes Vergleich
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Vergleiche alle unsere Modelle und finde dein perfektes Gravel Bike
        </p>

        {/* Sandman Series Comparison */}
        <BikeComparisonSection comparisonType="sandman" />

        {/* Sandman vs Gaia Comparison */}
        <div className="mt-16">
          <BikeComparisonSection comparisonType="sandman-gaia" />
        </div>
      </div>
    </div>
  );
}
```

---

## Usage Example 3: Custom Comparison Table

Use the ComparisonTable component directly for custom comparisons:

```tsx
import ComparisonTable, {
  ComparisonColumn,
  ComparisonRow
} from '@/components/common/ComparisonTable';

export default function CustomComparison() {
  const columns: ComparisonColumn[] = [
    { id: 'basic', name: 'Basic' },
    { id: 'pro', name: 'Pro', highlighted: true },
    { id: 'premium', name: 'Premium' }
  ];

  const rows: ComparisonRow[] = [
    {
      label: 'Preis',
      values: ['1.299 €', '1.899 €', '2.499 €'],
      highlighted: true
    },
    {
      label: 'Carbon Rahmen',
      values: [false, true, true]
    },
    {
      label: 'Elektronische Schaltung',
      values: [false, false, true]
    }
  ];

  return (
    <ComparisonTable
      title="Paketvergleich"
      description="Wähle das richtige Paket für deine Bedürfnisse"
      columns={columns}
      rows={rows}
    />
  );
}
```

---

## Usage Example 4: Homepage Features Section

Add the features section to your homepage:

```tsx
import FeaturesHighlight from '@/components/produkte/FeaturesHighlight';

export default function HomePage() {
  return (
    <div>
      {/* Hero section, etc. */}

      {/* Features Section */}
      <FeaturesHighlight
        title="Warum RINOS Bikes?"
        description="Premium Carbon Gravel Bikes direkt vom Hersteller"
        columns={4}
      />

      {/* Rest of homepage */}
    </div>
  );
}
```

---

## Usage Example 5: Product Category Page

Show compact comparison on category pages:

```tsx
import BikeComparisonSection from '@/components/produkte/BikeComparisonSection';

export default function GravelBikesPage() {
  return (
    <div>
      <h1>Gravel Bikes</h1>

      {/* Product grid */}
      <ProductGrid products={products} />

      {/* Comparison Section at bottom */}
      <BikeComparisonSection comparisonType="sandman" />
    </div>
  );
}
```

---

## Customization Options

### ComparisonTable

```tsx
<ComparisonTable
  columns={columns}           // Required
  rows={rows}                 // Required
  title="Custom Title"        // Optional
  description="Description"   // Optional
  className="my-custom-class" // Optional
/>
```

### BikeComparisonSection

```tsx
<BikeComparisonSection
  comparisonType="sandman"    // 'sandman' | 'sandman-gaia'
  className="my-custom-class" // Optional
/>
```

### FeaturesHighlight

```tsx
<FeaturesHighlight
  features={customFeatures}   // Optional (uses defaults if not provided)
  title="Custom Title"        // Optional
  description="Description"   // Optional
  columns={3}                 // 2 | 3 | 4 (default: 4)
  className="my-custom-class" // Optional
/>
```

### SpecificationsTable

```tsx
<SpecificationsTable
  specifications={customSpecs} // Optional (uses Sandman 4.0 defaults)
  title="Custom Title"         // Optional
  description="Description"    // Optional
  defaultExpanded={true}       // Optional (default: false)
  className="my-custom-class"  // Optional
/>
```

---

## Mobile Responsiveness

All components are fully responsive:

- **ComparisonTable**: Switches to stacked cards on mobile
- **BikeComparisonSection**: Adapts columns automatically
- **FeaturesHighlight**: Responsive grid (1 col mobile → 4 cols desktop)
- **SpecificationsTable**: Touch-friendly accordions

---

## Styling Notes

### Colors Used
- Primary: Yellow/Gold (#FFD700) - for highlights
- Secondary: Black (#000000) - for text
- Background: White/Gray-50 - for sections
- Accent: Gray-900 - for buttons

### Tailwind Classes
All components use Tailwind CSS classes. Make sure your `tailwind.config.js` includes:

```js
content: [
  './app/**/*.{js,ts,jsx,tsx}',
  './components/**/*.{js,ts,jsx,tsx}',
],
```

### Icons
Uses `lucide-react` icons. Install if not already:

```bash
npm install lucide-react
```

---

## German Content Examples

### Common Translations
- Vergleichen = Compare
- Spezifikationen = Specifications
- Merkmale = Features
- Größentabelle = Size Guide
- Verfügbar = Available
- Kostenloser Versand = Free Shipping

### Section Titles
- "Modellvergleich" = Model Comparison
- "Technische Spezifikationen" = Technical Specifications
- "Warum RINOS Bikes?" = Why RINOS Bikes?
- "Was macht RINOS Bikes besonders?" = What makes RINOS Bikes special?

---

## Next Steps

1. Test the components on a development environment
2. Customize the data (prices, specs, features) to match your actual products
3. Add more bike models to the comparison
4. Create custom spec sheets for each bike model
5. Add image galleries to the comparison tables
6. Integrate with your product API for dynamic data

---

## Support

For questions or customizations, refer to:
- `SHOPIFY_SECTIONS_PLAN.md` - Full planning document
- Component source files in `frontend/components/`
- Tailwind CSS documentation for styling changes
