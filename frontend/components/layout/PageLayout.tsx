/**
 * Page Layout Component
 * Provides consistent margins and padding for all content pages
 */

import { ReactNode } from 'react'
import { LAYOUT_CLASSES } from '@/lib/design-system'

interface PageLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  className?: string
  containerClassName?: string
}

export default function PageLayout({
  children,
  title,
  description,
  className = '',
  containerClassName = ''
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <div className={`${LAYOUT_CLASSES.container} ${containerClassName}`}>
        {title && (
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-gray-600 max-w-3xl">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

/**
 * Prose Layout for content-heavy pages
 */
export function ProseLayout({
  children,
  title,
  className = ''
}: {
  children: ReactNode
  title?: string
  className?: string
}) {
  return (
    <PageLayout title={title} containerClassName={className}>
      <div className="prose prose-lg max-w-none">
        {children}
      </div>
    </PageLayout>
  )
}
