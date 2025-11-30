/**
 * Footer Component - RINOS Bikes
 * Matches Shopify Dawn theme footer design
 */

import Link from 'next/link'
import { Facebook, Instagram, Youtube, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-rinos-dark text-rinos-text-light mt-16">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Section - Above Footer Grid */}
        <div className="mb-12 max-w-md">
          <h3 className="font-bold text-lg mb-4 text-white">Abonnieren Sie unsere E-Mails</h3>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="E-Mail"
              className="flex-1 px-4 py-2.5 bg-white text-gray-900 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button className="bg-white text-gray-900 px-6 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
              Abonnieren
            </button>
          </div>
        </div>

        {/* Footer Grid - 4 Column Layout with Menu Headings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Column 1: Help & Services */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white">Kundenservice</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/rueckgabe" className="text-gray-300 hover:text-white transition-colors">
                  Rückgabe & Erstattung
                </Link>
              </li>
              <li>
                <Link href="/montageservice" className="text-gray-300 hover:text-white transition-colors">
                  Montageservice
                </Link>
              </li>
              <li>
                <Link href="/sponsoring" className="text-gray-300 hover:text-white transition-colors">
                  Sponsoring
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Information */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white">Informationen</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/ueber-uns" className="text-gray-300 hover:text-white transition-colors">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/versand" className="text-gray-300 hover:text-white transition-colors">
                  Versandoptionen
                </Link>
              </li>
              <li>
                <Link href="/zahlungsoptionen" className="text-gray-300 hover:text-white transition-colors">
                  Zahlungsoptionen
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal Information */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white">Rechtliches</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/datenschutz" className="text-gray-300 hover:text-white transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="text-gray-300 hover:text-white transition-colors">
                  Allgemeine Geschäftsbedingungen
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="text-gray-300 hover:text-white transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/widerrufsrecht" className="text-gray-300 hover:text-white transition-colors">
                  Widerrufsrecht
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: FAQ */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white">FAQ</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/faq-montage" className="text-gray-300 hover:text-white transition-colors">
                  Montage FAQ
                </Link>
              </li>
              <li>
                <Link href="/faq-spezifikationen" className="text-gray-300 hover:text-white transition-colors">
                  Fahrrad-Spezifikationen FAQ
                </Link>
              </li>
              <li>
                <Link href="/faq-rueckgabe" className="text-gray-300 hover:text-white transition-colors">
                  Rückgabe / Garantie FAQ
                </Link>
              </li>
              <li>
                <Link href="/faq-lieferung" className="text-gray-300 hover:text-white transition-colors">
                  Lieferung / Versand FAQ
                </Link>
              </li>
              <li>
                <Link href="/faq-allgemein" className="text-gray-300 hover:text-white transition-colors">
                  Allgemein / Produktpalette FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-gray-400">
              <Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link>
              <Link href="/agb" className="hover:text-white transition-colors">AGB</Link>
              <Link href="/versand" className="hover:text-white transition-colors">Versand</Link>
              <Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>

            {/* Payment Method Icons */}
            <div className="flex flex-col gap-2 items-center md:items-end">
              <span className="text-xs text-gray-400">Sichere Zahlungsmethoden:</span>
              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                <div className="bg-white px-3 py-1.5 rounded text-xs font-semibold text-gray-700 shadow-sm">
                  PayPal
                </div>
                <div className="bg-white px-3 py-1.5 rounded text-xs font-semibold text-gray-700 shadow-sm">
                  Klarna
                </div>
                <div className="bg-white px-3 py-1.5 rounded text-xs font-semibold text-gray-700 shadow-sm">
                  Visa
                </div>
                <div className="bg-white px-3 py-1.5 rounded text-xs font-semibold text-gray-700 shadow-sm">
                  Mastercard
                </div>
                <div className="bg-white px-3 py-1.5 rounded text-xs font-semibold text-gray-700 shadow-sm">
                  Apple Pay
                </div>
                <div className="bg-white px-3 py-1.5 rounded text-xs font-semibold text-gray-700 shadow-sm">
                  Google Pay
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p>&copy; {currentYear} RINOS Bikes. Alle Rechte vorbehalten.</p>
              <span className="hidden md:inline text-gray-600">|</span>
              <p className="text-xs">Powered by RINOS</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Trusted by riders worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
