'use client';

import React from 'react';
import {
  Bike,
  Shield,
  Settings,
  Mountain,
  Package,
  Award,
  Wrench,
  TrendingUp,
  Zap,
  MapPin,
  Factory,
  ThumbsUp
} from 'lucide-react';

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlighted?: boolean;
}

const defaultFeatures: Feature[] = [
  {
    icon: <Bike className="w-8 h-8" />,
    title: 'Carbon-Rahmen',
    description: 'Hochwertige Carbon-Konstruktion für maximale Steifigkeit bei minimalem Gewicht. Optimiert für Gravel und Allroad.',
    highlighted: true
  },
  {
    icon: <Settings className="w-8 h-8" />,
    title: 'Premium Komponenten',
    description: 'Shimano GRX Schaltgruppen und hydraulische Scheibenbremsen für perfekte Kontrolle in jedem Gelände.',
    highlighted: true
  },
  {
    icon: <Mountain className="w-8 h-8" />,
    title: 'Vielseitig Einsetzbar',
    description: 'Reifenfreiheit bis 50mm, mehrere Befestigungspunkte für Taschen und Schutzbleche. Perfekt für Bikepacking und Touren.',
    highlighted: true
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Race-Geometrie',
    description: 'Optimierte Rahmengeometrie für Komfort auf langen Strecken und Agilität auf technischen Trails.'
  },
  {
    icon: <Package className="w-8 h-8" />,
    title: 'Individuelle Anpassung',
    description: 'Jedes Bike wird individuell für dich zusammengebaut und auf deine Bedürfnisse angepasst - Custom Built.'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: '2 Jahre Garantie',
    description: 'Volle Herstellergarantie auf alle RINOS Bikes. Wir stehen für die Qualität unserer Produkte.'
  },
  {
    icon: <Wrench className="w-8 h-8" />,
    title: 'Montageservice',
    description: 'Optional verfügbar: Professionelle Montage und Einstellung durch zertifizierte Mechaniker.'
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: 'Direktvertrieb',
    description: 'Keine Zwischenhändler bedeutet bessere Preise bei gleicher Premium-Qualität.'
  }
];

interface FeaturesHighlightProps {
  features?: Feature[];
  title?: string;
  description?: string;
  columns?: 2 | 3 | 4;
  className?: string;
}

export default function FeaturesHighlight({
  features = defaultFeatures,
  title = 'Was macht RINOS Bikes besonders?',
  description = 'Hochwertige Carbon Gravel Bikes mit Premium-Komponenten zu fairen Preisen. Entwickelt für Abenteuer.',
  columns = 4,
  className = ''
}: FeaturesHighlightProps) {
  const gridColsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }[columns];

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

        {/* Features Grid */}
        <div className={`grid grid-cols-1 ${gridColsClass} gap-8`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-6 rounded-lg transition-all duration-300 ${
                feature.highlighted
                  ? 'bg-yellow-50 border-2 border-yellow-400 shadow-lg hover:shadow-xl'
                  : 'bg-gray-50 border-2 border-transparent hover:border-gray-300 hover:shadow-lg'
              }`}
            >
              <div
                className={`inline-flex p-3 rounded-lg mb-4 ${
                  feature.highlighted
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-200 text-gray-700 group-hover:bg-gray-300'
                }`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Trust Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
              <ThumbsUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="font-bold text-2xl text-gray-900">98%</div>
            <div className="text-sm text-gray-600">Zufriedene Kunden</div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <div className="font-bold text-2xl text-gray-900">24h</div>
            <div className="text-sm text-gray-600">Versandzeit</div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-3">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <div className="font-bold text-2xl text-gray-900">2 Jahre</div>
            <div className="text-sm text-gray-600">Garantie</div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-3">
              <Factory className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="font-bold text-lg text-gray-900">German</div>
            <div className="text-sm text-gray-600">Engineered & Built</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Export also a compact version for use in product pages
export function FeaturesCompact() {
  const compactFeatures: Feature[] = [
    {
      icon: <Bike className="w-6 h-6" />,
      title: 'Carbon-Rahmen',
      description: 'Leicht & Steif'
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'Premium Schaltung',
      description: 'Shimano GRX'
    },
    {
      icon: <Mountain className="w-6 h-6" />,
      title: 'Bis 50mm Reifen',
      description: 'Vielseitig einsetzbar'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '2 Jahre Garantie',
      description: 'Volle Herstellergarantie'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {compactFeatures.map((feature, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg"
        >
          <div className="p-2 bg-yellow-400 rounded-lg mb-2">
            {feature.icon}
          </div>
          <div className="font-semibold text-sm text-gray-900 mb-1">
            {feature.title}
          </div>
          <div className="text-xs text-gray-600">{feature.description}</div>
        </div>
      ))}
    </div>
  );
}
