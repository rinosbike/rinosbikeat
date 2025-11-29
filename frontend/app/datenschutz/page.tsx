/**
 * Privacy Policy Page - /datenschutz
 */

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-normal text-rinos-text mb-8">
          Datenschutzerklärung
        </h1>

        <div className="prose max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-rinos-text mb-4">Datenschutzerklärung</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen. Die Bereitstellung von Daten ist freiwillig, sofern nicht anders angegeben.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Server-Log-Dateien</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Die Nutzung der Website führt zur automatischen Datenspeicherung, einschließlich IP-Adressen, Zugriffszeiten und Datenvolumen. Die Verarbeitung erfolgt gemäß Artikel 6(1)(f) DSGVO aufgrund unserer berechtigten betrieblichen Interessen.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Sie können unsere Websites nutzen, ohne personenbezogene Daten anzugeben. Server-Logs werden aus Sicherheitsgründen für maximal 30 Tage gespeichert und dann automatisch gelöscht.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Kundenkontakt</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              E-Mail-Anfragen und Kontaktformulare erfassen nur freiwillig bereitgestellte Informationen (Name, E-Mail, Nachricht).
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              Die Verarbeitung erfolgt gemäß Artikel 6(1)(b) DSGVO für vorvertragliche Angelegenheiten oder gemäß Artikel 6(1)(f) für andere Anfragen.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Sie können der Verarbeitung jederzeit widersprechen.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Kundenkonten und Bestellungen</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Die Erstellung eines Kundenkontos erfordert Ihre Einwilligung gemäß Artikel 6(1)(a) DSGVO. Die Verarbeitung von Bestelldaten erfolgt gemäß Artikel 6(1)(b) DSGVO als Vertragserfüllung.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Datenübermittlungen erfolgen an Versandunternehmen, Zahlungsabwickler und IT-Dienstleister mit eingeschränktem Umfang.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Versandkommunikation</h3>
            <p className="text-gray-700 leading-relaxed">
              E-Mail-Adressen werden nur mit ausdrücklicher Zustimmung an Versanddienstleister weitergeleitet. Diese Einwilligung kann jederzeit widerrufen werden.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Zahlungsmethoden</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Bei Verwendung von PayPal gelten die separaten Datenschutzbestimmungen von PayPal:
            </p>
            <p className="text-gray-700">
              <a href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full" target="_blank" rel="noopener noreferrer" className="text-rinos-accent hover:underline">
                PayPal Datenschutzerklärung
              </a>
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Datenrechte und Speicherung</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Die Aufbewahrung personenbezogener Daten erfolgt gemäß Gewährleistungsfristen und gesetzlichen Anforderungen, danach erfolgt die Löschung.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sie besitzen folgende Rechte gemäß DSGVO:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Artikel 15:</strong> Recht auf Auskunft</li>
              <li><strong>Artikel 16:</strong> Recht auf Berichtigung</li>
              <li><strong>Artikel 17:</strong> Recht auf Löschung</li>
              <li><strong>Artikel 18:</strong> Recht auf Einschränkung der Verarbeitung</li>
              <li><strong>Artikel 20:</strong> Recht auf Datenübertragbarkeit</li>
              <li><strong>Artikel 21:</strong> Widerspruchsrecht</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Beschwerden können gemäß Artikel 77 DSGVO bei Aufsichtsbehörden eingereicht werden.
            </p>
          </section>

          <section className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-rinos-text mb-3">Kontakt für Datenschutzanfragen</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte:
            </p>
            <div className="space-y-2">
              <p className="text-gray-700"><strong>Rinos Bikes GmbH</strong></p>
              <p className="text-gray-700">Goethestr 11E</p>
              <p className="text-gray-700">15234 Frankfurt (Oder), Deutschland</p>
              <p className="text-gray-700">
                <strong>E-Mail:</strong> <a href="mailto:info@rinosbike.eu" className="text-rinos-accent hover:underline">info@rinosbike.eu</a>
              </p>
              <p className="text-gray-700"><strong>Telefon:</strong> +49 0335 66590614</p>
            </div>
          </section>

          <section className="border-t pt-6">
            <p className="text-sm text-gray-600 italic">
              Zuletzt aktualisiert: 27. Oktober 2020
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
