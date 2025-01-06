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

  const handleDeleteField = (index, fieldName) => {
    const setField = {
      goals: setGoals,
      painPoints: setPainPoints,
      needs: setNeeds,
      exampleTools: setExampleTools,
    }[fieldName];

    setField((prev) => prev.filter((_, i) => i !== index));
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

  const shouldShowDeleteButton = (array) => array.length > 1;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white shadow-lg rounded-lg"
    >
      <h3 className="text-2xl font-semibold text-center">
        {personaToEdit ? 'Edit Persona' : 'Add a New Persona'}
      </h3>

      {/* Name Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Goals */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Goals:</label>
        {goals.map((goal, index) => (
          <div key={`goal-${index}`} className="space-y-2">
            <input
              type="text"
              value={goal}
              onChange={(e) => handleInputChange(e, index, 'goals')}
              placeholder="Enter a goal"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
            {index === goals.length - 1 && (
              <button
                type="button"
                onClick={() => handleAddField('goals')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Goal
              </button>
            )}
            {shouldShowDeleteButton(goals) && (
              <button
                type="button"
                onClick={() => handleDeleteField(index, 'goals')}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete Goal
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pain Points */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Pain Points:</label>
        {painPoints.map((painPoint, index) => (
          <div key={`painPoint-${index}`} className="space-y-2">
            <input
              type="text"
              value={painPoint}
              onChange={(e) => handleInputChange(e, index, 'painPoints')}
              placeholder="Enter a pain point"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
            {index === painPoints.length - 1 && (
              <button
                type="button"
                onClick={() => handleAddField('painPoints')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Pain Point
              </button>
            )}
            {shouldShowDeleteButton(painPoints) && (
              <button
                type="button"
                onClick={() => handleDeleteField(index, 'painPoints')}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete Pain Point
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Needs */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Needs:</label>
        {needs.map((need, index) => (
          <div key={`need-${index}`} className="space-y-2">
            <input
              type="text"
              value={need}
              onChange={(e) => handleInputChange(e, index, 'needs')}
              placeholder="Enter a need"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
            {index === needs.length - 1 && (
              <button
                type="button"
                onClick={() => handleAddField('needs')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Need
              </button>
            )}
            {shouldShowDeleteButton(needs) && (
              <button
                type="button"
                onClick={() => handleDeleteField(index, 'needs')}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete Need
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Example Tools */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Example Tools:</label>
        {exampleTools.map((tool, index) => (
          <div key={`tool-${index}`} className="space-y-2">
            <input
              type="text"
              value={tool}
              onChange={(e) => handleInputChange(e, index, 'exampleTools')}
              placeholder="Enter an example tool"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
            {index === exampleTools.length - 1 && (
              <button
                type="button"
                onClick={() => handleAddField('exampleTools')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Tool
              </button>
            )}
            {shouldShowDeleteButton(exampleTools) && (
              <button
                type="button"
                onClick={() => handleDeleteField(index, 'exampleTools')}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete Tool
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          type="submit"
          className="px-6 py-2 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          {personaToEdit ? 'Save Changes' : 'Add Persona'}
        </button>
      </div>
    </form>
  );
};

export default PersonaForm;
