// components/PersonaForm.js
import React, { useState, useEffect } from 'react';

const PersonaForm = ({ onAddPersona, personaToEdit, onEditPersona }) => {
  const [name, setName] = useState('');
  const [goals, setGoals] = useState(['']);
  const [painPoints, setPainPoints] = useState(['']);
  const [contextOfUse, setContextOfUse] = useState('');
  const [needs, setNeeds] = useState(['']);
  const [exampleTools, setExampleTools] = useState(['']); // Default to one input field

  useEffect(() => {
    if (personaToEdit) {
      setName(personaToEdit.name);
      setGoals(personaToEdit.goals);
      setPainPoints(personaToEdit.painPoints);
      setContextOfUse(personaToEdit.contextOfUse);
      setNeeds(personaToEdit.needs);
      setExampleTools(
        personaToEdit.exampleTools.length ? personaToEdit.exampleTools : ['']
      ); // Ensure there's at least one field
    }
  }, [personaToEdit]);

  const handleInputChange = (e, index, fieldName) => {
    const value = e.target.value;
    const setField = {
      goals: setGoals,
      painPoints: setPainPoints,
      needs: setNeeds,
      exampleTools: setExampleTools,
    }[fieldName];

    setField((prev) => {
      const updatedValues = [...prev];
      updatedValues[index] = value;
      return updatedValues;
    });
  };

  const handleAddField = (fieldName) => {
    const setField = {
      goals: setGoals,
      painPoints: setPainPoints,
      needs: setNeeds,
      exampleTools: setExampleTools,
    }[fieldName];

    setField((prev) => [...prev, '']);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newPersona = {
      id: personaToEdit ? personaToEdit.id : Date.now(), // Use existing ID if editing
      name,
      goals,
      painPoints,
      contextOfUse,
      needs,
      exampleTools,
    };

    if (personaToEdit) {
      onEditPersona(newPersona); // Edit persona
    } else {
      onAddPersona(newPersona); // Add new persona
    }

    // Reset the form fields
    setName('');
    setGoals(['']);
    setPainPoints(['']);
    setContextOfUse('');
    setNeeds(['']);
    setExampleTools(['']);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{personaToEdit ? 'Edit Persona' : 'Add a New Persona'}</h3>

      <label>Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      {/* Goals */}
      <label>Goals:</label>
      {goals.map((goal, index) => (
        <div key={`goal-${index}`}>
          <input
            type="text"
            value={goal}
            onChange={(e) => handleInputChange(e, index, 'goals')}
            placeholder="Enter a goal"
            required
          />
          {index === goals.length - 1 && (
            <button type="button" onClick={() => handleAddField('goals')}>
              Add Goal
            </button>
          )}
        </div>
      ))}

      {/* Pain Points */}
      <label>Pain Points:</label>
      {painPoints.map((painPoint, index) => (
        <div key={`painPoint-${index}`}>
          <input
            type="text"
            value={painPoint}
            onChange={(e) => handleInputChange(e, index, 'painPoints')}
            placeholder="Enter a pain point"
            required
          />
          {index === painPoints.length - 1 && (
            <button type="button" onClick={() => handleAddField('painPoints')}>
              Add Pain Point
            </button>
          )}
        </div>
      ))}

      {/* Needs */}
      <label>Needs:</label>
      {needs.map((need, index) => (
        <div key={`need-${index}`}>
          <input
            type="text"
            value={need}
            onChange={(e) => handleInputChange(e, index, 'needs')}
            placeholder="Enter a need"
            required
          />
          {index === needs.length - 1 && (
            <button type="button" onClick={() => handleAddField('needs')}>
              Add Need
            </button>
          )}
        </div>
      ))}

      {/* Example Tools */}
      <label>Example Tools:</label>
      {exampleTools.map((tool, index) => (
        <div key={`tool-${index}`}>
          <input
            type="text"
            value={tool}
            onChange={(e) => handleInputChange(e, index, 'exampleTools')}
            placeholder="Enter an example tool"
            required
          />
          {index === exampleTools.length - 1 && (
            <button
              type="button"
              onClick={() => handleAddField('exampleTools')}
            >
              Add Tool
            </button>
          )}
        </div>
      ))}

      <button type="submit">
        {personaToEdit ? 'Save Changes' : 'Add Persona'}
      </button>
    </form>
  );
};

export default PersonaForm;
