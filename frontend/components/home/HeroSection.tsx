/**
 * Hero Section Component
 * Reusable hero banner with image and text overlay
 * Based on rinosbike.eu image-banner pattern
 */

import Image from 'next/image'
import Link from 'next/link'

interface HeroSectionProps {
  image: string
  imageAlt: string
  title: string
  subtitle?: string
  buttonText: string
  buttonLink: string
  alignment?: 'left' | 'right' | 'center'
  height?: 'default' | 'secondary'
  overlayOpacity?: number // 0-100, matches EU site's image_overlay_opacity
}

export default function HeroSection({
  image,
  imageAlt,
  title,
  subtitle,
  buttonText,
  buttonLink,
  alignment = 'left',
  height = 'default',
  overlayOpacity = 0
}: HeroSectionProps) {
  const heightClass = height === 'default'
    ? 'h-[400px] md:h-[450px]'
    : 'h-[350px] md:h-[400px]'

  const alignmentClasses = {
    left: 'justify-start text-left',
    right: 'justify-end text-right',
    center: 'justify-center text-center'
  }

  return (
    <section className={`relative ${heightClass} overflow-hidden`}>
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover object-center"
        sizes="100vw"
        quality={90}
        priority
      />
      {/* Dark overlay - matches EU site's ::after implementation */}
      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: overlayOpacity / 100 }}
        />
      )}
      <div className={`absolute inset-0 flex items-center ${alignmentClasses[alignment]}`}>
        <div className="max-w-container mx-auto px-6 md:px-20 w-full">
          <div className={`max-w-xl text-white ${alignment === 'right' ? 'ml-auto' : alignment === 'center' ? 'mx-auto' : ''}`}>
            {subtitle && (
              <p className="text-lg md:text-xl mb-2 font-light">
                {subtitle}
              </p>
            )}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {title}
            </h2>
            <Link
              href={buttonLink}
              className="inline-block bg-white text-gray-900 px-8 py-3 text-lg font-medium hover:bg-gray-100 transition-colors"
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
