'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

export interface ComparisonColumn {
  id: string;
  name: string;
  highlighted?: boolean;
}

export interface ComparisonRow {
  label: string;
  values: (string | number | boolean | React.ReactNode)[];
  highlighted?: boolean;
}

export interface ComparisonTableProps {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  title?: string;
  description?: string;
  className?: string;
}

export default function ComparisonTable({
  columns,
  rows,
  title,
  description,
  className = ''
}: ComparisonTableProps) {
  const renderCellValue = (value: string | number | boolean | React.ReactNode) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-6 h-6 text-green-600 mx-auto" />
      ) : (
        <X className="w-6 h-6 text-red-500 mx-auto" />
      );
    }

    if (React.isValidElement(value)) {
      return value;
    }

    return <span>{value}</span>;
  };

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          {description && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{description}</p>
          )}
        </div>
      )}

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">
                {/* Empty cell for row labels */}
              </th>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`p-4 text-center font-semibold border-b-2 border-gray-200 ${
                    column.highlighted
                      ? 'bg-yellow-50 text-gray-900'
                      : 'text-gray-700'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-lg">{column.name}</span>
                    {column.highlighted && (
                      <span className="text-xs mt-1 px-2 py-1 bg-yellow-400 text-black rounded-full font-medium">
                        Empfohlen
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${
                  rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-gray-100 transition-colors ${
                  row.highlighted ? 'border-l-4 border-yellow-400' : ''
                }`}
              >
                <td className="p-4 font-medium text-gray-900 border-b border-gray-200">
                  {row.label}
                </td>
                {row.values.map((value, colIndex) => {
                  const column = columns[colIndex];
                  return (
                    <td
                      key={colIndex}
                      className={`p-4 text-center border-b border-gray-200 ${
                        column.highlighted ? 'bg-yellow-50' : ''
                      }`}
                    >
                      {renderCellValue(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Stacked Cards */}
      <div className="md:hidden space-y-6">
        {columns.map((column, colIndex) => (
          <div
            key={column.id}
            className={`bg-white rounded-lg shadow-lg overflow-hidden ${
              column.highlighted ? 'ring-2 ring-yellow-400' : ''
            }`}
          >
            <div
              className={`p-4 ${
                column.highlighted ? 'bg-yellow-50' : 'bg-gray-50'
              }`}
            >
              <h3 className="text-xl font-bold text-gray-900">
                {column.name}
              </h3>
              {column.highlighted && (
                <span className="inline-block mt-2 text-xs px-2 py-1 bg-yellow-400 text-black rounded-full font-medium">
                  Empfohlen
                </span>
              )}
            </div>
            <div className="divide-y divide-gray-200">
              {rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`p-4 flex justify-between items-center ${
                    row.highlighted ? 'bg-yellow-50' : ''
                  }`}
                >
                  <span className="font-medium text-gray-700">{row.label}</span>
                  <span className="text-gray-900">
                    {renderCellValue(row.values[colIndex])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
