// components/PersonaList.js
import React from 'react';

const PersonaList = ({ personas, onEditPersona }) => {
  return (
    <div>
      <h2>Personas</h2>
      <ul>
        {personas.length === 0 ? (
          <p>No personas found.</p>
        ) : (
          personas.map((persona) => (
            <li key={persona.id}>
              <h3>{persona.name}</h3>
              <div>
                <strong>Goals:</strong>
                <ul>
                  {persona.goals.map((goal, index) => (
                    <li key={`goal-${index}`}>{goal}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Pain Points:</strong>
                <ul>
                  {persona.painPoints.map((painPoint, index) => (
                    <li key={`painPoint-${index}`}>{painPoint}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Needs:</strong>
                <ul>
                  {persona.needs.map((need, index) => (
                    <li key={`need-${index}`}>{need}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Example Tools:</strong>
                <ul>
                  {persona.exampleTools.map((tool, index) => (
                    <li key={`tool-${index}`}>{tool}</li>
                  ))}
                </ul>
              </div>
              <button onClick={() => onEditPersona(persona)}>Edit</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default PersonaList;
