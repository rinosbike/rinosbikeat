/**
 * Assembly Service Page - /montageservice
 */

export default function MontageservicePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-normal text-rinos-text mb-8">
          Montageservice
        </h1>

        <div className="prose max-w-none space-y-6">
          <section>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Bei RINOS Service Point sind wir Ihre lokale Anlaufstelle für alles rund ums Fahrrad. Wir bieten Reparatur-, Wartungs-, Abhol-, Montage- und Beratungsservices.
            </p>
          </section>

          <section className="bg-rinos-bg-secondary p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">Unser Kernangebot</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Wir liefern vollständig montierte Fahrräder, ohne dass Sie selbst montieren müssen. Sie wählen Ihr Fahrrad online aus, und wir kümmern uns um Lieferung, Montage, Einstellung und Entsorgung der Verpackung.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">Prozessschritte</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-rinos-accent text-white rounded-full flex items-center justify-center font-semibold mr-4">
                  1
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    Schließen Sie Ihren Kauf ab und fügen Sie einen Service-Kommentar hinzu
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-rinos-accent text-white rounded-full flex items-center justify-center font-semibold mr-4">
                  2
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    Erhalten Sie eine Rechnung für den Montageservice
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-rinos-accent text-white rounded-full flex items-center justify-center font-semibold mr-4">
                  3
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    Vereinbaren Sie Lieferdatum und -ort mit unserem Partner
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-rinos-accent text-white rounded-full flex items-center justify-center font-semibold mr-4">
                  4
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    Erhalten Sie eine individuelle Fahrradeinstellung bei Lieferung
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">Service-Vorteile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-rinos-text mb-2">Vollständig montiert</h3>
                <p className="text-gray-700 text-sm">
                  Vollständig montierte Fahrradlieferung – kein Zusammenbau erforderlich
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-rinos-text mb-2">Pauschale €99</h3>
                <p className="text-gray-700 text-sm">
                  Pauschalpreis von €99 für komplette Inspektion und Einstellung innerhalb Deutschlands
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-rinos-text mb-2">Flexible Lieferung</h3>
                <p className="text-gray-700 text-sm">
                  Wählen Sie Ihren Lieferzeitpunkt selbst
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-rinos-text mb-2">Gründliche Inspektion</h3>
                <p className="text-gray-700 text-sm">
                  Umfassende Prüfung vor der Lieferung
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-rinos-text mb-2">Individuelle Einstellung</h3>
                <p className="text-gray-700 text-sm">
                  Fahrradeinstellung nach Ihren Wünschen bei Lieferung
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-rinos-text mb-2">Verpackungsentsorgung</h3>
                <p className="text-gray-700 text-sm">
                  Wir entsorgen alle Verpackungsmaterialien für Sie
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">Service-Verfügbarkeit</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Der Service erfolgt über eine Partnervereinbarung, bei der Kunden entweder an einem nahegelegenen Fahrradgeschäft abholen oder eine Heimlieferung arrangieren können, wobei die Lieferzeiten vom Kunden gewählt werden.
            </p>
          </section>

          <section className="mt-8 border-t pt-8">
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Kontakt</h3>
            <p className="text-gray-700">
              Für weitere Informationen zum Montageservice kontaktieren Sie uns bitte:
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
