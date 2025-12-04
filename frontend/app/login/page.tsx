/**
 * Login Page - /login
 * Redirects to /anmelden (German login page)
 */

import { redirect } from 'next/navigation'

export default function LoginPage() {
  redirect('/anmelden')
}
