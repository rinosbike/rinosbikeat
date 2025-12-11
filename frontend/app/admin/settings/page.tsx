/**
 * Admin Settings Page - RINOS CMS
 * Premium Apple/Framer-inspired design
 * E-commerce settings management
 */

'use client'

import { useState } from 'react'
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  Mail,
  Globe,
  Bell,
  Shield,
  Palette,
  ChevronRight,
  Save,
  Check,
  AlertCircle,
  ExternalLink
} from 'lucide-react'

// Settings sections
const settingsSections = [
  {
    id: 'store',
    title: 'Shop-Einstellungen',
    description: 'Grundlegende Shop-Informationen',
    icon: Store,
  },
  {
    id: 'payment',
    title: 'Zahlungen',
    description: 'Zahlungsmethoden & Stripe',
    icon: CreditCard,
  },
  {
    id: 'shipping',
    title: 'Versand',
    description: 'Versandoptionen & Gebühren',
    icon: Truck,
  },
  {
    id: 'email',
    title: 'E-Mail',
    description: 'E-Mail-Vorlagen & Benachrichtigungen',
    icon: Mail,
  },
  {
    id: 'seo',
    title: 'SEO',
    description: 'Suchmaschinenoptimierung',
    icon: Globe,
  },
  {
    id: 'notifications',
    title: 'Benachrichtigungen',
    description: 'Admin-Benachrichtigungen',
    icon: Bell,
  },
]

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState('store')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-overline uppercase tracking-widest text-rinos-text-secondary mb-2">
            Administration
          </p>
          <h1 className="text-display-sm font-bold text-rinos-dark">Einstellungen</h1>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Speichern...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4" />
              Gespeichert
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Änderungen speichern
            </>
          )}
        </button>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-rinos-border-light overflow-hidden">
            <div className="p-4 border-b border-rinos-border-light">
              <p className="text-overline uppercase tracking-widest text-rinos-text-secondary">
                Kategorien
              </p>
            </div>
            <nav className="p-2">
              {settingsSections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-rinos-dark text-white'
                        : 'text-rinos-dark hover:bg-rinos-bg-secondary'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-rinos-text-secondary'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-body-sm font-medium ${isActive ? 'text-white' : 'text-rinos-dark'}`}>
                        {section.title}
                      </p>
                      <p className={`text-caption truncate ${isActive ? 'text-white/60' : 'text-rinos-text-secondary'}`}>
                        {section.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeSection === 'store' && <StoreSettings />}
          {activeSection === 'payment' && <PaymentSettings />}
          {activeSection === 'shipping' && <ShippingSettings />}
          {activeSection === 'email' && <EmailSettings />}
          {activeSection === 'seo' && <SEOSettings />}
          {activeSection === 'notifications' && <NotificationSettings />}
        </div>
      </div>
    </div>
  )
}

// Store Settings Section
function StoreSettings() {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="Shop-Informationen"
        description="Grundlegende Informationen über Ihren Shop"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-default">Shop-Name</label>
            <input type="text" className="input" defaultValue="RINOS Bikes" />
          </div>
          <div>
            <label className="label-default">Kontakt E-Mail</label>
            <input type="email" className="input" defaultValue="info@rinosbikes.at" />
          </div>
          <div>
            <label className="label-default">Telefon</label>
            <input type="tel" className="input" placeholder="+43 xxx xxx xxx" />
          </div>
          <div>
            <label className="label-default">Währung</label>
            <select className="select">
              <option value="EUR">Euro (EUR)</option>
              <option value="CHF">Schweizer Franken (CHF)</option>
            </select>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Adresse"
        description="Geschäftsadresse für Rechnungen und Impressum"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label-default">Straße & Hausnummer</label>
            <input type="text" className="input" placeholder="Musterstraße 123" />
          </div>
          <div>
            <label className="label-default">PLZ</label>
            <input type="text" className="input" placeholder="1234" />
          </div>
          <div>
            <label className="label-default">Stadt</label>
            <input type="text" className="input" placeholder="Wien" />
          </div>
          <div>
            <label className="label-default">Land</label>
            <select className="select">
              <option value="AT">Österreich</option>
              <option value="DE">Deutschland</option>
              <option value="CH">Schweiz</option>
            </select>
          </div>
        </div>
      </SettingsCard>
    </div>
  )
}

// Payment Settings Section
function PaymentSettings() {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="Stripe Integration"
        description="Verbinden Sie Ihr Stripe-Konto für Zahlungsabwicklung"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-body-sm font-medium text-rinos-dark">Stripe verbunden</p>
                <p className="text-caption text-rinos-text-secondary">Live-Modus aktiv</p>
              </div>
            </div>
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary flex items-center gap-2"
            >
              Dashboard öffnen
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div>
            <label className="label-default">Publishable Key</label>
            <input type="text" className="input" defaultValue="pk_live_****" disabled />
          </div>
          <div>
            <label className="label-default">Secret Key</label>
            <input type="password" className="input" defaultValue="sk_live_****" disabled />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Zahlungsmethoden"
        description="Aktivierte Zahlungsmethoden im Shop"
      >
        <div className="space-y-3">
          <ToggleRow label="Kreditkarte" description="Visa, Mastercard, AMEX" defaultChecked />
          <ToggleRow label="SEPA-Lastschrift" description="Bankeinzug für SEPA-Länder" defaultChecked />
          <ToggleRow label="Klarna" description="Rechnung, Ratenkauf" />
          <ToggleRow label="PayPal" description="PayPal Checkout" />
          <ToggleRow label="Apple Pay" description="Express Checkout" defaultChecked />
          <ToggleRow label="Google Pay" description="Express Checkout" defaultChecked />
        </div>
      </SettingsCard>
    </div>
  )
}

// Shipping Settings Section
function ShippingSettings() {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="Versandzonen"
        description="Versandkosten nach Region"
      >
        <div className="space-y-4">
          <ShippingZoneRow
            zone="Österreich"
            standardPrice="0.00"
            expressPrice="9.90"
            freeFrom="0"
          />
          <ShippingZoneRow
            zone="Deutschland"
            standardPrice="29.90"
            expressPrice="49.90"
            freeFrom="500"
          />
          <ShippingZoneRow
            zone="Schweiz"
            standardPrice="49.90"
            expressPrice="79.90"
            freeFrom="1000"
          />
          <ShippingZoneRow
            zone="EU (Rest)"
            standardPrice="59.90"
            expressPrice="99.90"
            freeFrom="1500"
          />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Versandoptionen"
        description="Allgemeine Versandeinstellungen"
      >
        <div className="space-y-3">
          <ToggleRow
            label="Expressversand anbieten"
            description="Lieferung innerhalb von 1-2 Werktagen"
            defaultChecked
          />
          <ToggleRow
            label="Abholung im Geschäft"
            description="Click & Collect Option"
            defaultChecked
          />
          <ToggleRow
            label="Sendungsverfolgung"
            description="Tracking-Informationen per E-Mail"
            defaultChecked
          />
        </div>
      </SettingsCard>
    </div>
  )
}

// Email Settings Section
function EmailSettings() {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="E-Mail-Absender"
        description="Absenderinformationen für alle Shop-E-Mails"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-default">Absendername</label>
            <input type="text" className="input" defaultValue="RINOS Bikes" />
          </div>
          <div>
            <label className="label-default">Absender E-Mail</label>
            <input type="email" className="input" defaultValue="noreply@rinosbikes.at" />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="E-Mail-Benachrichtigungen"
        description="Automatische E-Mails an Kunden"
      >
        <div className="space-y-3">
          <ToggleRow
            label="Bestellbestätigung"
            description="Nach erfolgreicher Bestellung"
            defaultChecked
          />
          <ToggleRow
            label="Versandbestätigung"
            description="Wenn die Bestellung versendet wird"
            defaultChecked
          />
          <ToggleRow
            label="Lieferbestätigung"
            description="Wenn die Bestellung zugestellt wurde"
            defaultChecked
          />
          <ToggleRow
            label="Bewertungsanfrage"
            description="7 Tage nach Lieferung"
          />
          <ToggleRow
            label="Warenkorbabbruch"
            description="Erinnerung bei verlassenem Warenkorb"
          />
        </div>
      </SettingsCard>
    </div>
  )
}

// SEO Settings Section
function SEOSettings() {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="Meta-Tags"
        description="Standard SEO-Einstellungen für den Shop"
      >
        <div className="space-y-4">
          <div>
            <label className="label-default">Meta-Titel</label>
            <input
              type="text"
              className="input"
              defaultValue="RINOS Bikes | Premium Fahrräder aus Österreich"
            />
            <p className="text-caption text-rinos-text-secondary mt-1">Max. 60 Zeichen empfohlen</p>
          </div>
          <div>
            <label className="label-default">Meta-Beschreibung</label>
            <textarea
              className="input resize-none"
              rows={3}
              defaultValue="Entdecken Sie hochwertige Carbon-Fahrräder von RINOS. Rennräder, Gravelbikes und mehr. Kostenloser Versand in Österreich."
            />
            <p className="text-caption text-rinos-text-secondary mt-1">Max. 160 Zeichen empfohlen</p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Social Media"
        description="Open Graph Einstellungen für Social Sharing"
      >
        <div className="space-y-4">
          <div>
            <label className="label-default">OG Bild URL</label>
            <input
              type="url"
              className="input"
              placeholder="https://rinosbikes.at/og-image.jpg"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-default">Facebook Seite</label>
              <input type="url" className="input" placeholder="https://facebook.com/rinosbikes" />
            </div>
            <div>
              <label className="label-default">Instagram</label>
              <input type="url" className="input" placeholder="https://instagram.com/rinosbikes" />
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Sitemaps & Robots"
        description="Technische SEO-Einstellungen"
      >
        <div className="space-y-3">
          <ToggleRow
            label="Automatische Sitemap"
            description="Sitemap.xml automatisch generieren"
            defaultChecked
          />
          <ToggleRow
            label="Produkte indexieren"
            description="Produktseiten für Suchmaschinen freigeben"
            defaultChecked
          />
          <ToggleRow
            label="Kategorien indexieren"
            description="Kategorieseiten für Suchmaschinen freigeben"
            defaultChecked
          />
        </div>
      </SettingsCard>
    </div>
  )
}

// Notification Settings Section
function NotificationSettings() {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="Admin-Benachrichtigungen"
        description="E-Mail-Benachrichtigungen für Administratoren"
      >
        <div className="space-y-4">
          <div>
            <label className="label-default">Admin E-Mail</label>
            <input type="email" className="input" defaultValue="admin@rinosbikes.at" />
          </div>
          <div className="space-y-3">
            <ToggleRow
              label="Neue Bestellung"
              description="Bei jeder neuen Bestellung"
              defaultChecked
            />
            <ToggleRow
              label="Niedriger Lagerbestand"
              description="Wenn Produkte unter Mindestbestand fallen"
              defaultChecked
            />
            <ToggleRow
              label="Neue Registrierung"
              description="Wenn sich ein neuer Kunde registriert"
            />
            <ToggleRow
              label="Neue Bewertung"
              description="Wenn eine neue Produktbewertung eingeht"
            />
            <ToggleRow
              label="Kontaktanfrage"
              description="Wenn das Kontaktformular ausgefüllt wird"
              defaultChecked
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Tägliche Zusammenfassung"
        description="Täglicher Bericht per E-Mail"
      >
        <div className="space-y-3">
          <ToggleRow
            label="Täglicher Verkaufsbericht"
            description="Zusammenfassung der Tagesverkäufe um 20:00 Uhr"
            defaultChecked
          />
          <ToggleRow
            label="Wöchentlicher Bericht"
            description="Wochenübersicht jeden Montag"
          />
        </div>
      </SettingsCard>
    </div>
  )
}

// Reusable Settings Card
function SettingsCard({
  title,
  description,
  children
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-rinos-border-light overflow-hidden">
      <div className="px-6 py-5 border-b border-rinos-border-light">
        <h3 className="text-title font-semibold text-rinos-dark">{title}</h3>
        <p className="text-body-sm text-rinos-text-secondary mt-1">{description}</p>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

// Toggle Row Component
function ToggleRow({
  label,
  description,
  defaultChecked = false
}: {
  label: string
  description: string
  defaultChecked?: boolean
}) {
  const [enabled, setEnabled] = useState(defaultChecked)

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-rinos-bg-secondary/50 transition-colors">
      <div>
        <p className="text-body-sm font-medium text-rinos-dark">{label}</p>
        <p className="text-caption text-rinos-text-secondary">{description}</p>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
          enabled ? 'bg-rinos-dark' : 'bg-rinos-border'
        }`}
      >
        <span
          className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
            enabled ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}

// Shipping Zone Row
function ShippingZoneRow({
  zone,
  standardPrice,
  expressPrice,
  freeFrom
}: {
  zone: string
  standardPrice: string
  expressPrice: string
  freeFrom: string
}) {
  return (
    <div className="p-4 bg-rinos-bg-secondary/50 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <p className="text-body-sm font-semibold text-rinos-dark">{zone}</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-caption text-rinos-text-secondary">Standard</label>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-caption text-rinos-text-secondary">€</span>
            <input
              type="text"
              className="w-full px-2 py-1.5 bg-white border border-rinos-border-light rounded-lg text-body-sm"
              defaultValue={standardPrice}
            />
          </div>
        </div>
        <div>
          <label className="text-caption text-rinos-text-secondary">Express</label>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-caption text-rinos-text-secondary">€</span>
            <input
              type="text"
              className="w-full px-2 py-1.5 bg-white border border-rinos-border-light rounded-lg text-body-sm"
              defaultValue={expressPrice}
            />
          </div>
        </div>
        <div>
          <label className="text-caption text-rinos-text-secondary">Gratis ab</label>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-caption text-rinos-text-secondary">€</span>
            <input
              type="text"
              className="w-full px-2 py-1.5 bg-white border border-rinos-border-light rounded-lg text-body-sm"
              defaultValue={freeFrom}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
