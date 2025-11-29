/**
 * Sponsoring Page - /sponsoring
 */

export default function SponsoringPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-normal text-rinos-text mb-8">
          Sponsoring
        </h1>

        <div className="prose max-w-none space-y-8">
          <section>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Wir arbeiten mit den besten Herstellern der Welt in verschiedenen Disziplinen zusammen, um sicherzustellen, dass die Fahrräder, die Sie fahren, die bestmöglichen sind.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Jedes Fahrrad wird von professionellen Mechanikern in Europa individuell montiert, angepasst, eingestellt und getestet.
            </p>
          </section>

          <section className="bg-rinos-bg-secondary p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">
              Sponsoring-Möglichkeit
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Wir laden leidenschaftliche junge Fahrerinnen und Fahrer aller Radsportdisziplinen ein – ob Mountainbike, Gravel oder Rennrad – sich über Partnerschaftsmöglichkeiten zu informieren.
            </p>
            <div className="bg-white p-6 rounded-lg border-l-4 border-rinos-accent">
              <p className="text-gray-700 font-medium mb-2">
                Für Preisgespräche bezüglich gesponserter Athletinnen und Athleten:
              </p>
              <p className="text-gray-700">
                Kontaktieren Sie uns unter{' '}
                <a href="mailto:info@rinosbike.eu" className="text-rinos-accent hover:underline font-semibold">
                  info@rinosbike.eu
                </a>
              </p>
              <p className="text-gray-700 mt-2 text-sm italic">
                Wir haben einen Sonderpreis für unsere gesponserten Athleten und werden Sie überraschen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">
              Unsere Mission
            </h2>
            <div className="bg-gradient-to-r from-rinos-accent to-rinos-primary text-white p-8 rounded-lg">
              <p className="text-xl font-semibold mb-4">
                "Radfahren ohne Kompromisse bei Komfort und Qualität für alle erschwinglich machen."
              </p>
              <p className="text-lg">
                Unser übergeordnetes Ziel: Die Welt durch Radfahren zu einem besseren Ort machen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">
              Für wen ist unser Sponsoring geeignet?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-3">🚵</div>
                <h3 className="font-semibold text-rinos-text mb-2">Mountainbike</h3>
                <p className="text-gray-700 text-sm">
                  Cross-Country, Enduro, Trail – alle MTB-Disziplinen
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-3">🚴</div>
                <h3 className="font-semibold text-rinos-text mb-2">Rennrad</h3>
                <p className="text-gray-700 text-sm">
                  Straßenrennen, Zeitfahren, Criterium
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-3">🏔️</div>
                <h3 className="font-semibold text-rinos-text mb-2">Gravel</h3>
                <p className="text-gray-700 text-sm">
                  Abenteuerrennen, Bikepacking, Langstrecken
                </p>
              </div>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">
              Kontaktieren Sie uns
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Interessiert an einem Sponsoring? Wir freuen uns von Ihnen zu hören!
            </p>
            <div className="bg-rinos-bg-secondary p-6 rounded-lg">
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">E-Mail:</span>{' '}
                <a href="mailto:info@rinosbike.eu" className="text-rinos-accent hover:underline">
                  info@rinosbike.eu
                </a>
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Telefon:</span> +49 0335 66590614
              </p>
            </div>
          </section>

          <section className="text-center pt-8">
            <p className="text-gray-700 text-lg italic">
              Ihr Rinosbike Team
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
