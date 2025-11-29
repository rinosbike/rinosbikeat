/**
 * Shipping Options Page - /versandoptionen
 * Redirect to main shipping page
 */

import { redirect } from 'next/navigation'

export default function VersandoptionenPage() {
  redirect('/versand')
}
