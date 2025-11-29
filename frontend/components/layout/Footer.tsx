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
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">RINOS BIKES</h3>
            <p className="text-sm text-gray-300 mb-4">
              Premium Fahrräder aus Deutschland.
              Hochwertige Gravel, Road, Mountain und Falträder.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/rinosbikes" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/rinosbikes" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@rinosbikes" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Alle Produkte
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
                  Kategorien
                </Link>
              </li>
              <li>
                <Link href="/products?category=gravel" className="text-gray-300 hover:text-white transition-colors">
                  Gravel Bikes
                </Link>
              </li>
              <li>
                <Link href="/products?category=road" className="text-gray-300 hover:text-white transition-colors">
                  Rennräder
                </Link>
              </li>
              <li>
                <Link href="/products?category=mountain" className="text-gray-300 hover:text-white transition-colors">
                  Mountainbikes
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4">Kundenservice</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/kontakt" className="text-gray-300 hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/versand" className="text-gray-300 hover:text-white transition-colors">
                  Versandinformationen
                </Link>
              </li>
              <li>
                <Link href="/rueckgabe" className="text-gray-300 hover:text-white transition-colors">
                  Rückgabe & Umtausch
                </Link>
              </li>
              <li>
                <Link href="/garantie" className="text-gray-300 hover:text-white transition-colors">
                  Garantie
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-4">Unternehmen</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ueber-uns" className="text-gray-300 hover:text-white transition-colors">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/stores" className="text-gray-300 hover:text-white transition-colors">
                  Händler finden
                </Link>
              </li>
              <li>
                <Link href="/career" className="text-gray-300 hover:text-white transition-colors">
                  Karriere
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="text-gray-300 hover:text-white transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-gray-300 hover:text-white transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="text-gray-300 hover:text-white transition-colors">
                  AGB
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="font-bold text-lg mb-2">Newsletter</h3>
            <p className="text-sm text-gray-300 mb-4">
              Bleib auf dem Laufenden über neue Produkte und exklusive Angebote.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="E-Mail Adresse"
                className="flex-1 px-4 py-2 bg-white text-rinos-primary border-0 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button className="bg-white text-rinos-primary px-6 py-2 font-medium hover:bg-gray-200 transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {currentYear} RINOS Bikes GmbH. Alle Rechte vorbehalten.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Made with passion in Frankfurt (Oder)</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
