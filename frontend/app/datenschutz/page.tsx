/**
 * Privacy Policy Page - /datenschutz
 */

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-normal text-rinos-text mb-8">
          Datenschutzerklärung
        </h1>

        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">Datenschutzerklärung</h2>
            <p className="text-gray-700 leading-relaxed">
              Sie können unsere Websites nutzen, ohne personenbezogene Daten anzugeben. Wenn Sie eine Anfrage über unsere Websites abschicken, speichern wir Ihre IP-Adresse in sogenannten Server-Log-Dateien. Diese dienen der Sicherheit unserer Websites und werden nach 30 Tagen gelöscht. Wir verarbeiten diese Daten aufgrund unserer berechtigten Interessen gemäß Artikel 6(1) f) DSGVO.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Kontaktformular und Kundenkonto</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Wenn Sie uns über ein Kontaktformular kontaktieren oder ein Kundenkonto erstellen, sammeln und verarbeiten wir die von Ihnen bereitgestellten Daten. Diese Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung gemäß Artikel 6(1)a DSGVO.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Die erfassten Daten werden genutzt, um Ihre Anfrage zu bearbeiten oder Ihr Kundenkonto zu verwalten. Wir geben diese Daten nicht ohne Ihre Zustimmung weiter.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Bestellabwicklung und Datenübermittlung</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Zur Erfüllung Ihrer Bestellung übermitteln wir notwendige Daten an Versanddienstleister (wie DHL oder DPD) und Zahlungsanbieter. Diese Verarbeitung ist zur Vertragserfüllung gemäß Artikel 6(1)b DSGVO erforderlich.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Wir speichern Ihre Daten für die Dauer der Gewährleistungsfrist und entsprechend gesetzlicher Aufbewahrungspflichten.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Ihre Rechte</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Recht auf Auskunft (Artikel 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Artikel 16 DSGVO)</li>
              <li>Recht auf Löschung (Artikel 17 DSGVO)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Artikel 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Artikel 20 DSGVO)</li>
              <li>Widerspruchsrecht (Artikel 21 DSGVO)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Kontakt für Datenschutzanfragen</h3>
            <p className="text-gray-700 leading-relaxed">
              Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte unter:
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
