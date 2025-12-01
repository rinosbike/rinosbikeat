'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

export interface SpecificationGroup {
  title: string;
  icon?: React.ReactNode;
  specs: {
    label: string;
    value: string | React.ReactNode;
    tooltip?: string;
  }[];
}

// Example Sandman 4.0 Specifications (German content)
const defaultSpecifications: SpecificationGroup[] = [
  {
    title: 'Rahmen & Gabel',
    specs: [
      { label: 'Rahmen', value: 'Carbon Gravel, integrierte Kabelführung' },
      { label: 'Gabel', value: 'Carbon, 12x100mm Steckachse' },
      { label: 'Größen verfügbar', value: 'XS, S, M, L, XL' },
      { label: 'Farben', value: 'Black/Green, Black/Yellow, Blue, Gold' },
      { label: 'Reifenfreiheit', value: 'Bis 45mm (700c) / 50mm (650b)' },
      { label: 'Befestigungspunkte', value: '3-fach (Rahmen), 3-fach (Gabel)' }
    ]
  },
  {
    title: 'Antrieb',
    specs: [
      { label: 'Schaltgruppe', value: 'Shimano GRX 400' },
      { label: 'Schalthebel', value: 'Shimano GRX ST-RX400' },
      { label: 'Schaltwerk', value: 'Shimano GRX RD-RX400, 10-fach' },
      { label: 'Umwerfer', value: 'Shimano GRX FD-RX400' },
      { label: 'Kurbel', value: 'Shimano GRX FC-RX600, 46/30T' },
      { label: 'Kassette', value: 'Shimano CS-HG500, 11-34T' },
      { label: 'Kette', value: 'Shimano CN-HG54, 10-fach' },
      { label: 'Übersetzung', value: '2x10 (20 Gänge)' }
    ]
  },
  {
    title: 'Bremsen',
    specs: [
      { label: 'Typ', value: 'Hydraulische Scheibenbremse' },
      { label: 'Bremsen', value: 'Shimano GRX BR-RX400' },
      { label: 'Bremsscheiben vorne', value: '160mm, Center Lock' },
      { label: 'Bremsscheiben hinten', value: '160mm, Center Lock' }
    ]
  },
  {
    title: 'Laufräder & Reifen',
    specs: [
      { label: 'Laufräder', value: 'Aluminium, Tubeless-Ready' },
      { label: 'Vorderradnabe', value: '12x100mm Steckachse' },
      { label: 'Hinterradnabe', value: '12x142mm Steckachse' },
      { label: 'Felgen', value: '700c, 25mm Innenbreite' },
      { label: 'Reifen', value: 'Continental Terra Trail, 40mm' },
      { label: 'Tubeless', value: 'Ja, Tubeless-Ready' }
    ]
  },
  {
    title: 'Cockpit & Sattel',
    specs: [
      { label: 'Lenker', value: 'Aluminium Gravel, 420-460mm (größenabhängig)' },
      { label: 'Lenkerband', value: 'Synthetik, schwarz' },
      { label: 'Vorbau', value: 'Aluminium, 80-110mm (größenabhängig)' },
      { label: 'Sattel', value: 'RINOS Comfort Gravel' },
      { label: 'Sattelstütze', value: 'Carbon, 27.2mm, 350mm' },
      { label: 'Sattelklemme', value: 'Aluminium, 31.8mm' }
    ]
  },
  {
    title: 'Weitere Spezifikationen',
    specs: [
      { label: 'Gewicht (ca.)', value: '9,2 kg (Größe M, ohne Pedale)' },
      { label: 'Max. Systemgewicht', value: '120 kg (Fahrer + Gepäck + Bike)' },
      { label: 'Pedale', value: 'Nicht im Lieferumfang enthalten' },
      { label: 'Schutzbleche', value: 'Optional, Befestigung vorhanden' },
      { label: 'Gepäckträger', value: 'Optional, Befestigung vorhanden' },
      { label: 'Montage', value: '95% vormontiert, Endmontage erforderlich' }
    ]
  }
];

interface SpecificationsTableProps {
  specifications?: SpecificationGroup[];
  title?: string;
  description?: string;
  defaultExpanded?: boolean;
  className?: string;
}

export default function SpecificationsTable({
  specifications = defaultSpecifications,
  title = 'Technische Spezifikationen',
  description = 'Detaillierte technische Daten und Komponenten',
  defaultExpanded = false,
  className = ''
}: SpecificationsTableProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(
    defaultExpanded ? new Set(specifications.map((_, i) => i)) : new Set([0])
  );

  const toggleGroup = (index: number) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleAllGroups = () => {
    if (expandedGroups.size === specifications.length) {
      setExpandedGroups(new Set([0])); // Collapse all except first
    } else {
      setExpandedGroups(new Set(specifications.map((_, i) => i))); // Expand all
    }
  };

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-gray-600">{description}</p>
          )}

          {/* Expand/Collapse All Button */}
          <button
            onClick={toggleAllGroups}
            className="mt-4 text-sm text-gray-600 hover:text-gray-900 underline"
          >
            {expandedGroups.size === specifications.length
              ? 'Alle einklappen'
              : 'Alle ausklappen'}
          </button>
        </div>

        {/* Specification Groups */}
        <div className="space-y-4">
          {specifications.map((group, groupIndex) => {
            const isExpanded = expandedGroups.has(groupIndex);

            return (
              <div
                key={groupIndex}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(groupIndex)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {group.icon && (
                      <div className="text-gray-700">{group.icon}</div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900">
                      {group.title}
                    </h3>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {/* Group Content */}
                {isExpanded && (
                  <div className="px-6 pb-4 border-t border-gray-200">
                    <div className="divide-y divide-gray-100">
                      {group.specs.map((spec, specIndex) => (
                        <div
                          key={specIndex}
                          className="py-3 flex justify-between items-start gap-4"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">
                              {spec.label}
                            </span>
                            {spec.tooltip && (
                              <div
                                className="group relative"
                                title={spec.tooltip}
                              >
                                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                                <div className="hidden group-hover:block absolute left-0 bottom-full mb-2 w-64 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10">
                                  {spec.tooltip}
                                </div>
                              </div>
                            )}
                          </div>
                          <span className="text-gray-900 text-right flex-1">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Hinweis:</strong> Technische Änderungen und Irrtümer vorbehalten.
            Das tatsächliche Gewicht kann je nach Rahmengröße und Ausstattung variieren.
            Pedale sind nicht im Lieferumfang enthalten.
          </p>
        </div>

        {/* Download/Print Button */}
        <div className="mt-6 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Spezifikationen als PDF herunterladen
          </button>
        </div>
      </div>
    </section>
  );
}
