/**
 * Footer Component - RINOS Bikes
 * Matches Shopify Dawn theme footer design
 */

import Link from 'next/link'
import { Facebook, Instagram, Youtube, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Newsletter Section - Above Footer Grid */}
        <div className="mb-12 max-w-md">
          <h3 className="font-black text-xl mb-4 text-white">Newsletter</h3>
          <p className="text-gray-300 text-sm mb-4">Abonnieren Sie unsere E-Mails für exklusive Angebote und Updates.</p>
          <div>
            <input
              type="email"
              placeholder="E-Mail"
              className="w-full px-4 py-3 bg-gray-900 text-white text-sm border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent mb-3 placeholder-gray-500"
            />
            <button className="w-full bg-white text-black px-6 py-3 text-sm font-bold rounded-lg hover:bg-gray-100 transition-all duration-300">
              Abonnieren
            </button>
          </div>
        </div>

        {/* Footer Grid - 3 Column Layout with Menu Headings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-12 border-b border-gray-800 pb-12">
          {/* Column 1: Help & Services */}
          <div>
            <h3 className="font-black text-lg mb-6 text-white">Kundenservice</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/rueckgabe" className="text-gray-400 hover:text-white transition-colors font-medium">
                  Rückgabe & Erstattung
                </Link>
              </li>
              <li>
                <Link href="/montageservice" className="text-gray-400 hover:text-white transition-colors font-medium">
                  Montageservice
                </Link>
              </li>
              <li>
                <Link href="/sponsoring" className="text-gray-400 hover:text-white transition-colors font-medium">
                  Sponsoring
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Information */}
          <div>
            <h3 className="font-black text-lg mb-6 text-white">Informationen</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/ueber-uns" className="text-gray-400 hover:text-white transition-colors font-medium">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/versand" className="text-gray-400 hover:text-white transition-colors font-medium">
                  Versandoptionen
                </Link>
              </li>
              <li>
                <Link href="/zahlungsoptionen" className="text-gray-400 hover:text-white transition-colors font-medium">
                  Zahlungsoptionen
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal Information */}
          <div>
            <h3 className="font-black text-lg mb-6 text-white">Rechtliches</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/datenschutz" className="text-gray-400 hover:text-white transition-colors font-medium">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="text-gray-400 hover:text-white transition-colors font-medium">
                  Allgemeine Geschäftsbedingungen
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="text-gray-400 hover:text-white transition-colors font-medium">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/widerrufsrecht" className="text-gray-400 hover:text-white transition-colors font-medium">
                  Widerrufsrecht
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8">
          <p className="text-sm text-gray-400">&copy; {currentYear} RINOS Bikes. Alle Rechte vorbehalten.</p>
          <div className="flex items-center gap-4 mt-6 sm:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
