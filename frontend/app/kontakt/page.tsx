/**
 * Contact Page - /kontakt
 */

'use client'

import { useState } from 'react'

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic will be added later
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-container mx-auto px-6 md:px-20 py-12">
        <h1 className="text-3xl md:text-4xl font-normal text-rinos-text mb-8">
          Kontakt
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold text-rinos-text mb-6">
              Senden Sie uns eine Nachricht
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rinos-accent"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rinos-accent"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefonnummer
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rinos-accent"
                />
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Kommentar
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rinos-accent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rinos-primary text-white py-3 px-6 hover:opacity-90 transition-opacity text-sm font-medium"
              >
                Senden
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold text-rinos-text mb-6">
              Kontaktinformationen
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-rinos-text mb-2">Rinos Bikes GmbH</h3>
                <p className="text-gray-700">Goethestr 11E</p>
                <p className="text-gray-700">15234 Frankfurt (Oder)</p>
                <p className="text-gray-700">Deutschland</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-rinos-text mb-2">Kontakt</h3>
                <p className="text-gray-700">
                  <span className="font-medium">Telefon:</span> +49 0335 66590614
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">E-Mail:</span>{' '}
                  <a href="mailto:info@rinosbike.eu" className="text-rinos-accent hover:underline">
                    info@rinosbike.eu
                  </a>
                </p>
              </div>

              <div className="bg-rinos-bg-secondary p-6 rounded-lg mt-8">
                <h3 className="text-lg font-semibold text-rinos-text mb-3">Öffnungszeiten</h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Montag - Freitag:</span> 9:00 - 18:00 Uhr
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Samstag - Sonntag:</span> Geschlossen
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
