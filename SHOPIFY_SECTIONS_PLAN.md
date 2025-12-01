# Shopify-Style Sections Implementation Plan
## RINOS Bikes - Product Page Enhancements

### Overview
This document tracks the implementation of Shopify-style product page sections with comparison tables, features, and specifications. All content will be in German, with English tag names.

---

## Section Status

### ✅ COMPLETED SECTIONS
- [ ] None yet

### 🔄 IN PROGRESS
- [x] Planning document created

### 📋 PENDING SECTIONS
1. [ ] Comparison Table Component
2. [ ] Bike Model Comparison Section
3. [ ] Features Highlight Section
4. [ ] Technical Specifications Table
5. [ ] Why Choose RINOS Section
6. [ ] Size Guide Section
7. [ ] Integration into Product Pages

---

## Section 1: Comparison Table Component
**File**: `frontend/components/common/ComparisonTable.tsx`

**Description**: Reusable comparison table component similar to Shopify's product comparison tables.

**Features**:
- Responsive design (mobile: stacked, tablet/desktop: side-by-side)
- Support for 2-4 products comparison
- Highlighted differences
- Checkmarks and X marks for features
- German content support

**Status**: ⏳ Pending

---

## Section 2: Bike Model Comparison Section
**File**: `frontend/components/produkte/BikeComparisonSection.tsx`

**Description**: Compare different RINOS bike models (Sandman, Gaia, etc.) with key specifications.

**Content (German)**:
- Modellvergleich (Model Comparison)
- Rahmen (Frame)
- Schaltung (Drivetrain)
- Bremsen (Brakes)
- Preis (Price)
- Einsatzbereich (Use Case)

**Example Models**:
- Sandman 1.0 (Shimano R3000)
- Sandman 4.0 (Shimano GRX 400)
- Sandman 6.0 (Shimano GRX 600)
- Sandman 8.0 (Shimano GRX 800)
- Gaia 2.0 (SRAM Rival)

**Status**: ⏳ Pending

---

## Section 3: Features Highlight Section
**File**: `frontend/components/produkte/FeaturesHighlight.tsx`

**Description**: Highlight key features with icons and descriptions.

**Content Categories (German)**:
1. **Rahmen & Geometrie** (Frame & Geometry)
   - Carbon-Rahmen
   - Optimierte Geometrie für Gravel
   - Integrierte Kabelführung

2. **Komponenten** (Components)
   - Shimano/SRAM Schaltgruppen
   - Hydraulische Scheibenbremsen
   - Tubeless-Ready Laufräder

3. **Vielseitigkeit** (Versatility)
   - Mehrere Befestigungspunkte
   - Reifenfreiheit bis 45mm
   - Schutzblech-kompatibel

4. **Service & Support** (Service & Support)
   - Kostenloser Versand
   - 30 Tage Rückgaberecht
   - 2 Jahre Garantie

**Status**: ⏳ Pending

---

## Section 4: Technical Specifications Table
**File**: `frontend/components/produkte/SpecificationsTable.tsx`

**Description**: Detailed technical specifications table for each bike model.

**Specification Categories (German)**:

### Rahmen (Frame)
- Material
- Größen verfügbar
- Geometrie-Tabelle Link

### Antrieb (Drivetrain)
- Schaltgruppe
- Anzahl Gänge
- Übersetzung
- Kurbel
- Kassette
- Kette

### Bremsen (Brakes)
- Typ
- Marke/Modell
- Scheibengröße

### Laufräder & Reifen (Wheels & Tires)
- Felgen
- Naben
- Reifen
- Reifengröße

### Cockpit
- Lenker
- Vorbau
- Sattel
- Sattelstütze

### Gewicht & Weitere Specs
- Gewicht (ca.)
- Max. Zuladung
- Farben verfügbar

**Status**: ⏳ Pending

---

## Section 5: Why Choose RINOS Section
**File**: `frontend/components/produkte/WhyChooseRinos.tsx`

**Description**: USP (Unique Selling Points) section explaining why customers should choose RINOS bikes.

**Content (German)**:

### Warum RINOS Bikes?

1. **Direkt vom Hersteller**
   - Keine Zwischenhändler
   - Beste Preise
   - Persönlicher Service

2. **Premium Qualität**
   - Hochwertige Carbon-Rahmen
   - Top-Marken Komponenten (Shimano, SRAM)
   - Strenge Qualitätskontrollen

3. **Made for Adventure**
   - Entwickelt für Gravel & Allroad
   - Getestet in den Alpen
   - Vielseitig einsetzbar

4. **Kundenservice**
   - Kostenlose Beratung
   - Montageservice verfügbar
   - 2 Jahre Garantie

**Status**: ⏳ Pending

---

## Section 6: Size Guide Section
**File**: `frontend/components/produkte/SizeGuideSection.tsx`

**Description**: Interactive size guide to help customers choose the right frame size.

**Content (German)**:

### Größentabelle (Size Guide)

| Rahmengröße | Körpergröße | Schrittlänge | Empfehlung |
|-------------|-------------|--------------|------------|
| XS          | 155-165 cm  | 76-80 cm     | Ideal für kleine Fahrer |
| S           | 165-172 cm  | 78-82 cm     | Komfortables Handling |
| M           | 172-180 cm  | 81-85 cm     | Beliebteste Größe |
| L           | 180-188 cm  | 84-88 cm     | Sportliche Position |
| XL          | 188-198 cm  | 87-92 cm     | Für große Fahrer |

**Additional Features**:
- Size calculator (Körpergröße + Schrittlänge eingeben)
- Geometry charts
- Video guide link

**Status**: ⏳ Pending

---

## Section 7: Integration Plan

### Product Detail Page (`frontend/app/products/[id]/page.tsx`)

**Section Order**:
1. Product Images & Title
2. Price & Add to Cart
3. Variation Selectors (Color, Size, Components)
4. **[NEW] Features Highlight Section**
5. Product Description (existing)
6. **[NEW] Technical Specifications Table**
7. **[NEW] Size Guide Section** (if bike product)
8. **[NEW] Bike Model Comparison** (if bike product)
9. **[NEW] Why Choose RINOS Section**
10. Related Products (existing)

**Status**: ⏳ Pending

---

## Component Architecture

```
frontend/
├── components/
│   ├── common/
│   │   ├── ComparisonTable.tsx          [NEW]
│   │   └── FeatureCard.tsx              [NEW]
│   └── produkte/
│       ├── BikeComparisonSection.tsx    [NEW]
│       ├── FeaturesHighlight.tsx        [NEW]
│       ├── SpecificationsTable.tsx      [NEW]
│       ├── WhyChooseRinos.tsx           [NEW]
│       └── SizeGuideSection.tsx         [NEW]
```

---

## Design Guidelines

### Colors (from RINOS branding)
- Primary: Yellow/Gold (#FFD700 or similar)
- Secondary: Black (#000000)
- Background: White (#FFFFFF)
- Accent: Dark Gray (#333333)

### Typography
- Headings: Bold, clear hierarchy
- Body: Readable font size (16px minimum)
- Tables: Monospace for numbers

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## German Translations Reference

### Common Terms
- Vergleichen = Compare
- Spezifikationen = Specifications
- Merkmale = Features
- Größentabelle = Size Guide
- Rahmen = Frame
- Schaltung = Drivetrain/Gears
- Bremsen = Brakes
- Laufräder = Wheels
- Gewicht = Weight
- Verfügbar = Available
- Lieferzeit = Delivery Time
- Kostenloser Versand = Free Shipping
- Garantie = Warranty

---

## Next Steps

1. ✅ Create this planning document
2. ⏳ Create ComparisonTable.tsx component
3. ⏳ Create BikeComparisonSection.tsx with Sandman/Gaia data
4. ⏳ Create FeaturesHighlight.tsx with icons
5. ⏳ Create SpecificationsTable.tsx with bike specs
6. ⏳ Create WhyChooseRinos.tsx USP section
7. ⏳ Create SizeGuideSection.tsx with calculator
8. ⏳ Integrate all sections into product page
9. ⏳ Test responsive design on mobile/tablet/desktop
10. ⏳ Deploy and verify on production

---

## Notes

- All content must be in German for the Austrian market
- Use rinosbike.eu as reference for style and content structure
- Ensure mobile-first responsive design
- Add loading states for dynamic data
- Include proper TypeScript types
- Follow existing code style in the project

---

**Last Updated**: December 1, 2025
**Status**: Planning Phase - Ready to implement
