/**
 * Login/Register Page - /anmelden
 * User authentication with login and registration forms
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function AnmeldenPage() {
  const router = useRouter()
  const { login, register } = useAuthStore()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form state
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerFirstName, setRegisterFirstName] = useState('')
  const [registerLastName, setRegisterLastName] = useState('')
  const [registerPhone, setRegisterPhone] = useState('')

  const extractErrorMessage = (err: any): string => {
    // Handle validation errors (array format)
    if (err.response?.data?.detail && Array.isArray(err.response.data.detail)) {
      return err.response.data.detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ')
    }
    // Handle string errors
    if (typeof err.response?.data?.detail === 'string') {
      return err.response.data.detail
    }
    // Handle object errors
    if (err.response?.data?.detail && typeof err.response.data.detail === 'object') {
      return JSON.stringify(err.response.data.detail)
    }
    // Default error message
    return err.message || 'Ein Fehler ist aufgetreten'
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await login(loginEmail, loginPassword)
      router.push('/profil')
    } catch (err: any) {
      setError(extractErrorMessage(err) || 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Zugangsdaten.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Client-side password validation
    if (registerPassword.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein')
      setLoading(false)
      return
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(registerPassword)) {
      setError('Passwort muss mindestens einen Großbuchstaben enthalten')
      setLoading(false)
      return
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(registerPassword)) {
      setError('Passwort muss mindestens einen Kleinbuchstaben enthalten')
      setLoading(false)
      return
    }

    // Check for digit
    if (!/[0-9]/.test(registerPassword)) {
      setError('Passwort muss mindestens eine Ziffer enthalten')
      setLoading(false)
      return
    }

    try {
      await register({
        email: registerEmail,
        password: registerPassword,
        first_name: registerFirstName || undefined,
        last_name: registerLastName || undefined,
        phone: registerPhone || undefined,
      })
      setSuccess('Registrierung erfolgreich! Sie werden weitergeleitet...')
      setTimeout(() => {
        router.push('/profil')
      }, 1500)
    } catch (err: any) {
      console.error('Registration error:', err)
      const errorMsg = extractErrorMessage(err)

      // Translate common error messages to German
      if (errorMsg.includes('already registered') || errorMsg.includes('Email already')) {
        setError('Diese E-Mail-Adresse ist bereits registriert')
      } else if (errorMsg.includes('status code 500') || err.response?.status === 500) {
        setError('Serverfehler. Bitte versuchen Sie es später erneut.')
      } else {
        setError(errorMsg || 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <img
              src="/images/logo.png"
              alt="RINOS Bikes"
              className="h-16 w-auto mx-auto"
            />
          </Link>
          <h1 className="text-3xl font-normal text-gray-900">
            {mode === 'login' ? 'Anmelden' : 'Registrieren'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'login' ? 'Willkommen zurück!' : 'Erstellen Sie ein neues Konto'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-white rounded-lg shadow-sm p-1 flex mb-6">
          <button
            onClick={() => {
              setMode('login')
              setError(null)
              setSuccess(null)
            }}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              mode === 'login'
                ? 'bg-rinos-primary text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Anmelden
          </button>
          <button
            onClick={() => {
              setMode('register')
              setError(null)
              setSuccess(null)
            }}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              mode === 'register'
                ? 'bg-rinos-primary text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Registrieren
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-Mail-Adresse
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rinos-primary focus:border-transparent"
                  placeholder="ihre@email.com"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Passwort
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rinos-primary focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rinos-primary text-white py-3 font-medium hover:bg-rinos-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Anmelden...' : 'Anmelden'}
              </button>
            </form>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="register-firstname" className="block text-sm font-medium text-gray-700 mb-1">
                    Vorname
                  </label>
                  <input
                    id="register-firstname"
                    type="text"
                    value={registerFirstName}
                    onChange={(e) => setRegisterFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rinos-primary focus:border-transparent"
                    placeholder="Max"
                  />
                </div>

                <div>
                  <label htmlFor="register-lastname" className="block text-sm font-medium text-gray-700 mb-1">
                    Nachname
                  </label>
                  <input
                    id="register-lastname"
                    type="text"
                    value={registerLastName}
                    onChange={(e) => setRegisterLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rinos-primary focus:border-transparent"
                    placeholder="Mustermann"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-Mail-Adresse *
                </label>
                <input
                  id="register-email"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rinos-primary focus:border-transparent"
                  placeholder="ihre@email.com"
                />
              </div>

              <div>
                <label htmlFor="register-phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefonnummer
                </label>
                <input
                  id="register-phone"
                  type="tel"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rinos-primary focus:border-transparent"
                  placeholder="+43 123 456789"
                />
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Passwort *
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rinos-primary focus:border-transparent"
                    placeholder="Mindestens 8 Zeichen"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Mindestens 8 Zeichen mit Groß- und Kleinbuchstaben sowie Ziffer
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rinos-primary text-white py-3 font-medium hover:bg-rinos-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registrieren...' : 'Konto erstellen'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Mit der Registrierung stimmen Sie unseren{' '}
                <Link href="/agb" className="text-rinos-primary hover:underline">
                  AGB
                </Link>{' '}
                und{' '}
                <Link href="/datenschutz" className="text-rinos-primary hover:underline">
                  Datenschutzbestimmungen
                </Link>{' '}
                zu.
              </p>
            </form>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Zurück zum Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
