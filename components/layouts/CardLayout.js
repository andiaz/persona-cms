// components/layouts/CardLayout.js
// The original detailed layout - good for presentations and detailed view
import React from 'react';
import Image from 'next/image';

const CardLayout = ({ persona }) => {
  if (!persona) return null;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 bg-white">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Left Column - Avatar & Name */}
        <div className="flex md:flex-col items-center gap-4 md:w-64">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gray-200 rounded-full shrink-0 overflow-hidden">
            {persona.avatarImage ? (
              <Image
                src={persona.avatarImage}
                alt={`${persona.name}'s avatar`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
          <div className="flex-1 md:flex-none w-full md:w-48 h-12 bg-blue-600 flex items-center justify-center">
            <span className="text-white font-medium text-sm sm:text-base">
              {persona.name}
            </span>
          </div>
        </div>

        {/* Right Column - Goals */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold">{persona.name}</h2>
          </div>
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg min-h-[150px] md:min-h-[200px]">
            <h3 className="font-semibold mb-2 text-gray-700">Goals</h3>
            <div className="space-y-2">
              {persona.goals?.map((goal, index) => (
                <div key={index} className="flex items-center gap-2">
                  {goal}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Tasks */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 md:mb-4">
            Tasks (How)
          </h2>
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg min-h-[150px] md:min-h-[200px]">
            <ul className="list-disc pl-4 space-y-2 text-sm sm:text-base">
              {persona.tasks?.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Functionality */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 md:mb-4">
            Functionality (What)
          </h2>
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg min-h-[150px] md:min-h-[200px]">
            <ul className="list-disc pl-4 space-y-2 text-sm sm:text-base">
              {persona.functionality?.map((func, index) => (
                <li key={index}>{func}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Context of Use */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 md:mb-4">
            Context of Use
          </h2>
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg min-h-[150px] md:min-h-[200px]">
            <p className="text-sm sm:text-base">{persona.contextOfUse}</p>
          </div>
        </div>

        {/* Pain Points */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 md:mb-4">
            Pain Points
          </h2>
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg min-h-[150px] md:min-h-[200px]">
            <div className="space-y-2">
              {persona.painPoints?.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-red-500">&#8226;</span>
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {persona.tags && persona.tags.length > 0 && (
        <div className="mt-6 md:mt-8">
          <div className="flex flex-wrap gap-2">
            {persona.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardLayout;
