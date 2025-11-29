/**
 * Imprint Page - /impressum
 */

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-normal text-rinos-text mb-8">
          Impressum
        </h1>

        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold text-rinos-text mb-4">
            Angaben gemäß § 5 TMG
          </h2>

          <div className="mb-8">
            <p className="text-rinos-text font-medium mb-2">Rinos Bikes GmbH</p>
            <p className="text-gray-700">Vertreten durch den Geschäftsführer Weiyang Zhang</p>
            <p className="text-gray-700">Goethestr 11E</p>
            <p className="text-gray-700">15234 Frankfurt (Oder)</p>
            <p className="text-gray-700">Deutschland</p>
          </div>

          <div className="mb-8">
            <p className="text-gray-700"><span className="font-medium">Telefon:</span> +49 0335 66590614</p>
            <p className="text-gray-700"><span className="font-medium">E-Mail:</span> <a href="mailto:info@rinosbike.eu" className="text-rinos-accent hover:underline">info@rinosbike.eu</a></p>
            <p className="text-gray-700"><span className="font-medium">USt-IdNr.:</span> DE334559559</p>
          </div>

          <div className="mb-8">
            <p className="text-gray-700">Eingetragen im Handelsregister des Amtsgerichts Frankfurt (Oder)</p>
            <p className="text-gray-700">Handelsregisternummer - Teil B des Handelsregisters - 18164</p>
          </div>

          <h2 className="text-xl font-semibold text-rinos-text mt-12 mb-4">
            Alternative Streitbeilegung
          </h2>

          <p className="text-gray-700 mb-4">
            Die Europäische Kommission stellt eine Plattform für die außergerichtliche Online-Streitbeilegung (OS-Plattform) bereit, die unter{' '}
            <a href="https://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer" className="text-rinos-accent hover:underline">
              https://ec.europa.eu/odr
            </a>{' '}
            abrufbar ist.
          </p>

          <h2 className="text-xl font-semibold text-rinos-text mt-12 mb-4">
            FairCommerce
          </h2>

          <p className="text-gray-700 mb-4">
            Wir sind Mitglied der Initiative „FairCommerce" seit 24.03.2021.
          </p>
          <p className="text-gray-700">
            Nähere Informationen finden Sie unter:{' '}
            <a href="https://www.fair-commerce.de" target="_blank" rel="noopener noreferrer" className="text-rinos-accent hover:underline">
              www.fair-commerce.de
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
