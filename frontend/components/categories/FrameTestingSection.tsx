'use client';

import React, { useState } from 'react';
import { Play, Shield, Award, CheckCircle, TrendingUp } from 'lucide-react';

interface TestStat {
  icon: React.ReactNode;
  value: string;
  label: string;
  description?: string;
}

interface FrameTestingSectionProps {
  title?: string;
  description?: string;
  videoUrl?: string;
  stats?: TestStat[];
  className?: string;
}

const defaultStats: TestStat[] = [
  {
    icon: <TrendingUp className="w-8 h-8" />,
    value: '10.000+',
    label: 'Zyklen getestet',
    description: 'Umfangreiche Belastungstests für maximale Haltbarkeit'
  },
  {
    icon: <Award className="w-8 h-8" />,
    value: 'ISO 4210',
    label: 'Zertifiziert',
    description: 'Entspricht höchsten internationalen Sicherheitsstandards'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    value: '5x',
    label: 'Sicherheitsfaktor',
    description: 'Fünffache Sicherheit gegenüber Mindestanforderungen'
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    value: '2 Jahre',
    label: 'Garantie',
    description: 'Vollständige Herstellergarantie auf Rahmen und Gabel'
  }
];

export default function FrameTestingSection({
  title = 'Entwickelt für Langlebigkeit',
  description = 'Jeder RINOS Rahmen durchläuft rigorose Tests, um höchste Qualität und Sicherheit zu gewährleisten. Unsere Carbon-Rahmen werden nach strengsten Standards geprüft.',
  videoUrl = 'https://www.youtube.com/embed/frame-testing-video',
  stats = defaultStats,
  className = ''
}: FrameTestingSectionProps) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Video Section */}
          <div>
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-xl">
              {!showVideo ? (
                <>
                  {/* Video Thumbnail with Play Button */}
                  <div
                    className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center cursor-pointer group"
                    onClick={() => setShowVideo(true)}
                  >
                    <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center group-hover:bg-yellow-500 transition-colors shadow-lg">
                      <Play className="w-10 h-10 text-gray-900 ml-1" fill="currentColor" />
                    </div>
                  </div>
                  {/* Placeholder for thumbnail */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="text-center text-white">
                      <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-semibold">Rahmentest Video</p>
                    </div>
                  </div>
                </>
              ) : (
                /* YouTube iframe */}
                <iframe
                  className="w-full h-full"
                  src={videoUrl}
                  title="Frame Testing Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all"
              >
                <div className="inline-flex p-3 bg-yellow-400 rounded-lg mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-2">
                  {stat.label}
                </div>
                {stat.description && (
                  <p className="text-xs text-gray-600">
                    {stat.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Testing Process Details */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Materialprüfung
            </h3>
            <p className="text-gray-600">
              Jede Carbon-Charge wird auf Festigkeit und Qualität geprüft, bevor sie in der Produktion verwendet wird.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Belastungstests
            </h3>
            <p className="text-gray-600">
              Simulierte Fahrten unter extremen Bedingungen über 10.000+ Zyklen um Langlebigkeit zu garantieren.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Zertifizierung
            </h3>
            <p className="text-gray-600">
              Unabhängige Prüfung und Zertifizierung nach ISO 4210 Standards durch akkreditierte Testlabore.
            </p>
          </div>
        </div>

        {/* Bottom Info Banner */}
        <div className="mt-12 p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-3">
                Qualität, auf die du dich verlassen kannst
              </h3>
              <p className="text-gray-300 mb-4">
                Unsere Rahmen werden in Frankfurt (Oder), Deutschland entwickelt und getestet. Jeder Rahmen trägt das RINOS Qualitätssiegel und wird mit einer 2-jährigen Garantie ausgeliefert.
              </p>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">Made in Germany Engineering</span>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="bg-yellow-400 text-gray-900 px-8 py-6 rounded-lg text-center">
                <div className="text-4xl font-bold mb-1">2</div>
                <div className="text-sm font-semibold">JAHRE</div>
                <div className="text-xs mt-1">Garantie</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
