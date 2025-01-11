import React from 'react';

const PersonaLayout = ({ persona }) => {
  if (!persona) return null;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white">
      {/* Top Section */}
      <div className="flex gap-8 mb-8">
        {/* Left Column - Avatar & Name */}
        <div className="w-64 flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full mb-4">
            {/* Avatar placeholder */}
          </div>
          <div className="w-48 h-12 bg-blue-600 flex items-center justify-center">
            <span className="text-white font-medium">{persona.name}</span>
          </div>
        </div>

        {/* Right Column - Goals */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">Goals (Why)</h2>
          <div className="bg-gray-100 p-4 rounded-lg min-h-[200px]">
            <ul className="list-disc pl-4 space-y-2">
              {persona.goals.map((goal, index) => (
                <li key={index}>{goal}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Tasks */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Tasks (How)</h2>
          <div className="bg-gray-100 p-4 rounded-lg min-h-[200px]">
            <ul className="list-disc pl-4 space-y-2">
              {persona.tasks?.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Functionality */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Functionality that support user goals, tasks & context of use (What)
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg min-h-[200px]">
            <ul className="list-disc pl-4 space-y-2">
              {persona.functionality?.map((func, index) => (
                <li key={index}>{func}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-8">
        {/* Context of Use */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Context of use</h2>
          <div className="bg-gray-100 p-4 rounded-lg min-h-[200px]">
            <p>{persona.contextOfUse}</p>
          </div>
        </div>

        {/* Pain Points */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Pain points / bright spots
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg min-h-[200px]">
            <ul className="list-disc pl-4 space-y-2">
              {persona.painPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaLayout;
