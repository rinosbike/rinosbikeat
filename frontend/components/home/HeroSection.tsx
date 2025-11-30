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
  overlayOpacity?: number
  height?: 'default' | 'secondary'
}

export default function HeroSection({
  image,
  imageAlt,
  title,
  subtitle,
  buttonText,
  buttonLink,
  alignment = 'left',
  overlayOpacity = 40,
  height = 'default'
}: HeroSectionProps) {
  const heightClass = height === 'default'
    ? 'h-[400px] md:h-[450px]'
    : 'h-[350px] md:h-[400px]'

  const alignmentClasses = {
    left: 'justify-start text-left',
    right: 'justify-end text-right',
    center: 'justify-center text-center'
  }

  const gradientClasses = {
    left: 'bg-gradient-to-r from-black/40 to-transparent',
    right: 'bg-gradient-to-l from-black/30 to-transparent',
    center: 'bg-black/30'
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
      />
      <div className={`absolute inset-0 ${gradientClasses[alignment]} flex items-center ${alignmentClasses[alignment]}`}>
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
