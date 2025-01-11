// components/PersonaForm.js
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const PrioritySelect = ({ value, onChange, label }) => (
  <div className="flex items-center gap-2">
    <label className="text-sm font-medium">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="border rounded p-1"
    >
      <option value="0">Needs prioritization</option>
      <option value="1">Low</option>
      <option value="2">Medium</option>
      <option value="3">High</option>
      <option value="4">Critical</option>
    </select>
  </div>
);

const PersonaForm = ({ onAddPersona, personaToEdit, onEditPersona }) => {
  const [name, setName] = useState('');
  const [goals, setGoals] = useState(['']);
  const [painPoints, setPainPoints] = useState(['']);
  const [contextOfUse, setContextOfUse] = useState('');
  const [tasks, setTasks] = useState(['']);
  const [functionality, setFunctionality] = useState(['']);
  const [tags, setTags] = useState([]);
  const [avatarImage, setAvatarImage] = useState(
    personaToEdit?.avatarImage || null
  );
  const fileInputRef = useRef(null);
  const [tagInput, setTagInput] = useState('');
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const isHandlingSuggestion = useRef(false);
  const [personaPriority, setPersonaPriority] = useState(0);

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
      setAvatarImage(personaToEdit.avatarImage || null);
      setPersonaPriority(personaToEdit.priority || 0);
    }

    // Cleanup function
    return () => {
      setName('');
      setGoals(['']);
      setPainPoints(['']);
      setTasks(['']);
      setFunctionality(['']);
      setContextOfUse('');
      setTags([]);
      setAvatarImage(null);
      setPersonaPriority(0);
    };
  }, [personaToEdit]);

  const getAllExistingTags = () => {
    const personas = JSON.parse(sessionStorage.getItem('personas') || '[]');
    return Array.from(new Set(personas.flatMap((p) => p.tags || [])));
  };

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);

    if (value.trim()) {
      const existingTags = getAllExistingTags();
      const filtered = existingTags.filter(
        (tag) =>
          tag.toLowerCase().includes(value.toLowerCase()) && !tags.includes(tag)
      );
      setSuggestedTags(filtered);
      setShowSuggestions(true);
      setSelectedSuggestionIndex(-1);
    } else {
      setSuggestedTags([]);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleTagInputKeyDown = (e) => {
    if (showSuggestions && suggestedTags.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < suggestedTags.length - 1 ? prev + 1 : prev
        );
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
        return;
      }
      if (
        (e.key === 'Tab' || e.key === 'Enter') &&
        selectedSuggestionIndex >= 0
      ) {
        e.preventDefault();
        isHandlingSuggestion.current = true;
        handleSuggestionClick(suggestedTags[selectedSuggestionIndex]);
        isHandlingSuggestion.current = false;
        return;
      }
    }

    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();

      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
        setSuggestedTags([]);
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags(tags.slice(0, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleSuggestionClick = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
      setSuggestedTags([]);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const personaData = {
      name,
      goals,
      painPoints,
      tags,
      avatarImage,
      priority: personaPriority,
      // ... other fields
    };

    if (personaToEdit) {
      onEditPersona({ ...personaToEdit, ...personaData });
    } else {
      onAddPersona(personaData);
    }
    // ... rest of the submit handler
  };

  const handleCancel = (event) => {
    if (event) {
      event.preventDefault();
    }
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
        <label htmlFor="name" className="block text-sm font-medium">
          Name:
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
          data-testid="name-input"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Avatar Image:</label>
        <div className="flex items-center gap-4">
          <div className="relative w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
            {avatarImage ? (
              <Image
                src={avatarImage}
                alt="Avatar preview"
                fill="true"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
              data-testid="image-input"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Upload Image
            </button>
            {avatarImage && (
              <button
                type="button"
                onClick={() => setAvatarImage(null)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove Image
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Tags:</label>
        <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-indigo-500">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleDeleteTag(tag)}
                className="hover:text-red-200"
                aria-label={`Remove tag ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
          <div className="relative flex-1 min-w-[120px]">
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
              onBlur={() => {
                if (!isHandlingSuggestion.current) {
                  setTimeout(() => setShowSuggestions(false), 200);
                }
              }}
              onFocus={() => {
                if (tagInput.trim()) {
                  setShowSuggestions(true);
                }
              }}
              placeholder={
                tags.length === 0 ? 'Type and press Enter to add tags' : ''
              }
              className="w-full focus:outline-none"
            />
            {showSuggestions && suggestedTags.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                {suggestedTags.map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(tag)}
                    onMouseEnter={() => setSelectedSuggestionIndex(index)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                      selectedSuggestionIndex === index ? 'bg-gray-100' : ''
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <small className="text-gray-500">
          Press Enter or comma to add a tag, Backspace to remove the last tag
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

      <div className="space-y-4">
        <PrioritySelect
          label="Persona Priority"
          value={personaPriority}
          onChange={setPersonaPriority}
        />
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
