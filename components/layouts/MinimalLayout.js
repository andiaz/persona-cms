// components/layouts/MinimalLayout.js
// Compact layout showing only essentials: avatar, name, goals, pain points
import React from 'react';
import Image from 'next/image';

const MinimalLayout = ({ persona }) => {
  if (!persona) return null;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Header with Avatar and Name */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b">
        <div className="relative w-16 h-16 bg-gray-200 rounded-full shrink-0 overflow-hidden">
          {persona.avatarImage ? (
            <Image
              src={persona.avatarImage}
              alt={`${persona.name}'s avatar`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No img
            </div>
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{persona.name}</h1>
          {persona.tags && persona.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {persona.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {persona.tags.length > 3 && (
                <span className="text-xs text-gray-400">+{persona.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Goals */}
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Goals
        </h2>
        <ul className="space-y-1">
          {persona.goals?.map((goal, index) => (
            <li key={index} className="text-gray-800 flex items-start gap-2">
              <span className="text-green-500 mt-1">&#10003;</span>
              <span>{goal}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pain Points */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Pain Points
        </h2>
        <ul className="space-y-1">
          {persona.painPoints?.map((point, index) => (
            <li key={index} className="text-gray-800 flex items-start gap-2">
              <span className="text-red-500 mt-1">&#10007;</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MinimalLayout;
