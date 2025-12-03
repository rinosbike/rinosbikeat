#!/usr/bin/env python3
"""
Update produkte/[slug]/page.tsx to support SEO-friendly slug URLs
"""

# Read the file
with open('frontend/app/produkte/[slug]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update comment at top
content = content.replace(
    'Product Detail Page - /produkte/[id]',
    'Product Detail Page - /produkte/[slug]\n * Supports SEO-friendly URLs like: /produkte/rinos-gaia-2-gravel-bike-rinos24grx400'
)

# 2. Add slug import (after the Link import)
if 'extractArticleNrFromSlug' not in content:
    content = content.replace(
        "import Link from 'next/link'",
        "import Link from 'next/link'\nimport { extractArticleNrFromSlug } from '@/lib/slugs'"
    )

# 3. Update interface
content = content.replace(
    'interface ProductDetailPageProps {\n  params: {\n    id: string\n  }\n}',
    'interface ProductDetailPageProps {\n  params: {\n    slug: string\n  }\n}'
)

# 4. Update useEffect dependency
content = content.replace('}, [params.id])', '}, [params.slug])')

# 5. Update loadProduct function
old_str = '''  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      // params.id can be either a numeric product ID or an article number string
      const data = await productsApi.getById(params.id)'''

new_str = '''  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      // Extract article number from SEO-friendly slug
      // Supports both: "rinos-gaia-2-gravel-bike-rinos24grx400" and "RINOS24GRX400"
      const articlenr = extractArticleNrFromSlug(params.slug)
      console.log('Loading product from slug:', params.slug, '-> article nr:', articlenr)

      const data = await productsApi.getById(articlenr)'''

content = content.replace(old_str, new_str)

# 6. Update back link
content = content.replace('href="/products"', 'href="/produkte"')

# Write the updated content
with open('frontend/app/produkte/[slug]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('✓ Successfully updated produkte/[slug]/page.tsx with slug support')
print('  - Updated route parameter from id to slug')
print('  - Added extractArticleNrFromSlug import')
print('  - Updated loadProduct to extract article number from slug')
print('  - Updated back link to /produkte')
