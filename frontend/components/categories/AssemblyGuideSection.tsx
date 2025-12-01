'use client';

import React, { useState } from 'react';
import { Play, Check, Wrench, Clock } from 'lucide-react';

interface AssemblyBenefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface AssemblyGuideSectionProps {
  title?: string;
  description?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  benefits?: AssemblyBenefit[];
  className?: string;
}

const defaultBenefits: AssemblyBenefit[] = [
  {
    icon: <Check className="w-6 h-6" />,
    title: 'Einfach zu befolgen',
    description: 'Schritt-für-Schritt Anleitung mit klaren Bildern und Videos'
  },
  {
    icon: <Wrench className="w-6 h-6" />,
    title: 'Grundwerkzeug',
    description: 'Nur Standard-Werkzeuge erforderlich - keine Spezialausrüstung nötig'
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Schneller Aufbau',
    description: '30-45 Minuten bis dein Bike fahrbereit ist'
  }
];

export default function AssemblyGuideSection({
  title = 'Baue dein RINOS Bike zusammen',
  description = 'Dein Bike kommt 95% vormontiert an. Mit unserer detaillierten Anleitung ist der Rest in kürzester Zeit erledigt.',
  videoUrl = 'https://www.youtube.com/embed/olcCPsOTT6w',
  videoThumbnail = '/images/assembly-thumbnail.jpg',
  benefits = defaultBenefits,
  className = ''
}: AssemblyGuideSectionProps) {
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

        {/* Video Section */}
        <div className="mb-12">
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg">
            {!showVideo ? (
              <>
                {/* Video Thumbnail with Play Button */}
                <div
                  className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center cursor-pointer group"
                  onClick={() => setShowVideo(true)}
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                    <Play className="w-10 h-10 text-gray-900 ml-1" fill="currentColor" />
                  </div>
                </div>
                {/* Placeholder for thumbnail - you can replace with actual image */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="text-center text-white">
                    <Wrench className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-semibold">Montageanleitung Video</p>
                  </div>
                </div>
              </>
            ) : (
              /* YouTube iframe - replace with actual video URL */
              <iframe
                className="w-full h-full"
                src={videoUrl}
                title="Assembly Guide Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 hover:border-yellow-400 transition-colors"
            >
              <div className="inline-flex p-3 bg-yellow-400 rounded-lg mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-gray-900" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-gray-900 mb-1">
                Professionelle Unterstützung verfügbar
              </h4>
              <p className="text-gray-700">
                Brauchst du Hilfe? Unser Support-Team steht dir jederzeit zur Verfügung. Optional bieten wir auch einen professionellen Montageservice an.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
