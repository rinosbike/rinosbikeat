/**
 * Payment Options Page - /zahlungsoptionen
 */

export default function ZahlungsoptionenPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-container mx-auto px-6 md:px-20 py-12">
        <h1 className="text-3xl md:text-4xl font-normal text-rinos-text mb-8">
          Zahlungsoptionen
        </h1>

        <div className="prose max-w-none space-y-8">
          <section>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Wir bieten Ihnen verschiedene sichere Zahlungsmethoden für Ihren Einkauf an.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bank Transfer */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-rinos-text mb-4">Banküberweisung</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Direkte Überweisung über Holvi Payment Services mit den bereitgestellten Kontodaten.
              </p>
              <div className="bg-white p-4 rounded border border-gray-200">
                <p className="text-sm text-gray-700 mb-1"><strong>IBAN:</strong></p>
                <p className="text-sm text-gray-600 font-mono">DE61100179978003010094</p>
              </div>
            </div>

            {/* PayPal */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-rinos-text mb-4">PayPal</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Unkomplizierte und schnelle Abwicklung mit sofortiger Gutschrift.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                <li>Schnelle Zahlung</li>
                <li>Käuferschutz</li>
                <li>Sofortige Bestätigung</li>
              </ul>
            </div>

            {/* Amazon Pay */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-rinos-text mb-4">Amazon Pay</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Zahlung mit Kredit-/Debitkarten, die in Ihrem Amazon-Kundenkonto gespeichert sind.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                <li>Keine erneute Eingabe von Zahlungsdaten</li>
                <li>Sichere Abwicklung über Amazon</li>
                <li>Bekannte Benutzeroberfläche</li>
              </ul>
            </div>

            {/* Klarna */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-rinos-text mb-4">Klarna</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Schnell, einfach und sicher bezahlen mit Optionen für sofortige Zahlung, Bezahlung später oder in Raten.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                <li>Sofort bezahlen</li>
                <li>Später bezahlen (Rechnung)</li>
                <li>Ratenzahlung</li>
              </ul>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">
              Weitere unterstützte Zahlungsmethoden
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-rinos-bg-secondary p-4 rounded">
                <p className="text-gray-700 font-medium">American Express</p>
              </div>
              <div className="bg-rinos-bg-secondary p-4 rounded">
                <p className="text-gray-700 font-medium">Apple Pay</p>
              </div>
              <div className="bg-rinos-bg-secondary p-4 rounded">
                <p className="text-gray-700 font-medium">Bancontact</p>
              </div>
              <div className="bg-rinos-bg-secondary p-4 rounded">
                <p className="text-gray-700 font-medium">EPS</p>
              </div>
              <div className="bg-rinos-bg-secondary p-4 rounded">
                <p className="text-gray-700 font-medium">Google Pay</p>
              </div>
              <div className="bg-rinos-bg-secondary p-4 rounded">
                <p className="text-gray-700 font-medium">iDEAL</p>
              </div>
              <div className="bg-rinos-bg-secondary p-4 rounded">
                <p className="text-gray-700 font-medium">Maestro</p>
              </div>
              <div className="bg-rinos-bg-secondary p-4 rounded">
                <p className="text-gray-700 font-medium">Mastercard</p>
              </div>
              <div className="bg-rinos-bg-secondary p-4 rounded">
                <p className="text-gray-700 font-medium">Shop Pay</p>
              </div>
              <div className="bg-rinos-bg-secondary p-4 rounded">
                <p className="text-gray-700 font-medium">Union Pay</p>
              </div>
              <div className="bg-rinos-bg-secondary p-4 rounded">
                <p className="text-gray-700 font-medium">Visa</p>
              </div>
            </div>
          </section>

          <section className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Sicherheitshinweis</h3>
            <p className="text-gray-700 leading-relaxed">
              Alle Zahlungen werden über sichere, verschlüsselte Verbindungen abgewickelt.
              Ihre Zahlungsinformationen werden niemals auf unseren Servern gespeichert.
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Kontakt</h3>
            <p className="text-gray-700">
              Bei Fragen zu Zahlungsoptionen kontaktieren Sie uns bitte:
            </p>
            <p className="text-gray-700 font-medium mt-2">
              E-Mail: <a href="mailto:info@rinosbike.eu" className="text-rinos-accent hover:underline">info@rinosbike.eu</a>
            </p>
            <p className="text-gray-700">
              Telefon: +49 0335 66590614
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
