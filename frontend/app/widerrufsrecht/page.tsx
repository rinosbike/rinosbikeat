/**
 * Right of Withdrawal Page - /widerrufsrecht
 */

export default function WiderrufsrechtPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-normal text-rinos-text mb-8">
          Widerrufsrecht
        </h1>

        <div className="prose max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">Widerrufsrecht für Verbraucher</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Ein „Verbraucher" ist jede natürliche Person, die ein Rechtsgeschäft abschließt, das überwiegend weder ihrer gewerblichen noch ihrer selbstständigen beruflichen Tätigkeit zugerechnet werden kann.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">Widerrufsbelehrung</h2>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-rinos-text mb-3">Widerrufsrecht</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Die Widerrufsfrist beträgt 14 Tage ab:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Dem Tag, an dem Sie oder ein von Ihnen benannter Dritter (nicht der Beförderer) die Waren bei einer Standard-Bestellung mit einheitlicher Lieferung in Besitz genommen haben</li>
                <li>Dem Tag, an dem Sie die letzte Ware in Besitz genommen haben, wenn Waren separat geliefert werden</li>
                <li>Dem Tag, an dem Sie die letzte Teilsendung in Besitz genommen haben, wenn ein Produkt in mehreren Sendungen geliefert wird</li>
              </ul>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">Ausübung des Widerrufsrechts</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sie müssen uns (Rinos Bikes GmbH, Goethestr 11E, 15234 Frankfurt (Oder), Telefonnummer: +49 0335 66590614, E-Mail: info@rinosbike.eu) Ihre Entscheidung, diesen Vertrag zu widerrufen, mittels einer eindeutigen Erklärung (z.B. ein per Post versandter Brief, Fax oder E-Mail) mitteilen.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Sie können das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist. Die Mitteilung vor Ablauf der 14-Tage-Frist erfüllt die Anforderung.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-rinos-text mb-3">Folgen des Widerrufs</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Wir erstatten alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen 14 Tagen ab dem Tag, an dem wir die Mitteilung über Ihren Widerruf dieses Vertrags erhalten haben.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Die Rückzahlung erfolgt über dieselbe Zahlungsmethode ohne Gebühren. Das Unternehmen kann die Rückerstattung zurückhalten, bis die Produkte zurückgesendet wurden oder ein Rücksendenachweis vorliegt.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sie müssen die Waren unverzüglich und in jedem Fall spätestens binnen 14 Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurücksenden oder übergeben.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Sie tragen die unmittelbaren Kosten der Rücksendung der Waren. Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">Ausschluss des Widerrufsrechts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Das Widerrufsrecht besteht nicht bei folgenden Verträgen:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Nach Kundenspezifikation angefertigte oder eindeutig auf persönliche Bedürfnisse zugeschnittene Produkte</li>
              <li>Waren, die schnell verderben können</li>
              <li>Alkoholische Getränke (unter bestimmten Bedingungen)</li>
              <li>Zeitungen, Zeitschriften oder Magazine (außer Abonnements)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Das Widerrufsrecht erlischt, wenn:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
              <li>Versiegelte Waren aus Gründen des Gesundheitsschutzes oder der Hygiene entsiegelt wurden</li>
              <li>Produkte untrennbar mit anderen Waren vermischt wurden</li>
              <li>Audio-, Video- oder Software in versiegelter Verpackung geöffnet wurde</li>
            </ul>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">Muster-Widerrufsformular</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-600 mb-4 italic">
                Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular verwenden:
              </p>
              <div className="border-2 border-gray-300 p-6 bg-white">
                <p className="text-gray-700 mb-3"><strong>An:</strong></p>
                <p className="text-gray-700 mb-2">Rinos Bikes GmbH</p>
                <p className="text-gray-700 mb-2">Goethestr 11E</p>
                <p className="text-gray-700 mb-4">15234 Frankfurt (Oder), Deutschland</p>
                <p className="text-gray-700 mb-4">E-Mail: info@rinosbike.eu</p>

                <p className="text-gray-700 mb-6">
                  Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)
                </p>

                <div className="space-y-4 border-t border-gray-200 pt-4">
                  <p className="text-gray-700">Bestellt am (*)/erhalten am (*):</p>
                  <p className="text-gray-700 text-sm">_________________________________</p>

                  <p className="text-gray-700 mt-4">Name des/der Verbraucher(s):</p>
                  <p className="text-gray-700 text-sm">_________________________________</p>

                  <p className="text-gray-700 mt-4">Anschrift des/der Verbraucher(s):</p>
                  <p className="text-gray-700 text-sm">_________________________________</p>
                  <p className="text-gray-700 text-sm">_________________________________</p>

                  <p className="text-gray-700 mt-4">Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</p>
                  <p className="text-gray-700 text-sm">_________________________________</p>

                  <p className="text-gray-700 mt-4">Datum:</p>
                  <p className="text-gray-700 text-sm">_________________________________</p>
                </div>

                <p className="text-sm text-gray-500 mt-6 italic">
                  (*) Unzutreffendes streichen
                </p>
              </div>
            </div>
          </section>

          <section className="border-t pt-6">
            <p className="text-sm text-gray-600 italic">
              Letzte Aktualisierung: 27.10.2020
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
