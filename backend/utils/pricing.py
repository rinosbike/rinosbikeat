"""
Pricing utilities for multi-country VAT conversion
Converts BRUTTO prices from German VAT (19%) to other countries' VAT rates
"""

from decimal import Decimal
from typing import Optional


# VAT rates by country (in percentage)
VAT_RATES = {
    "AT": Decimal("20.0"),  # Austria
    "DE": Decimal("19.0"),  # Germany
    "FR": Decimal("20.0"),  # France
    "IT": Decimal("22.0"),  # Italy
    "ES": Decimal("21.0"),  # Spain
    "NL": Decimal("21.0"),  # Netherlands
    "BE": Decimal("21.0"),  # Belgium
    "PL": Decimal("23.0"),  # Poland
    "CZ": Decimal("21.0"),  # Czech Republic
    "CH": Decimal("7.7"),   # Switzerland
    "GB": Decimal("20.0"),  # United Kingdom
    "SE": Decimal("25.0"),  # Sweden
    "DK": Decimal("25.0"),  # Denmark
    "NO": Decimal("25.0"),  # Norway
}

# German VAT rate (prices in DB include this)
GERMAN_VAT_RATE = Decimal("19.0")


def validate_country_code(country_code: str) -> bool:
    """Validate if country code exists in VAT_RATES"""
    return country_code.upper() in VAT_RATES


def get_vat_rate(country_code: str) -> Decimal:
    """
    Get VAT rate for country
    Returns rate as decimal (e.g., 20.0 for 20%)
    Defaults to Austria (20%) if country not found
    """
    code = country_code.upper()
    if not validate_country_code(code):
        return VAT_RATES["AT"]  # Default to Austria
    return VAT_RATES[code]


def convert_brutto_to_netto(brutto_price: float) -> Decimal:
    """
    Convert BRUTTO price (includes German 19% VAT) to NETTO (net price)
    
    Formula: netto = brutto / 1.19
    
    Args:
        brutto_price: Price from database (includes 19% German VAT)
    
    Returns:
        Decimal: Net price (without VAT)
    
    Example:
        >>> convert_brutto_to_netto(1190)
        Decimal('1000.00')
    """
    brutto = Decimal(str(brutto_price))
    netto = brutto / (Decimal("100") + GERMAN_VAT_RATE) * Decimal("100")
    return round(netto, 2)


def apply_country_vat(netto_price: Decimal, country_code: str) -> Decimal:
    """
    Apply target country VAT to net price
    
    Formula: final_price = netto * (1 + vat_rate/100)
    
    Args:
        netto_price: Net price (without VAT)
        country_code: Target country code (e.g., "AT", "DE")
    
    Returns:
        Decimal: Final BRUTTO price for the country
    
    Example:
        >>> apply_country_vat(Decimal('1000'), 'AT')
        Decimal('1200.00')  # 1000 * 1.20
    """
    vat_rate = get_vat_rate(country_code)
    final_price = netto_price * (Decimal("100") + vat_rate) / Decimal("100")
    return round(final_price, 2)


def convert_price_by_country(brutto_price: float, target_country: str = "AT") -> Decimal:
    """
    Complete conversion: DB BRUTTO (German VAT) → NETTO → Target Country BRUTTO
    
    This is the main function to use for price conversion.
    
    Args:
        brutto_price: Price from database (includes 19% German VAT)
        target_country: Target country code (default: "AT" for Austria)
    
    Returns:
        Decimal: Final BRUTTO price for the target country
    
    Raises:
        ValueError: If country code is invalid
    
    Example:
        >>> convert_price_by_country(1190, "AT")
        Decimal('1200.00')
        
        >>> convert_price_by_country(1190, "FR")
        Decimal('1200.00')  # 1000 * 1.20
        
        >>> convert_price_by_country(1190, "DE")
        Decimal('1190.00')  # Same as original (both are 19%)
    
    Workflow:
        1. Take BRUTTO from DB (includes German 19% VAT)
        2. Divide by 1.19 to remove German VAT → NETTO
        3. Multiply by (1 + target_vat_rate) → apply target country VAT
        4. Return final BRUTTO price
    """
    # Validate country code
    if not validate_country_code(target_country):
        raise ValueError(
            f"Invalid country code: {target_country}. "
            f"Valid codes: {', '.join(sorted(VAT_RATES.keys()))}"
        )
    
    # Step 1: Convert German BRUTTO to NETTO
    netto = convert_brutto_to_netto(brutto_price)
    
    # Step 2: Apply target country VAT
    final_price = apply_country_vat(netto, target_country)
    
    return final_price


def calculate_vat_breakdown(brutto_price: float, country_code: str = "AT") -> dict:
    """
    Calculate VAT breakdown for a product in a specific country
    
    Args:
        brutto_price: Price from database (includes 19% German VAT)
        country_code: Target country code (default: "AT")
    
    Returns:
        dict with:
            - brutto: Final price including VAT
            - netto: Price without VAT
            - vat_amount: VAT amount
            - vat_rate: VAT rate as percentage
            - country: Country code
    
    Example:
        >>> calculate_vat_breakdown(1190, "AT")
        {
            'brutto': Decimal('1200.00'),
            'netto': Decimal('1000.00'),
            'vat_amount': Decimal('200.00'),
            'vat_rate': Decimal('20.0'),
            'country': 'AT'
        }
    """
    netto = convert_brutto_to_netto(brutto_price)
    brutto = convert_price_by_country(brutto_price, country_code)
    vat_rate = get_vat_rate(country_code)
    vat_amount = brutto - netto
    
    return {
        "brutto": brutto,
        "netto": netto,
        "vat_amount": round(vat_amount, 2),
        "vat_rate": vat_rate,
        "country": country_code.upper(),
    }
