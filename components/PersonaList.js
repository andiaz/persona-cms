// components/PersonaList.js
import React from 'react';

const PersonaList = ({ personas, onEditPersona, onDeletePersona }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Personas</h2>
      <ul className="space-y-4">
        {personas.length === 0 ? (
          <p>No personas found.</p>
        ) : (
          personas.map((persona) => (
            <li
              key={persona.id}
              className="p-4 border rounded-lg shadow-md hover:shadow-lg transition duration-200"
            >
              <h3 className="text-xl font-semibold">{persona.name}</h3>
              <div>
                <strong className="block mt-2">Goals:</strong>
                <ul className="list-disc pl-5">
                  {persona.goals.map((goal, index) => (
                    <li key={`goal-${index}`}>{goal}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="block mt-2">Pain Points:</strong>
                <ul className="list-disc pl-5">
                  {persona.painPoints.map((painPoint, index) => (
                    <li key={`painPoint-${index}`}>{painPoint}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="block mt-2">Needs:</strong>
                <ul className="list-disc pl-5">
                  {persona.needs.map((need, index) => (
                    <li key={`need-${index}`}>{need}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="block mt-2">Example Tools:</strong>
                <ul className="list-disc pl-5">
                  {persona.exampleTools.map((tool, index) => (
                    <li key={`tool-${index}`}>{tool}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => onEditPersona(persona)}
                  className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeletePersona(persona.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default PersonaList;
