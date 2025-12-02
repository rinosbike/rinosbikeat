# Remaining Changes for Product Variations

## Changes Made:
1. ✅ Added translation map for colors (English -> German)
2. ✅ Added `translateValue()` function
3. ✅ Updated `handleAttributeChange` to reset images when color changes

## Changes Still Needed:

###  1. Update Variation Button Labels (Line ~390-400)

**Location**: Around line 390 in the variation rendering section

**Find this code:**
```typescript
{values.map((value) => (
  <button
    key={value}
    onClick={() => handleAttributeChange(varType, value)}
    className={`px-4 py-2 border-2 transition-all ${
      selectedAttributes[varType] === value
        ? 'border-blue-600 bg-blue-50 font-medium'
        : 'border-gray-300 hover:border-gray-400'
    }`}
  >
    {value}
  </button>
))}
```

**Replace with:**
```typescript
{values.map((value) => (
  <button
    key={value}
    onClick={() => handleAttributeChange(varType, value)}
    className={`px-4 py-2 border-2 transition-all ${
      selectedAttributes[varType] === value
        ? 'border-blue-600 bg-blue-50 font-medium'
        : 'border-gray-300 hover:border-gray-400'
    }`}
  >
    {translateValue(value)}
  </button>
))}
```

### 2. Update Fallback Variation Labels (Line ~420-435)

**Location**: In the fallback variation rendering

**Find code similar to:**
```typescript
<button
  key={color}
  onClick={() => handleAttributeChange('Farbe', color)}
  className={...}
>
  {color}
</button>
```

**Replace with:**
```typescript
<button
  key={color}
  onClick={() => handleAttributeChange('Farbe', color)}
  className={...}
>
  {translateValue(color)}
</button>
```

### 3. Add Image Zoom Modal

**Location**: At the end of the return statement, before the closing `</div>`

**Add this code:**
```typescript
{/* Image Zoom Modal */}
{isImageZoomed && product.images && product.images.length > 0 && (
  <div
    className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
    onClick={() => setIsImageZoomed(false)}
  >
    <button
      className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      onClick={() => setIsImageZoomed(false)}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>

    <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
      {/* Previous Image Button */}
      {product.images.length > 1 && selectedImageIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setSelectedImageIndex(selectedImageIndex - 1)
          }}
          className="absolute left-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-3 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      )}

      {/* Zoomed Image */}
      <img
        src={product.images[selectedImageIndex]}
        alt={`${product.articlename} - Full size`}
        className="max-h-full max-w-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next Image Button */}
      {product.images.length > 1 && selectedImageIndex < product.images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setSelectedImageIndex(selectedImageIndex + 1)
          }}
          className="absolute right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-3 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      )}

      {/* Image Counter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full">
        {selectedImageIndex + 1} / {product.images.length}
      </div>
    </div>
  </div>
)}
```

### 4. Make Main Image Clickable for Zoom

**Location**: Around line 295 where the main image is displayed

**Find:**
```typescript
<div className="aspect-square w-full bg-white rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
  <img
    src={product.images[selectedImageIndex]}
    alt={`${product.articlename} - Image ${selectedImageIndex + 1}`}
    className="w-full h-full object-contain"
  />
</div>
```

**Replace with:**
```typescript
<div
  className="aspect-square w-full bg-white rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden cursor-zoom-in hover:opacity-95 transition-opacity"
  onClick={() => setIsImageZoomed(true)}
>
  <img
    src={product.images[selectedImageIndex]}
    alt={`${product.articlename} - Image ${selectedImageIndex + 1}`}
    className="w-full h-full object-contain"
  />
</div>
```

### 5. Get Images from Selected Variation

**Location**: Top of the render section, after `const finalPrice = getSelectedVariationPrice()`

**Add this code:**
```typescript
// Get images for the currently selected variation
const currentImages = (() => {
  if (selectedVariation && variationData?.variations) {
    const variation = variationData.variations.find(v => v.articlenr === selectedVariation)
    if (variation && variation.images && variation.images.length > 0) {
      return variation.images
    }
  }
  if (selectedVariation && product?.variations) {
    const variation = product.variations.find(v => v.articlenr === selectedVariation)
    if (variation && variation.images && variation.images.length > 0) {
      return variation.images
    }
  }
  return product?.images || []
})()
```

**Then change all references from `product.images` to `currentImages` in the image gallery section**

## Summary

These changes will:
1. ✅ Translate English color names to German
2. ✅ Change product images when user selects different colors
3. ✅ Add zoom functionality when clicking on product images
4. ✅ Allow navigation through images in zoom mode
