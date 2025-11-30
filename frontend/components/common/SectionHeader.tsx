/**
 * Section Header Component
 * Reusable section header with title and optional description
 * Based on rinosbike.eu section patterns
 */

interface SectionHeaderProps {
  title: string
  description?: string
  alignment?: 'left' | 'center'
  size?: 'default' | 'large'
  className?: string
}

export default function SectionHeader({
  title,
  description,
  alignment = 'center',
  size = 'default',
  className = ''
}: SectionHeaderProps) {
  const alignmentClass = alignment === 'center' ? 'text-center' : 'text-left'
  const titleSize = size === 'large'
    ? 'text-3xl md:text-4xl lg:text-5xl'
    : 'text-3xl md:text-4xl'

  return (
    <div className={`mb-10 ${alignmentClass} ${className}`}>
      <h2 className={`${titleSize} font-bold text-gray-900 mb-3`}>
        {title}
      </h2>
      {description && (
        <p className="text-lg text-gray-600">
          {description}
        </p>
      )}
    </div>
  )
}
