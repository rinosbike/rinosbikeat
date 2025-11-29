/**
 * Contact Page - /kontakt
 */

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-normal text-rinos-text mb-8">
          Kontakt
        </h1>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">
            Haben Sie Fragen? Kontaktieren Sie uns!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h2 className="text-xl font-semibold text-rinos-text mb-4">
                Kontaktinformationen
              </h2>
              <p className="text-gray-600">
                Diese Seite wird in Kürze mit unserem Kontaktformular und unseren Kontaktdaten verfügbar sein.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-rinos-text mb-4">
                Öffnungszeiten
              </h2>
              <p className="text-gray-600">
                Informationen zu unseren Öffnungszeiten folgen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
