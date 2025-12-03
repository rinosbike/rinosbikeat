# backend/utils/slugs.py
"""
URL slug generation utilities for SEO-friendly URLs (Shopify-style)
"""
import re
import unicodedata


def generate_slug(text: str, articlenr: str = None) -> str:
    """
    Generate SEO-friendly URL slug from product name

    Examples:
        - "RINOS Gaia 2 Gravel Bike" + "RINOS24GRX400" -> "rinos-gaia-2-gravel-bike-rinos24grx400"
        - "RINOS Sandman 6.0 Gravelbike" + "SANDMAN6" -> "rinos-sandman-60-gravelbike-sandman6"

    Args:
        text: Product name or text to slugify
        articlenr: Optional article number to append for uniqueness

    Returns:
        URL-safe slug string
    """
    if not text:
        return articlenr.lower() if articlenr else ""

    # Normalize unicode characters (ö -> o, ä -> a, ü -> u, ß -> ss, etc.)
    text = unicodedata.normalize('NFKD', text)
    text = text.encode('ascii', 'ignore').decode('ascii')

    # Convert to lowercase
    text = text.lower()

    # Remove any characters that aren't alphanumeric, spaces, or hyphens
    text = re.sub(r'[^\w\s-]', '', text)

    # Replace spaces and underscores with hyphens
    text = re.sub(r'[\s_]+', '-', text)

    # Remove multiple consecutive hyphens
    text = re.sub(r'-+', '-', text)

    # Strip hyphens from start and end
    text = text.strip('-')

    # Append article number for uniqueness (Shopify-style)
    if articlenr:
        text = f"{text}-{articlenr.lower()}"

    return text


def generate_category_slug(category_name: str) -> str:
    """
    Generate SEO-friendly slug for category pages

    Examples:
        - "Gravel Bikes" -> "gravel-bikes"
        - "E-Bikes & Pedelecs" -> "e-bikes-pedelecs"

    Args:
        category_name: Category name to slugify

    Returns:
        URL-safe category slug
    """
    return generate_slug(category_name)
