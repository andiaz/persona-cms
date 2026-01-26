// components/layouts/PrintLayout.js
// Clean layout optimized for printing - minimal colors, clear structure
import React from 'react';
import Image from 'next/image';

const PrintLayout = ({ persona }) => {
  if (!persona) return null;

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white font-serif">
      {/* Header */}
      <div className="flex items-start gap-6 mb-8 pb-6 border-b-2 border-gray-800">
        <div className="relative w-20 h-20 bg-gray-100 rounded shrink-0 overflow-hidden border border-gray-300">
          {persona.avatarImage ? (
            <Image
              src={persona.avatarImage}
              alt={`${persona.name}'s avatar`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              [Photo]
            </div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{persona.name}</h1>
          {persona.tags && persona.tags.length > 0 && (
            <p className="text-gray-600 text-sm">
              <strong>Tags:</strong> {persona.tags.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Goals */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b pb-1">
              Goals
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {persona.goals?.map((goal, index) => (
                <li key={index} className="leading-relaxed">{goal}</li>
              ))}
            </ol>
          </section>

          {/* Tasks */}
          {persona.tasks && persona.tasks.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b pb-1">
                Tasks
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {persona.tasks.map((task, index) => (
                  <li key={index} className="leading-relaxed">{task}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pain Points */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b pb-1">
              Pain Points
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {persona.painPoints?.map((point, index) => (
                <li key={index} className="leading-relaxed">{point}</li>
              ))}
            </ol>
          </section>

          {/* Functionality */}
          {persona.functionality && persona.functionality.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b pb-1">
                Required Functionality
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {persona.functionality.map((func, index) => (
                  <li key={index} className="leading-relaxed">{func}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {/* Context of Use - Full Width */}
      {persona.contextOfUse && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b pb-1">
            Context of Use
          </h2>
          <p className="text-gray-700 leading-relaxed">{persona.contextOfUse}</p>
        </section>
      )}

      {/* Footer for print */}
      <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
        Persona Profile &bull; {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default PrintLayout;
