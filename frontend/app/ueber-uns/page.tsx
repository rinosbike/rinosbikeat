/**
 * About Us Page - /ueber-uns
 */

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-normal text-rinos-text mb-8">
          Über uns
        </h1>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">
            Willkommen bei RINOS Bikes - Ihrem Partner für hochwertige Fahrräder.
          </p>

          <p className="text-gray-600 mb-6">
            Diese Seite wird in Kürze mit ausführlichen Informationen über unser Unternehmen, unsere Mission und unser Team verfügbar sein.
          </p>

          <h2 className="text-xl font-semibold text-rinos-text mt-8 mb-4">
            Unsere Mission
          </h2>
          <p className="text-gray-600">
            Wir bieten Premium-Fahrräder für jeden Einsatzbereich - von Gravel über Rennrad bis zum Mountainbike.
          </p>
        </div>
      </div>
    </div>
  )
}
