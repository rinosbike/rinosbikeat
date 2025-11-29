/**
 * Terms and Conditions Page - /agb
 */

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-normal text-rinos-text mb-8">
          Allgemeine Geschäftsbedingungen
        </h1>

        <div className="prose max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">Teil I: Standardgeschäftsbedingungen</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">§1 Grundlegende Bestimmungen</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Diese Bedingungen gelten für alle Verträge, die über rinosbike.eu abgeschlossen werden.
                </p>
                <p className="text-gray-700 leading-relaxed mb-2">
                  <strong>Verbraucher:</strong> Natürliche Personen, die einen Vertrag zu Zwecken abschließen, die nicht ihrer gewerblichen oder selbstständigen beruflichen Tätigkeit zugerechnet werden können.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Unternehmer:</strong> Natürliche oder juristische Personen, die in Ausübung ihrer gewerblichen oder selbstständigen beruflichen Tätigkeit handeln.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">§2 Vertragsabschluss</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Die auf der Website aufgeführten Produkte stellen verbindliche Angebote dar. Käufe erfolgen über ein Online-Warenkorbsystem.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Kunden überprüfen die Bestelldetails vor der endgültigen Übermittlung durch Klicken auf "Bestellung aufgeben", wodurch ein rechtsverbindlicher Vertrag entsteht.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Sie haben die Möglichkeit, Ihre Bestellung vor dem Absenden zu überprüfen und zu korrigieren.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">§3 Eigentumsvorbehalt</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Die Ware bleibt bis zur vollständigen Bezahlung des Kaufpreises unser Eigentum.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Für Geschäftskunden gilt ein zusätzlicher Eigentumsvorbehalt bis zur Begleichung aller Forderungen aus der Geschäftsbeziehung.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">§4 Gewährleistung</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Es gelten die gesetzlichen Gewährleistungsrechte. Verbraucher sollten Mängel umgehend melden; eine Nichteinhaltung beeinträchtigt rechtliche Ansprüche nicht.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Geschäftskunden erhalten eine einjährige Gewährleistungsfrist mit spezifischen Einschränkungen.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">§5 Gerichtsstand</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  Es gilt deutsches Recht.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Für Nicht-Verbraucher dient der Geschäftssitz von Rinos Bikes als Gerichtsstand und Erfüllungsort: Frankfurt (Oder), Deutschland.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">Teil II: Kundeninformationen</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">Verkäufer</h3>
                <p className="text-gray-700 mb-2"><strong>Rinos Bikes GmbH</strong></p>
                <p className="text-gray-700">Goethestr 11E</p>
                <p className="text-gray-700 mb-3">15234 Frankfurt (Oder), Deutschland</p>
                <p className="text-gray-700">Telefon: +49 0335 66590614</p>
                <p className="text-gray-700">E-Mail: <a href="mailto:info@rinosbike.eu" className="text-rinos-accent hover:underline">info@rinosbike.eu</a></p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">Vertragssprache</h3>
                <p className="text-gray-700 leading-relaxed">Deutsch</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">Preise und Kosten</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Die angegebenen Preise verstehen sich inklusive aller Steuern. Versandkosten werden separat ausgewiesen, sofern keine kostenlose Lieferung angegeben ist.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Bei internationalen Bestellungen können Zölle und Gebühren anfallen, die vom Kunden zu tragen sind.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">Lieferung</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Das Risiko geht bei Verbrauchern mit der Lieferung an den Kunden über.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Geschäftskunden übernehmen das Versandrisiko.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">Streitbeilegung</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  Die Europäische Kommission stellt eine Plattform für die außergerichtliche Online-Streitbeilegung (OS-Plattform) bereit:
                </p>
                <p className="text-gray-700">
                  <a href="https://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer" className="text-rinos-accent hover:underline">
                    https://ec.europa.eu/odr
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section className="border-t pt-8">
            <p className="text-sm text-gray-600 italic">
              Zuletzt aktualisiert: 27. Oktober 2020
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
