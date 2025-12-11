/**
 * Footer Component - RINOS Bikes
 * Premium Apple/Framer-inspired design
 */

import Link from 'next/link'
import { Facebook, Instagram, Youtube, Mail, ArrowRight } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-rinos-dark text-white mt-24 lg:mt-32">
      {/* Main Footer Content */}
      <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
        {/* Top Section - Newsletter */}
        <div className="py-16 lg:py-20 border-b border-white/10">
          <div className="max-w-2xl">
            <h3 className="text-headline font-semibold text-white mb-3">
              Newsletter
            </h3>
            <p className="text-body text-white/60 mb-6">
              Abonnieren Sie unsere E-Mails für exklusive Angebote, Neuheiten und Updates.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder="Ihre E-Mail-Adresse"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl
                           text-white placeholder:text-white/40
                           focus:bg-white/10 focus:border-white/20 focus:outline-none
                           transition-all duration-300"
                />
              </div>
              <button className="btn bg-white text-rinos-dark px-8 py-4 rounded-full
                               font-medium hover:bg-white/90
                               active:scale-[0.98] transition-all duration-300
                               flex items-center justify-center gap-2 group">
                Abonnieren
                <ArrowRight className="w-4 h-4 transition-transform duration-300
                                      group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle Section - Navigation Grid */}
        <div className="py-16 lg:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <img
                src="/images/hero/logo.png"
                alt="RINOS Bikes"
                className="h-16 w-auto brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-body-sm text-white/50 leading-relaxed">
              Premium Fahrräder für anspruchsvolle Radfahrer.
              Qualität und Design vereint.
            </p>
          </div>

          {/* Column 2: Customer Service */}
          <div>
            <h4 className="text-overline font-medium uppercase tracking-widest
                         text-white/40 mb-6">
              Kundenservice
            </h4>
            <ul className="space-y-4">
              <FooterLink href="/rueckgabe">Rückgabe & Erstattung</FooterLink>
              <FooterLink href="/montageservice">Montageservice</FooterLink>
              <FooterLink href="/sponsoring">Sponsoring</FooterLink>
              <FooterLink href="/kontakt">Kontakt</FooterLink>
            </ul>
          </div>

          {/* Column 3: Information */}
          <div>
            <h4 className="text-overline font-medium uppercase tracking-widest
                         text-white/40 mb-6">
              Informationen
            </h4>
            <ul className="space-y-4">
              <FooterLink href="/ueber-uns">Über uns</FooterLink>
              <FooterLink href="/versand">Versandoptionen</FooterLink>
              <FooterLink href="/zahlungsoptionen">Zahlungsoptionen</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="text-overline font-medium uppercase tracking-widest
                         text-white/40 mb-6">
              Rechtliches
            </h4>
            <ul className="space-y-4">
              <FooterLink href="/datenschutz">Datenschutz</FooterLink>
              <FooterLink href="/agb">AGB</FooterLink>
              <FooterLink href="/impressum">Impressum</FooterLink>
              <FooterLink href="/widerrufsrecht">Widerrufsrecht</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Copyright & Social */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <p className="text-caption text-white/40 order-2 sm:order-1">
              © {currentYear} RINOS Bikes. Alle Rechte vorbehalten.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <SocialLink href="https://facebook.com" label="Facebook">
                <Facebook className="w-4 h-4" />
              </SocialLink>
              <SocialLink href="https://instagram.com" label="Instagram">
                <Instagram className="w-4 h-4" />
              </SocialLink>
              <SocialLink href="https://youtube.com" label="YouTube">
                <Youtube className="w-4 h-4" />
              </SocialLink>
              <SocialLink href="mailto:info@rinosbikes.com" label="Email">
                <Mail className="w-4 h-4" />
              </SocialLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Footer Link Component
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-body-sm text-white/60 hover:text-white
                 transition-colors duration-300 inline-flex items-center gap-1 group"
      >
        {children}
        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2
                             group-hover:opacity-100 group-hover:translate-x-0
                             transition-all duration-300" />
      </Link>
    </li>
  )
}

// Social Link Component
function SocialLink({
  href,
  label,
  children
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full flex items-center justify-center
               text-white/50 hover:text-white hover:bg-white/10
               transition-all duration-300"
    >
      {children}
    </a>
  )
}
