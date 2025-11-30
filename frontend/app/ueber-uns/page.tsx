/**
 * About Us Page - /ueber-uns
 */

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-container mx-auto px-6 md:px-20 py-12">
        <h1 className="text-3xl md:text-4xl font-normal text-rinos-text mb-8">
          Über uns
        </h1>

        <div className="prose max-w-none">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            RinosBike wurde gegründet, um allen Kunden qualitativ hochwertige Produkte zu fairen Preisen anzubieten.
            Wir bemühen uns, einen Marktplatz mit einer breiten Palette an Outdoor-Produkten anzubieten, die für
            jeden zugänglich sind.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Wir freuen uns auf Ihren Besuch!
          </p>

          <p className="text-gray-700 text-lg font-medium">
            Ihr RinosBike Team
          </p>
        </div>
      </div>
    </div>
  )
}
