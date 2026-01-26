// components/layouts/FullProfileLayout.js
// Detailed single-column layout - ideal for presentations and printouts
import React from 'react';
import Image from 'next/image';

const getPriorityBadge = (priority) => {
  const badges = {
    0: { label: 'Unset', color: 'bg-gray-200 text-gray-600' },
    1: { label: 'Low', color: 'bg-blue-100 text-blue-700' },
    2: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
    3: { label: 'High', color: 'bg-orange-100 text-orange-700' },
    4: { label: 'Critical', color: 'bg-red-100 text-red-700' },
  };
  return badges[priority] || badges[0];
};

const FullProfileLayout = ({ persona }) => {
  if (!persona) return null;

  const priorityBadge = getPriorityBadge(persona.priority);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-t-lg">
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 bg-white rounded-full shrink-0 overflow-hidden ring-4 ring-white/30">
            {persona.avatarImage ? (
              <Image
                src={persona.avatarImage}
                alt={`${persona.name}'s avatar`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                No image
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{persona.name}</h1>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityBadge.color}`}>
                {priorityBadge.label} Priority
              </span>
              {persona.tags && persona.tags.length > 0 && (
                <div className="flex gap-2">
                  {persona.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/20 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="p-8 space-y-8">
        {/* Goals Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600">&#127919;</span>
            </span>
            Goals
          </h2>
          <div className="bg-green-50 rounded-lg p-4">
            <ul className="space-y-3">
              {persona.goals?.map((goal, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-green-700 text-sm font-medium shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pain Points Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600">&#9888;</span>
            </span>
            Pain Points
          </h2>
          <div className="bg-red-50 rounded-lg p-4">
            <ul className="space-y-3">
              {persona.painPoints?.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center text-red-700 text-sm font-medium shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Tasks Section */}
        {persona.tasks && persona.tasks.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">&#128221;</span>
              </span>
              Tasks (How they work)
            </h2>
            <div className="bg-blue-50 rounded-lg p-4">
              <ul className="space-y-2">
                {persona.tasks.map((task, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">&#8226;</span>
                    <span className="text-gray-700">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Functionality Section */}
        {persona.functionality && persona.functionality.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">&#9881;</span>
              </span>
              Required Functionality
            </h2>
            <div className="bg-purple-50 rounded-lg p-4">
              <ul className="space-y-2">
                {persona.functionality.map((func, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">&#10003;</span>
                    <span className="text-gray-700">{func}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Context of Use Section */}
        {persona.contextOfUse && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-amber-600">&#127968;</span>
              </span>
              Context of Use
            </h2>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{persona.contextOfUse}</p>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="px-8 py-4 bg-gray-50 rounded-b-lg text-center text-sm text-gray-500">
        Generated with Persona CMS
      </div>
    </div>
  );
};

export default FullProfileLayout;
