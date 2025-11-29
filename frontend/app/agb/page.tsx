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
                <p className="text-gray-700 leading-relaxed">
                  Diese Bedingungen gelten für alle Verträge, die über rinosbike.eu abgeschlossen werden. Wir definieren "Verbraucher" als natürliche Personen, die einen Vertrag zu Zwecken abschließen, die nicht ihrer gewerblichen oder selbstständigen beruflichen Tätigkeit zugerechnet werden können. "Unternehmer" sind natürliche oder juristische Personen, die in Ausübung ihrer gewerblichen oder selbstständigen beruflichen Tätigkeit handeln.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">§2 Vertragsabschluss</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Bestellungen werden über den Warenkorb aufgegeben. Der Vertrag kommt zustande, wenn wir Ihre Bestellung per E-Mail bestätigen.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Sie haben die Möglichkeit, Ihre Bestellung vor dem Absenden zu überprüfen und zu korrigieren.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">§3 Eigentumsvorbehalt</h3>
                <p className="text-gray-700 leading-relaxed">
                  Die Ware bleibt bis zur vollständigen Bezahlung des Kaufpreises unser Eigentum.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">§4 Gewährleistung</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Es gelten die gesetzlichen Gewährleistungsrechte. Verbraucher müssen Mängel umgehend melden.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Für Unternehmer gilt eine einjährige Gewährleistungsfrist mit eingeschränkten Ausnahmen.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">§5 Gerichtsstand</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  Es gilt deutsches Recht.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Geschäftssitz: Frankfurt (Oder)
                </p>
              </div>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">Teil II: Kundeninformationen</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">Verkäuferidentität</h3>
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
                <h3 className="text-xl font-semibold text-rinos-text mb-3">Preise</h3>
                <p className="text-gray-700 leading-relaxed">
                  Alle Preise verstehen sich inklusive aller Steuern. Versandkosten werden separat ausgewiesen.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">Lieferung</h3>
                <p className="text-gray-700 leading-relaxed">
                  Das Risiko geht mit der Lieferung an den Verbraucher über.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">Streitbeilegung</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  Die Europäische Kommission stellt eine Plattform für die außergerichtliche Online-Streitbeilegung bereit:
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
              Zuletzt aktualisiert: 27.10.2020
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
