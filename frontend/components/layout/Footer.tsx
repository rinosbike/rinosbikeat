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
          <div>
            <input
              type="email"
              placeholder="E-Mail"
              className="w-full px-4 py-2.5 bg-white text-gray-900 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-gray-400 mb-2"
            />
            <button className="w-full bg-white text-gray-900 px-6 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors">
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

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-400">&copy; {currentYear} RINOS Bikes. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  )
}
