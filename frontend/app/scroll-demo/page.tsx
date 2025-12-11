/**
 * Scroll Animation Demo Page
 * =============================================================================
 * Full example page demonstrating all scroll animation block types
 *
 * This page shows:
 * - ScrollRevealImage: Images that animate on scroll
 * - ScrollParallaxSection: Parallax background sections
 * - PinnedScrollSection: Sections that pin during scroll
 * - HorizontalGalleryScroll: Horizontal scrolling gallery
 * - ScrollTimelineBlock: Animated timeline
 * - ScrollRevealContainer/Grid: General purpose reveal animations
 */

'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Shield, Rocket } from 'lucide-react'

// Import scroll animation components
import {
  ScrollRevealImage,
  ScrollParallaxSection,
  PinnedScrollSection,
  HorizontalGalleryScroll,
  ScrollTimelineBlock,
  ScrollRevealContainer,
  ScrollRevealText,
  ScrollRevealGrid,
} from '@/components/blocks/ScrollAnimationBlocks'

// Import animation engine (auto-initializes)
import '@/lib/scroll-animation-engine'

// Import styles
import '@/styles/scroll-animations.css'

export default function ScrollDemoPage() {
  return (
    <main className="bg-white">
      {/* =================================================================
          HERO SECTION - Basic Scroll Reveal
          ================================================================= */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated heading */}
          <ScrollRevealText
            tag="h1"
            animation="slide-up"
            className="text-5xl md:text-7xl font-bold text-black mb-6"
          >
            Scroll-Driven Animations
          </ScrollRevealText>

          {/* Animated subtitle */}
          <ScrollRevealContainer animation="fade" delay={0.2}>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A premium animation system for your CMS. Scroll down to see
              different animation types in action.
            </p>
          </ScrollRevealContainer>

          {/* Animated CTA */}
          <ScrollRevealContainer animation="slide-up" delay={0.4}>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full
                       font-medium hover:bg-gray-800 transition-colors"
            >
              Explore Examples
              <ArrowRight className="w-5 h-5" />
            </a>
          </ScrollRevealContainer>

          {/* Scroll indicator */}
          <ScrollRevealContainer animation="fade" delay={0.8}>
            <div className="mt-16 flex flex-col items-center text-gray-400">
              <span className="text-sm mb-2">Scroll to explore</span>
              <div className="w-6 h-10 border-2 border-gray-300 rounded-full p-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce mx-auto" />
              </div>
            </div>
          </ScrollRevealContainer>
        </div>
      </section>

      {/* =================================================================
          SCROLL REVEAL GRID - Staggered Feature Cards
          ================================================================= */}
      <section id="features" className="px-6 py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <ScrollRevealContainer animation="slide-up" className="text-center mb-16">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Animation Types
            </span>
            <h2 className="text-4xl font-bold text-black mt-2">
              Five Powerful Block Types
            </h2>
          </ScrollRevealContainer>

          <ScrollRevealGrid columns={3} gap={24} stagger={0.15}>
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Scroll Reveal</h3>
              <p className="text-gray-600">
                Elements fade, slide, zoom, or blur into view as they enter the viewport.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Parallax</h3>
              <p className="text-gray-600">
                Background images move at different speeds creating depth and immersion.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pinned Sections</h3>
              <p className="text-gray-600">
                Sections pin in place while content transitions through scroll progress.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Horizontal Scroll</h3>
              <p className="text-gray-600">
                Vertical scrolling moves content horizontally for unique gallery experiences.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Timeline</h3>
              <p className="text-gray-600">
                Progressive timeline reveals with animated progress line and staggered items.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white font-bold">+</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Fully Customizable</h3>
              <p className="text-gray-600">
                Every animation can be tuned via data attributes for complete creative control.
              </p>
            </div>
          </ScrollRevealGrid>
        </div>
      </section>

      {/* =================================================================
          SCROLL REVEAL IMAGE - Different Animation Types
          ================================================================= */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <ScrollRevealContainer animation="slide-up" className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black">
              Image Reveal Animations
            </h2>
            <p className="text-gray-600 mt-4">
              Each image uses a different reveal animation
            </p>
          </ScrollRevealContainer>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Fade */}
            <div>
              <ScrollRevealImage
                data={{
                  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
                  alt: 'Fade animation demo',
                  animation: 'fade',
                  duration: 1,
                  delay: 0,
                  easing: 'power3',
                  trigger: '75%',
                  once: true,
                  aspectRatio: '4/3',
                }}
                className="aspect-[4/3]"
              />
              <p className="text-center mt-4 text-sm text-gray-500">Fade In</p>
            </div>

            {/* Slide Up */}
            <div>
              <ScrollRevealImage
                data={{
                  image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800',
                  alt: 'Slide up animation demo',
                  animation: 'slide-up',
                  duration: 0.8,
                  delay: 0.1,
                  easing: 'power3',
                  trigger: '75%',
                  once: true,
                  aspectRatio: '4/3',
                }}
                className="aspect-[4/3]"
              />
              <p className="text-center mt-4 text-sm text-gray-500">Slide Up</p>
            </div>

            {/* Zoom */}
            <div>
              <ScrollRevealImage
                data={{
                  image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800',
                  alt: 'Zoom animation demo',
                  animation: 'zoom',
                  duration: 0.8,
                  delay: 0.2,
                  easing: 'back',
                  trigger: '75%',
                  once: true,
                  aspectRatio: '4/3',
                }}
                className="aspect-[4/3]"
              />
              <p className="text-center mt-4 text-sm text-gray-500">Zoom In</p>
            </div>

            {/* Slide Left */}
            <div>
              <ScrollRevealImage
                data={{
                  image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800',
                  alt: 'Slide left animation demo',
                  animation: 'slide-left',
                  duration: 0.8,
                  delay: 0,
                  easing: 'power4',
                  trigger: '75%',
                  once: true,
                  aspectRatio: '4/3',
                }}
                className="aspect-[4/3]"
              />
              <p className="text-center mt-4 text-sm text-gray-500">Slide Left</p>
            </div>

            {/* Rotate */}
            <div>
              <ScrollRevealImage
                data={{
                  image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800',
                  alt: 'Rotate animation demo',
                  animation: 'rotate',
                  duration: 1,
                  delay: 0.1,
                  easing: 'elastic',
                  trigger: '75%',
                  once: true,
                  aspectRatio: '4/3',
                }}
                className="aspect-[4/3]"
              />
              <p className="text-center mt-4 text-sm text-gray-500">Rotate In</p>
            </div>

            {/* Blur */}
            <div>
              <ScrollRevealImage
                data={{
                  image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800',
                  alt: 'Blur animation demo',
                  animation: 'blur',
                  duration: 1.2,
                  delay: 0.2,
                  easing: 'expo',
                  trigger: '75%',
                  once: true,
                  aspectRatio: '4/3',
                }}
                className="aspect-[4/3]"
              />
              <p className="text-center mt-4 text-sm text-gray-500">Blur In</p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          PARALLAX SECTION
          ================================================================= */}
      <ScrollParallaxSection
        data={{
          backgroundImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920',
          overlayColor: 'rgba(0,0,0,0.5)',
          parallaxSpeed: 0.4,
          height: '80vh',
          heading: 'Parallax Effect',
          subheading: 'The background moves slower than the content, creating a sense of depth and immersion.',
          contentAnimation: 'slide-up',
          textAlign: 'center',
        }}
      />

      {/* =================================================================
          PINNED SCROLL SECTION
          ================================================================= */}
      <PinnedScrollSection
        data={{
          backgroundColor: '#000000',
          pinDuration: 3,
          panels: JSON.stringify([
            {
              heading: 'Innovation',
              text: 'Pushing boundaries with cutting-edge technology and design. Every detail matters when creating exceptional experiences.',
            },
            {
              heading: 'Craftsmanship',
              text: 'Built with precision and attention to detail. We believe in quality over quantity, substance over flash.',
            },
            {
              heading: 'Performance',
              text: 'Engineered for maximum efficiency. Smooth animations that work across all devices and browsers.',
            },
            {
              heading: 'Accessibility',
              text: 'Respects user preferences including reduced motion. Progressive enhancement ensures content is always available.',
            },
          ]),
          transitionType: 'fade',
          progressIndicator: true,
        }}
      />

      {/* =================================================================
          SCROLL TIMELINE
          ================================================================= */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <ScrollRevealContainer animation="slide-up" className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black">
              Our Journey
            </h2>
            <p className="text-gray-600 mt-4">
              A timeline that reveals as you scroll
            </p>
          </ScrollRevealContainer>

          <ScrollTimelineBlock
            data={{
              items: JSON.stringify([
                {
                  date: '2020',
                  title: 'The Beginning',
                  description: 'Started with a simple idea: make scroll animations accessible to everyone building with a CMS.',
                },
                {
                  date: '2021',
                  title: 'First Release',
                  description: 'Launched the initial version with basic fade and slide animations. The response was overwhelming.',
                },
                {
                  date: '2022',
                  title: 'Major Update',
                  description: 'Added parallax, pinned sections, and horizontal scroll. Performance optimizations made it production-ready.',
                },
                {
                  date: '2023',
                  title: 'Timeline Block',
                  description: 'Introduced the timeline block type with progressive reveal and animated progress indicators.',
                },
                {
                  date: '2024',
                  title: 'Present Day',
                  description: 'Continuing to innovate with new animation types and improved accessibility features.',
                },
              ]),
              layout: 'alternating',
              lineColor: '#000000',
              dotColor: '#000000',
              itemAnimation: 'slide-up',
              stagger: 0.1,
              progressLine: true,
            }}
          />
        </div>
      </section>

      {/* =================================================================
          HORIZONTAL GALLERY SCROLL
          ================================================================= */}
      <section className="py-24">
        <div className="px-6 max-w-6xl mx-auto mb-12">
          <ScrollRevealContainer animation="slide-up" className="text-center">
            <h2 className="text-4xl font-bold text-black">
              Horizontal Gallery
            </h2>
            <p className="text-gray-600 mt-4">
              Scroll vertically to move through the gallery horizontally
            </p>
          </ScrollRevealContainer>
        </div>

        <HorizontalGalleryScroll
          data={{
            images: [
              { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', alt: 'Bike 1', caption: 'Mountain Explorer' },
              { src: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800', alt: 'Bike 2', caption: 'Road Warrior' },
              { src: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800', alt: 'Bike 3', caption: 'Urban Cruiser' },
              { src: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800', alt: 'Bike 4', caption: 'Speed Demon' },
              { src: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800', alt: 'Bike 5', caption: 'Classic Edition' },
              { src: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800', alt: 'Bike 6', caption: 'Electric Future' },
            ],
            backgroundColor: '#fafafa',
            imageSize: 'medium',
            gap: 32,
            scrollSpeed: 1,
            showCaptions: true,
            direction: 'left',
          }}
        />
      </section>

      {/* =================================================================
          FINAL CTA SECTION
          ================================================================= */}
      <section className="px-6 py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollRevealText
            tag="h2"
            animation="slide-up"
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Get Started?
          </ScrollRevealText>

          <ScrollRevealContainer animation="fade" delay={0.2}>
            <p className="text-xl text-gray-400 mb-8">
              Add scroll-driven animations to your CMS in minutes.
            </p>
          </ScrollRevealContainer>

          <ScrollRevealContainer animation="slide-up" delay={0.4}>
            <Link
              href="/admin/pages"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full
                       font-medium hover:bg-gray-100 transition-colors"
            >
              Go to CMS
              <ArrowRight className="w-5 h-5" />
            </Link>
          </ScrollRevealContainer>
        </div>
      </section>

      {/* =================================================================
          TECHNICAL INFO
          ================================================================= */}
      <section className="px-6 py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <ScrollRevealContainer animation="fade">
            <h3 className="text-2xl font-bold mb-6">How It Works</h3>

            <div className="bg-white rounded-xl p-6 font-mono text-sm overflow-x-auto">
              <pre className="text-gray-800">{`<!-- CMS outputs HTML with data attributes -->
<div class="scroll-reveal"
     data-animation="slide-up"
     data-duration="0.8"
     data-delay="0"
     data-easing="power3"
     data-trigger="75%"
     data-once="true">
  <img src="/media/products/photo.jpg" alt="Product">
</div>

<!-- JS engine auto-detects and animates -->
<script>
  import { initScrollAnimations } from './scroll-animation-engine'
  initScrollAnimations()
</script>`}</pre>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6">
                <h4 className="font-semibold mb-3">CSS Classes</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><code className="bg-gray-100 px-2 py-0.5 rounded">.scroll-reveal</code> - Fade/slide/zoom on scroll</li>
                  <li><code className="bg-gray-100 px-2 py-0.5 rounded">.scroll-pin</code> - Pin section during scroll</li>
                  <li><code className="bg-gray-100 px-2 py-0.5 rounded">.scroll-parallax</code> - Parallax background</li>
                  <li><code className="bg-gray-100 px-2 py-0.5 rounded">.scroll-horizontal</code> - Horizontal scroll</li>
                  <li><code className="bg-gray-100 px-2 py-0.5 rounded">.scroll-timeline</code> - Animated timeline</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h4 className="font-semibold mb-3">Data Attributes</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><code className="bg-gray-100 px-2 py-0.5 rounded">data-animation</code> - Animation type</li>
                  <li><code className="bg-gray-100 px-2 py-0.5 rounded">data-duration</code> - Animation duration</li>
                  <li><code className="bg-gray-100 px-2 py-0.5 rounded">data-delay</code> - Start delay</li>
                  <li><code className="bg-gray-100 px-2 py-0.5 rounded">data-easing</code> - Easing function</li>
                  <li><code className="bg-gray-100 px-2 py-0.5 rounded">data-trigger</code> - Viewport trigger point</li>
                </ul>
              </div>
            </div>
          </ScrollRevealContainer>
        </div>
      </section>
    </main>
  )
}
