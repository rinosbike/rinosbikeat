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
        {/* Footer Grid - 4 Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Column 1: Support & Services */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white">Support & Service</h3>
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

          {/* Column 2: Company Info */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white">Unternehmensinfo</h3>
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

          {/* Column 3: Legal */}
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

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white">Newsletter</h3>
            <p className="text-sm text-gray-300 mb-4">
              Abonnieren Sie unsere E-Mails für exklusive Angebote
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="E-Mail Adresse"
                className="px-4 py-2.5 bg-white text-rinos-primary text-sm border-0 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button className="bg-white text-rinos-primary px-6 py-2.5 text-sm font-medium rounded hover:bg-gray-200 transition-colors">
                Jetzt abonnieren
              </button>
            </div>
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
