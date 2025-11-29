/**
 * Right of Withdrawal Page - /widerrufsrecht
 */

export default function WiderrufsrechtPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-normal text-rinos-text mb-8">
          Widerrufsrecht
        </h1>

        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">Widerrufsrecht für Verbraucher</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Die Widerrufsfrist beträgt 14 Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Ausübung des Widerrufsrechts</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h4 className="font-semibold text-rinos-text mb-3">Kontaktdaten für Widerrufe:</h4>
              <p className="text-gray-700 mb-2"><strong>Rinos Bikes GmbH</strong></p>
              <p className="text-gray-700">Goethestr 11E</p>
              <p className="text-gray-700 mb-3">15234 Frankfurt (Oder)</p>
              <p className="text-gray-700">Telefon: +49 0335 66590614</p>
              <p className="text-gray-700">E-Mail: <a href="mailto:info@rinosbike.eu" className="text-rinos-accent hover:underline">info@rinosbike.eu</a></p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Rücksendung der Waren</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sie müssen die Waren innerhalb von 14 Tagen nach Mitteilung des Widerrufs an uns zurücksenden. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von 14 Tagen absenden.
            </p>
            <div className="bg-rinos-bg-secondary p-6 rounded-lg">
              <h4 className="font-semibold text-rinos-text mb-2">Wichtige Hinweise:</h4>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Kosten der Rücksendung:</strong> Sie tragen die unmittelbaren Kosten der Rücksendung der Waren</li>
                <li><strong>Wertersatz:</strong> Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist</li>
              </ul>
            </div>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Rückzahlung</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Wir erstatten alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen 14 Tagen ab dem Tag zurück, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben.
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Ausschluss des Widerrufsrechts</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Das Widerrufsrecht besteht nicht bei folgenden Verträgen:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Lieferung von Waren, die nach Kundenspezifikation angefertigt wurden</li>
              <li>Lieferung von Waren, die schnell verderben können</li>
              <li>Lieferung alkoholischer Getränke</li>
              <li>Lieferung versiegelter Waren, die aus Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, wenn ihre Versiegelung nach der Lieferung entfernt wurde</li>
              <li>Lieferung von Software in versiegelter Verpackung, wenn die Versiegelung nach der Lieferung entfernt wurde</li>
            </ul>
          </section>

          <section className="mt-8 border-t pt-8">
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Muster-Widerrufsformular</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-600 mb-4 italic">
                Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular verwenden:
              </p>
              <div className="border border-gray-300 p-4 bg-white">
                <p className="text-gray-700 mb-2">An:</p>
                <p className="text-gray-700 mb-2">Rinos Bikes GmbH</p>
                <p className="text-gray-700 mb-2">Goethestr 11E</p>
                <p className="text-gray-700 mb-4">15234 Frankfurt (Oder)</p>
                <p className="text-gray-700 mb-4">E-Mail: info@rinosbike.eu</p>
                <p className="text-gray-700 mb-4">
                  Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)
                </p>
                <p className="text-gray-700 mb-2">Bestellt am (*)/erhalten am (*)</p>
                <p className="text-gray-700 mb-2">Name des/der Verbraucher(s)</p>
                <p className="text-gray-700 mb-2">Anschrift des/der Verbraucher(s)</p>
                <p className="text-gray-700 mb-4">Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)</p>
                <p className="text-gray-700 text-sm">Datum</p>
                <p className="text-sm text-gray-500 mt-4 italic">(*) Unzutreffendes streichen</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
