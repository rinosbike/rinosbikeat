/**
 * Returns & Refund Page - /rueckgabe
 */

export default function RueckgabePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-container mx-auto px-6 md:px-20 py-12">
        <h1 className="text-3xl md:text-4xl font-normal text-rinos-text mb-8">
          Rückgabe & Erstattung
        </h1>

        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">Rückgabe</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Wenn Ihnen ein Artikel nicht gefällt oder die Größe nicht passt, können Sie den Artikel an uns zurücksenden.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-rinos-text mb-3">Rückgabeprozess:</h3>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Senden Sie Ihre Bestelldaten per E-Mail an <a href="mailto:info@rinosbike.eu" className="text-rinos-accent hover:underline">info@rinosbike.eu</a></li>
                <li>Nach Prüfung Ihrer Berechtigung erhalten Sie ein Rücksendeetikett</li>
                <li>Geben Sie das Paket bei einer Filiale des Versanddienstleisters ab</li>
                <li>Artikel müssen innerhalb von 14 Tagen zurückgesendet werden</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">Umtausch</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Manchmal haben Artikel einen Defekt oder sind fehlerhaft. In diesem Fall können Sie den Artikel selbstverständlich an uns zurücksenden.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Kontaktieren Sie uns unter <a href="mailto:info@rinosbike.eu" className="text-rinos-accent hover:underline">info@rinosbike.eu</a> und teilen Sie uns mit, ob Sie eine Rückerstattung oder einen Ersatz wünschen.
            </p>
            <div className="bg-rinos-bg-secondary p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-rinos-text mb-2">Wichtige Hinweise:</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Sie tragen die Kosten für die Rücksendung der Produkte</li>
                <li>Artikel müssen im Originalzustand zurückgesendet werden</li>
                <li>Die Rückerstattung erfolgt über die ursprüngliche Zahlungsmethode</li>
                <li>Bearbeitungszeit: innerhalb von 14 Tagen nach Erhalt der Rücksendung</li>
              </ul>
            </div>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Kontakt</h3>
            <p className="text-gray-700">
              Bei Fragen zu Rückgaben oder Erstattungen kontaktieren Sie uns bitte:
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
