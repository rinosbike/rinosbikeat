// frontend/lib/slugs.ts
/**
 * SEO-friendly URL slug utilities (Shopify-style)
 * Generates and parses product slugs like: "/produkte/rinos-gaia-2-gravel-bike-rinos24grx400"
 */

/**
 * Generate SEO-friendly slug from product name and article number
 * Example: ("RINOS Gaia 2 Gravel Bike", "RINOS24GRX400") -> "rinos-gaia-2-gravel-bike-rinos24grx400"
 */
export function generateProductSlug(productName: string, articlenr: string): string {
  if (!productName) {
    return articlenr.toLowerCase()
  }

  // Normalize unicode characters (ö -> o, ä -> a, ü -> u, ß -> ss)
  let slug = productName.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')

  // Convert to lowercase
  slug = slug.toLowerCase()

  // Remove any characters that aren't alphanumeric, spaces, or hyphens
  slug = slug.replace(/[^\w\s-]/g, '')

  // Replace spaces and underscores with hyphens
  slug = slug.replace(/[\s_]+/g, '-')

  // Remove multiple consecutive hyphens
  slug = slug.replace(/-+/g, '-')

  // Strip hyphens from start and end
  slug = slug.trim().replace(/^-+|-+$/g, '')

  // Append article number for uniqueness (Shopify-style)
  if (articlenr) {
    slug = `${slug}-${articlenr.toLowerCase()}`
  }

  return slug
}

/**
 * Extract article number from a product slug
 * Example: "rinos-gaia-2-gravel-bike-rinos24grx400" -> "RINOS24GRX400"
 * Falls back to the input if it looks like an article number already
 */
export function extractArticleNrFromSlug(slug: string): string {
  // If it's already an article number (uppercase with numbers), return as-is
  if (/^[A-Z0-9]+$/i.test(slug)) {
    return slug.toUpperCase()
  }

  // Extract the last segment (should be the article number)
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]

  // Look for article number pattern (letters + numbers)
  // Try to find the article number in the last few segments
  for (let i = parts.length - 1; i >= Math.max(0, parts.length - 3); i--) {
    const segment = parts.slice(i).join('')
    // Check if this looks like an article number (mix of letters and numbers)
    if (/^[a-z]+\d+[a-z]*\d*$/i.test(segment)) {
      return segment.toUpperCase()
    }
  }

  // Fallback: return the slug as-is (uppercase)
  return slug.toUpperCase()
}

/**
 * Generate category slug
 * Example: "Gravel Bikes" -> "gravel-bikes"
 */
export function generateCategorySlug(categoryName: string): string {
  return generateProductSlug(categoryName, '')
}
