// components/PersonaForm.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const PersonaForm = ({ onAddPersona, personaToEdit, onEditPersona }) => {
  const [name, setName] = useState('');
  const [goals, setGoals] = useState(['']);
  const [painPoints, setPainPoints] = useState(['']);
  const [contextOfUse, setContextOfUse] = useState('');
  const [tasks, setTasks] = useState(['']);
  const [functionality, setFunctionality] = useState(['']);
  const [tags, setTags] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (personaToEdit) {
      setName(personaToEdit.name);
      setGoals(personaToEdit.goals);
      setPainPoints(personaToEdit.painPoints);
      setTasks(personaToEdit.tasks || ['']);
      setFunctionality(personaToEdit.functionality || ['']);
      setContextOfUse(personaToEdit.contextOfUse || '');
      setTags(personaToEdit.tags || []);
    }
  }, [personaToEdit]);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = e.target.value.trim();

      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }

      e.target.value = '';
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleInputChange = (e, index, fieldName) => {
    const value = e.target.value;
    const setField = {
      goals: setGoals,
      painPoints: setPainPoints,
      tasks: setTasks,
      functionality: setFunctionality,
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
      tasks: setTasks,
      functionality: setFunctionality,
    }[fieldName];

    setField((prev) => [...prev, '']);
  };

  const handleDeleteField = (index, fieldName) => {
    const setField = {
      goals: setGoals,
      painPoints: setPainPoints,
      tasks: setTasks,
      functionality: setFunctionality,
    }[fieldName];

    setField((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newPersona = {
      id: personaToEdit ? personaToEdit.id : Date.now(),
      name,
      goals,
      painPoints,
      tasks,
      functionality,
      contextOfUse,
      tags,
    };

    if (personaToEdit) {
      onEditPersona(newPersona);
    } else {
      onAddPersona(newPersona);
    }

    if (!personaToEdit) {
      setName('');
      setGoals(['']);
      setPainPoints(['']);
      setContextOfUse('');
      setTasks(['']);
      setFunctionality(['']);
      setTags([]);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    router.push('/');
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

      <div className="space-y-2">
        <label className="block text-sm font-medium">Tags:</label>
        <div className="flex flex-wrap items-center gap-2 border px-2 py-2 rounded-md">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="bg-indigo-500 text-white px-3 py-1 rounded-full flex items-center gap-2"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleDeleteTag(tag)}
                className="text-white hover:text-red-400"
              >
                &times;
              </button>
            </div>
          ))}
          <input
            type="text"
            onKeyDown={handleAddTag}
            placeholder="Press Enter to add a tag"
            className="flex-grow focus:outline-none"
          />
        </div>
        <small className="text-gray-500">
          Type a tag and press Enter or comma to add.
        </small>
      </div>

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

      <div className="space-y-2">
        <label className="block text-sm font-medium">Tasks:</label>
        {tasks.map((task, index) => (
          <div key={`task-${index}`} className="space-y-2">
            <input
              type="text"
              value={task}
              onChange={(e) => handleInputChange(e, index, 'tasks')}
              placeholder="Enter a task"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
            {index === tasks.length - 1 && (
              <button
                type="button"
                onClick={() => handleAddField('tasks')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Task
              </button>
            )}
            {shouldShowDeleteButton(tasks) && (
              <button
                type="button"
                onClick={() => handleDeleteField(index, 'tasks')}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete Task
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Context of Use:</label>
        <textarea
          value={contextOfUse}
          onChange={(e) => setContextOfUse(e.target.value)}
          placeholder="Enter context of use"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Functionality:</label>
        {functionality.map((func, index) => (
          <div key={`functionality-${index}`} className="space-y-2">
            <input
              type="text"
              value={func}
              onChange={(e) => handleInputChange(e, index, 'functionality')}
              placeholder="Enter functionality"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
            {index === functionality.length - 1 && (
              <button
                type="button"
                onClick={() => handleAddField('functionality')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Functionality
              </button>
            )}
            {shouldShowDeleteButton(functionality) && (
              <button
                type="button"
                onClick={() => handleDeleteField(index, 'functionality')}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete Functionality
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="px-6 py-2 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          {personaToEdit ? 'Save Changes' : 'Add Persona'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2 mt-4 ml-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PersonaForm;
