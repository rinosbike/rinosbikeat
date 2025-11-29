/**
 * Shipping Page - /versand
 */

export default function VersandPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-normal text-rinos-text mb-8">
          Versandinformationen
        </h1>

        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">Versandoptionen</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Wir versenden mit DHL und DPD nach Deutschland, in EU-Länder und ausgewählte Nicht-EU-Länder.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Lieferzeiten</h3>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <ul className="text-gray-700 space-y-2">
                <li><span className="font-semibold">Inland (Deutschland):</span> 2–3 Tage nach Vertragsabschluss</li>
                <li><span className="font-semibold">International:</span> 3–8 Tage nach Vertragsabschluss</li>
                <li className="text-sm text-gray-600 mt-4">An Sonn- und Feiertagen erfolgt keine Zustellung</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Lieferländer</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Wir versenden in folgende Länder:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
              <div>• Österreich</div>
              <div>• Belgien</div>
              <div>• Bosnien und Herzegowina</div>
              <div>• Bulgarien</div>
              <div>• Kroatien</div>
              <div>• Zypern</div>
              <div>• Tschechien</div>
              <div>• Dänemark</div>
              <div>• Estland</div>
              <div>• Finnland</div>
              <div>• Frankreich</div>
              <div>• Großbritannien</div>
              <div>• Griechenland</div>
              <div>• Ungarn</div>
              <div>• Island</div>
              <div>• Irland</div>
              <div>• Italien</div>
              <div>• Lettland</div>
              <div>• Liechtenstein</div>
              <div>• Litauen</div>
              <div>• Luxemburg</div>
              <div>• Malta</div>
              <div>• Monaco</div>
              <div>• Niederlande</div>
              <div>• Norwegen</div>
              <div>• Polen</div>
              <div>• Portugal</div>
              <div>• Rumänien</div>
              <div>• Slowakei</div>
              <div>• Slowenien</div>
              <div>• Spanien</div>
              <div>• Schweden</div>
              <div>• Schweiz</div>
            </div>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Versandkosten (inkl. MwSt.)</h3>
            <div className="bg-rinos-bg-secondary p-6 rounded-lg space-y-4">
              <div>
                <h4 className="font-semibold text-rinos-text mb-2">Fahrräder:</h4>
                <p className="text-gray-700">€29,99 pro Fahrrad für das EU-Festland</p>
              </div>
              <div>
                <h4 className="font-semibold text-rinos-text mb-2">Andere Produkte:</h4>
                <p className="text-gray-700">Gewichts-/größenabhängige Tarife werden an der Kasse angezeigt</p>
              </div>
              <div>
                <h4 className="font-semibold text-rinos-text mb-2">EU-Außengebiete & Inseln:</h4>
                <p className="text-gray-700">Höhere Versandkosten werden an der Kasse angezeigt</p>
                <p className="text-sm text-gray-600 mt-2">Die Lieferung in abgelegene Regionen kann zusätzliche Zeit in Anspruch nehmen</p>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Kontakt</h3>
            <p className="text-gray-700">
              Bei Fragen zum Versand kontaktieren Sie uns bitte:
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
