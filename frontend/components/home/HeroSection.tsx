/**
 * Hero Section Component
 * Premium Apple/Framer-inspired hero banner
 * Reusable with multiple layout options
 */

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  image: string
  imageAlt: string
  title: string
  subtitle?: string
  description?: string
  buttonText: string
  buttonLink: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  alignment?: 'left' | 'right' | 'center'
  height?: 'default' | 'tall' | 'full'
  overlayOpacity?: number
  overlayGradient?: boolean
  theme?: 'dark' | 'light'
}

export default function HeroSection({
  image,
  imageAlt,
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  secondaryButtonText,
  secondaryButtonLink,
  alignment = 'left',
  height = 'default',
  overlayOpacity = 40,
  overlayGradient = true,
  theme = 'dark'
}: HeroSectionProps) {
  // Height classes
  const heightClasses = {
    default: 'min-h-[500px] md:min-h-[600px] lg:min-h-[700px]',
    tall: 'min-h-[600px] md:min-h-[700px] lg:min-h-[800px]',
    full: 'min-h-screen'
  }

  // Alignment classes for content
  const alignmentClasses = {
    left: 'items-start text-left',
    right: 'items-end text-right',
    center: 'items-center text-center'
  }

  // Content positioning
  const contentPosition = {
    left: '',
    right: 'ml-auto',
    center: 'mx-auto'
  }

  // Theme-based text colors
  const textColor = theme === 'dark' ? 'text-white' : 'text-rinos-dark'
  const subtitleColor = theme === 'dark' ? 'text-white/70' : 'text-rinos-text-secondary'

  return (
    <section className={`relative ${heightClasses[height]} overflow-hidden`}>
      {/* Background Image */}
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover object-center transition-transform duration-700"
        sizes="100vw"
        quality={90}
        priority
      />

      {/* Overlay */}
      {overlayGradient ? (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      ) : overlayOpacity > 0 ? (
        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: overlayOpacity / 100 }}
        />
      ) : null}

      {/* Content Container */}
      <div className="absolute inset-0 flex items-center">
        <div className="container-premium w-full">
          <div className={`flex flex-col ${alignmentClasses[alignment]}`}>
            <div className={`max-w-2xl ${contentPosition[alignment]}`}>
              {/* Subtitle / Overline */}
              {subtitle && (
                <p className={`text-overline uppercase tracking-widest ${subtitleColor}
                             mb-4 animate-fade-in-up`}>
                  {subtitle}
                </p>
              )}

              {/* Title */}
              <h1 className={`text-display-sm md:text-display lg:text-display-lg
                            font-bold tracking-tight ${textColor}
                            mb-6 animate-fade-in-up delay-100`}>
                {title}
              </h1>

              {/* Description */}
              {description && (
                <p className={`text-body-lg ${subtitleColor}
                             max-w-xl mb-8 animate-fade-in-up delay-200
                             ${alignment === 'center' ? 'mx-auto' : ''}`}>
                  {description}
                </p>
              )}

              {/* Buttons */}
              <div className={`flex flex-wrap gap-4 animate-fade-in-up delay-300
                            ${alignment === 'center' ? 'justify-center' : ''}`}>
                {/* Primary Button */}
                <Link
                  href={buttonLink}
                  className="btn bg-white text-rinos-dark px-8 py-4 rounded-full
                           font-medium shadow-soft hover:shadow-medium
                           hover:bg-rinos-bg-tertiary
                           active:scale-[0.98]
                           transition-all duration-300 ease-out-expo
                           inline-flex items-center gap-2 group"
                >
                  {buttonText}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300
                                        group-hover:translate-x-1" />
                </Link>

                {/* Secondary Button */}
                {secondaryButtonText && secondaryButtonLink && (
                  <Link
                    href={secondaryButtonLink}
                    className={`btn px-8 py-4 rounded-full font-medium
                              border-2 transition-all duration-300 ease-out-expo
                              active:scale-[0.98]
                              ${theme === 'dark'
                                ? 'border-white/30 text-white hover:bg-white/10'
                                : 'border-rinos-dark/30 text-rinos-dark hover:bg-black/5'
                              }`}
                  >
                    {secondaryButtonText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32
                    bg-gradient-to-t from-white to-transparent
                    pointer-events-none" />
    </section>
  )
}

/**
 * Compact Hero Variant
 * For secondary pages with less prominent hero sections
 */
export function HeroCompact({
  title,
  subtitle,
  backgroundImage,
  alignment = 'center'
}: {
  title: string
  subtitle?: string
  backgroundImage?: string
  alignment?: 'left' | 'center'
}) {
  return (
    <section className="relative min-h-[300px] md:min-h-[400px] flex items-center overflow-hidden">
      {/* Background */}
      {backgroundImage ? (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-black/50" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-rinos-dark to-black" />
      )}

      {/* Content */}
      <div className="relative container-premium py-16 md:py-24">
        <div className={`max-w-3xl ${alignment === 'center' ? 'mx-auto text-center' : ''}`}>
          {subtitle && (
            <p className="text-overline uppercase tracking-widest text-white/60 mb-4">
              {subtitle}
            </p>
          )}
          <h1 className="text-display-sm md:text-display font-bold text-white">
            {title}
          </h1>
        </div>
      </div>
    </section>
  )
}
