/**
 * Imprint Page - /impressum
 */

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-normal text-rinos-text mb-8">
          Impressum
        </h1>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">
            Diese Seite wird in Kürze verfügbar sein.
          </p>

          <h2 className="text-xl font-semibold text-rinos-text mt-8 mb-4">
            RINOS Bikes
          </h2>

          <p className="text-gray-600">
            Informationen über den Betreiber und die rechtlichen Angaben gemäß § 5 TMG werden hier veröffentlicht.
          </p>
        </div>
      </div>
    </div>
  )
}
