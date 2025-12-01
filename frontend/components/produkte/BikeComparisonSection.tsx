'use client';

import React from 'react';
import ComparisonTable, {
  ComparisonColumn,
  ComparisonRow
} from '../common/ComparisonTable';

// RINOS Sandman Gravel Bike Models Data (German content)
const bikeModels: ComparisonColumn[] = [
  {
    id: 'sandman10',
    name: 'Sandman 1.0',
    highlighted: false
  },
  {
    id: 'sandman30',
    name: 'Sandman 3.0',
    highlighted: false
  },
  {
    id: 'sandman40',
    name: 'Sandman 4.0',
    highlighted: true // Bestseller
  },
  {
    id: 'sandman60',
    name: 'Sandman 6.0',
    highlighted: false
  },
  {
    id: 'sandman70',
    name: 'Sandman 7.0',
    highlighted: false
  },
  {
    id: 'sandman8',
    name: 'Sandman 8',
    highlighted: false
  }
];

const comparisonRows: ComparisonRow[] = [
  {
    label: 'Preis',
    values: ['1.899 €', '2.099 €', '2.299 €', '2.699 €', '2.999 €', '3.499 €'],
    highlighted: true
  },
  {
    label: 'Gewicht (ca.)',
    values: ['9,8 kg', '9,8 kg', '9,8 kg', '9,8 kg', '9,6 kg', '9,4 kg']
  },
  {
    label: 'Rahmen',
    values: [
      'TORAY T800 Carbon',
      'TORAY T800 Carbon',
      'TORAY T800 Carbon',
      'TORAY T800 Carbon',
      'TORAY T800 Carbon',
      'Toray T800 Carbon'
    ]
  },
  {
    label: 'Schaltgruppe',
    values: [
      'Shimano SORA',
      'Shimano 105',
      'Shimano GRX 400',
      'Shimano GRX 600',
      'Shimano GRX 820',
      'Shimano 105 Di2'
    ],
    highlighted: true
  },
  {
    label: 'Gänge',
    values: ['18', '22', '20', '22', '24', '24']
  },
  {
    label: 'Bremsen',
    values: [
      'Mechanisch',
      'Mechanisch',
      'Hydraulisch',
      'Hydraulisch',
      'Hydraulisch',
      'Hydraulische Disc Bremsen'
    ],
    highlighted: true
  },
  {
    label: 'Laufräder',
    values: [
      'Aluminium',
      'Aluminium',
      'Aluminium',
      'Carbon',
      'Carbon',
      'Aluminium'
    ]
  },
  {
    label: 'Reifenbreite',
    values: ['50mm', '50mm', '50mm', '50mm', '50mm', '700c']
  },
  {
    label: 'Einsatzbereich',
    values: [
      'Einsteiger Gravel',
      'Gravel & Touren',
      'Gravel & Touren',
      'Performance Gravel',
      'Performance Gravel',
      'Premium Racing'
    ],
    highlighted: true
  },
  {
    label: 'Bikepacking',
    values: [true, true, true, true, true, true]
  },
  {
    label: 'Schutzblech-kompatibel',
    values: [true, true, true, true, true, true]
  },
  {
    label: 'Di2 Elektronisch',
    values: [false, false, false, false, false, true]
  }
];


interface BikeComparisonSectionProps {
  comparisonType?: 'sandman';
  className?: string;
}

export default function BikeComparisonSection({
  comparisonType = 'sandman',
  className = ''
}: BikeComparisonSectionProps) {
  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <ComparisonTable
          title="Sandman Modellvergleich"
          description="Finde das perfekte Sandman Gravel Bike für deine Bedürfnisse. Alle Modelle mit hochwertigem Carbon-Rahmen TORAY T800 und Shimano Komponenten."
          columns={bikeModels}
          rows={comparisonRows}
        />

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              Handgefertigte Laufräder
            </h3>
            <p className="text-gray-600">
              Jedes Laufrad wird von Hand gefertigt und individuell für dein Bike zusammengebaut - Made by Trudi in Frankfurt Oder.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              30 Tage Rückgaberecht
            </h3>
            <p className="text-gray-600">
              Teste dein RINOS Bike 30 Tage lang. Nicht zufrieden? Einfach zurücksenden.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              2 Jahre Garantie
            </h3>
            <p className="text-gray-600">
              Wir garantieren für die Qualität unserer Bikes mit 2 Jahren Herstellergarantie.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
