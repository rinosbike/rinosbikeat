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
      <div className="max-w-container mx-auto px-4 py-12">
        {/* Footer Grid - 5 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Support & Services */}
          <div>
            <h3 className="font-bold text-base mb-4">Support & Service</h3>
            <ul className="space-y-2 text-sm">
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

          {/* Column 2: Company Info */}
          <div>
            <h3 className="font-bold text-base mb-4">Unternehmensinfo</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ueber-uns" className="text-gray-300 hover:text-white transition-colors">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/versandoptionen" className="text-gray-300 hover:text-white transition-colors">
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

          {/* Column 3: Legal */}
          <div>
            <h3 className="font-bold text-base mb-4">Rechtliches</h3>
            <ul className="space-y-2 text-sm">
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

          {/* Column 4: FAQ Section */}
          <div>
            <h3 className="font-bold text-base mb-4">FAQ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq/montage" className="text-gray-300 hover:text-white transition-colors">
                  Montage FAQ
                </Link>
              </li>
              <li>
                <Link href="/faq/spezifikationen" className="text-gray-300 hover:text-white transition-colors">
                  Fahrrad-Spezifikationen FAQ
                </Link>
              </li>
              <li>
                <Link href="/faq/rueckgabe-garantie" className="text-gray-300 hover:text-white transition-colors">
                  Rückgabe/Garantie FAQ
                </Link>
              </li>
              <li>
                <Link href="/faq/lieferung-versand" className="text-gray-300 hover:text-white transition-colors">
                  Lieferung/Versand FAQ
                </Link>
              </li>
              <li>
                <Link href="/faq/allgemein" className="text-gray-300 hover:text-white transition-colors">
                  Allgemein/Produktpalette FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div>
            <h3 className="font-bold text-base mb-4">Newsletter</h3>
            <p className="text-sm text-gray-300 mb-4">
              Abonnieren Sie unsere E-Mails
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="E-Mail"
                className="px-4 py-2 bg-white text-rinos-primary text-sm border-0 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button className="bg-white text-rinos-primary px-6 py-2 text-sm font-medium hover:bg-gray-200 transition-colors">
                Abonnieren
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex gap-4 text-xs text-gray-400">
              <Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link>
              <Link href="/agb" className="hover:text-white transition-colors">AGB</Link>
              <Link href="/versand" className="hover:text-white transition-colors">Versand</Link>
              <Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>

            {/* Payment Icons */}
            <div className="flex gap-2 items-center">
              <span className="text-xs text-gray-400">Zahlungsmethoden:</span>
              <div className="flex gap-2 text-xs text-gray-400">
                <span>PayPal</span>
                <span>Klarna</span>
                <span>Kreditkarte</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-2">
            <p>&copy; {currentYear} RINOS Bikes. Alle Rechte vorbehalten.</p>
            <p className="text-xs">Powered by RINOS</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
