'use client';

import React, { useState } from 'react';
import { Ruler, User, AlertCircle } from 'lucide-react';

interface SizeRecommendation {
  size: string;
  heightMin: number;
  heightMax: number;
  inseamMin: number;
  inseamMax: number;
}

interface GeometryData {
  size: string;
  [key: string]: string | number;
}

interface SizingChartSectionProps {
  title?: string;
  description?: string;
  sizeRecommendations?: SizeRecommendation[];
  geometryData?: GeometryData[];
  bikeType?: 'gravel' | 'road' | 'mtb';
  className?: string;
}

const defaultSizeRecommendations: SizeRecommendation[] = [
  { size: 'XS', heightMin: 155, heightMax: 165, inseamMin: 72, inseamMax: 77 },
  { size: 'S', heightMin: 165, heightMax: 175, inseamMin: 77, inseamMax: 82 },
  { size: 'M', heightMin: 175, heightMax: 185, inseamMin: 82, inseamMax: 87 },
  { size: 'L', heightMin: 185, heightMax: 195, inseamMin: 87, inseamMax: 92 },
  { size: 'XL', heightMin: 195, heightMax: 205, inseamMin: 92, inseamMax: 97 }
];

const defaultGeometryData: GeometryData[] = [
  { size: 'XS', reach: '370', stack: '545', oberrohr: '520', sitzrohr: '470', radstand: '1005' },
  { size: 'S', reach: '380', stack: '560', oberrohr: '535', sitzrohr: '500', radstand: '1020' },
  { size: 'M', reach: '390', stack: '575', oberrohr: '550', sitzrohr: '530', radstand: '1035' },
  { size: 'L', reach: '400', stack: '590', oberrohr: '565', sitzrohr: '560', radstand: '1050' },
  { size: 'XL', reach: '410', stack: '605', oberrohr: '580', sitzrohr: '590', radstand: '1065' }
];

export default function SizingChartSection({
  title = 'Größentabelle',
  description = 'Finde die perfekte Rahmengröße für deine Körpergröße. Bei Fragen zur Größenwahl beraten wir dich gerne.',
  sizeRecommendations = defaultSizeRecommendations,
  geometryData = defaultGeometryData,
  bikeType = 'gravel',
  className = ''
}: SizingChartSectionProps) {
  const [userHeight, setUserHeight] = useState<number | ''>('');
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  const [showGeometry, setShowGeometry] = useState(false);

  const findRecommendedSize = (height: number) => {
    const recommendation = sizeRecommendations.find(
      (rec) => height >= rec.heightMin && height <= rec.heightMax
    );
    setRecommendedSize(recommendation?.size || null);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value);
    setUserHeight(height);
    if (height && !isNaN(height)) {
      findRecommendedSize(height);
    } else {
      setRecommendedSize(null);
    }
  };

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
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

        {/* Height Calculator */}
        <div className="mb-12 bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-900" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Größenempfehlung
              </h3>
              <p className="text-gray-600">
                Gib deine Körpergröße ein für eine persönliche Empfehlung
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                Körpergröße (cm)
              </label>
              <input
                type="number"
                id="height"
                value={userHeight}
                onChange={handleHeightChange}
                placeholder="z.B. 180"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                min="150"
                max="210"
              />
            </div>
            {recommendedSize && (
              <div className="flex-1 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium mb-1">Empfohlene Größe:</p>
                <p className="text-3xl font-bold text-green-900">{recommendedSize}</p>
              </div>
            )}
          </div>
        </div>

        {/* Size Recommendation Table */}
        <div className="mb-12 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Rahmengröße</th>
                  <th className="px-6 py-4 text-left font-semibold">Körpergröße (cm)</th>
                  <th className="px-6 py-4 text-left font-semibold">Schrittlänge (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sizeRecommendations.map((rec, index) => (
                  <tr
                    key={rec.size}
                    className={`hover:bg-yellow-50 transition-colors ${
                      recommendedSize === rec.size ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                    }`}
                  >
                    <td className="px-6 py-4 font-bold text-lg text-gray-900">
                      {rec.size}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {rec.heightMin} - {rec.heightMax} cm
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {rec.inseamMin} - {rec.inseamMax} cm
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Geometry Toggle */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowGeometry(!showGeometry)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Ruler className="w-5 h-5" />
            {showGeometry ? 'Geometrie ausblenden' : 'Geometrie-Daten anzeigen'}
          </button>
        </div>

        {/* Geometry Table */}
        {showGeometry && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Größe</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Reach (mm)</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Stack (mm)</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Oberrohr (mm)</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Sitzrohr (mm)</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Radstand (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {geometryData.map((geo, index) => (
                    <tr key={geo.size} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-gray-900">{geo.size}</td>
                      <td className="px-6 py-4 text-gray-700">{geo.reach}</td>
                      <td className="px-6 py-4 text-gray-700">{geo.stack}</td>
                      <td className="px-6 py-4 text-gray-700">{geo.oberrohr}</td>
                      <td className="px-6 py-4 text-gray-700">{geo.sitzrohr}</td>
                      <td className="px-6 py-4 text-gray-700">{geo.radstand}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Help Notice */}
        <div className="mt-12 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">
                Unsicher bei der Größenwahl?
              </h4>
              <p className="text-gray-700 mb-3">
                Wir helfen dir gerne bei der Auswahl der richtigen Rahmengröße. Kontaktiere uns per E-Mail oder Telefon für eine persönliche Beratung.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:support@rinosbike.at"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  E-Mail an Support
                </a>
                <p className="flex items-center text-gray-700">
                  <span className="font-medium">Tel:</span>&nbsp;+43 123 456 789
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
