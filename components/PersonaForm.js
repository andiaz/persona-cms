// components/PersonaForm.js
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { createAvatar } from '@dicebear/core';
import {
  lorelei,
  notionists,
  adventurer,
  avataaars,
  bottts,
  funEmoji,
} from '@dicebear/collection';
import { getAllTags } from '../lib/storage';

const AVATAR_STYLES = [
  { id: 'lorelei', name: 'Illustrated', style: lorelei },
  { id: 'notionists', name: 'Notion', style: notionists },
  { id: 'adventurer', name: 'Adventure', style: adventurer },
  { id: 'avataaars', name: 'Cartoon', style: avataaars },
  { id: 'bottts', name: 'Robot', style: bottts },
  { id: 'funEmoji', name: 'Emoji', style: funEmoji },
];

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
  const [avatarStyle, setAvatarStyle] = useState('lorelei');

  const generateAvatar = (seedName, style) => {
    const selectedStyle = style
      ? AVATAR_STYLES.find((s) => s.id === style)
      : AVATAR_STYLES.find((s) => s.id === avatarStyle);
    if (!selectedStyle) return null;

    const seed = seedName || name.trim() || `persona-${Date.now()}`;
    const avatar = createAvatar(selectedStyle.style, {
      seed,
      size: 256,
    });

    // Use toDataUri() which handles encoding properly
    const dataUri = avatar.toDataUri();
    if (!seedName) {
      setAvatarImage(dataUri);
    }
    return dataUri;
  };

  const prefillSampleData = () => {
    const sampleNames = [
      'Alex Chen', 'Sarah Johnson', 'Marcus Williams', 'Emma Rodriguez',
      'David Kim', 'Olivia Thompson', 'James Martinez', 'Sophia Lee',
    ];
    const sampleGoals = [
      'Improve workflow efficiency', 'Reduce manual tasks', 'Better team collaboration',
      'Increase customer satisfaction', 'Streamline decision making', 'Enhance user experience',
    ];
    const samplePainPoints = [
      'Too many manual steps', 'Lack of automation', 'Communication gaps',
      'Unclear requirements', 'Inconsistent processes', 'Tool fragmentation',
    ];
    const sampleTasks = [
      'Daily team updates', 'Project planning', 'Code reviews',
      'Documentation writing', 'Stakeholder meetings', 'User research',
    ];
    const sampleFunctionality = [
      'Task automation', 'Team chat', 'Analytics dashboard',
      'Collaboration tools', 'Project tracking', 'Knowledge base',
    ];
    const sampleContexts = [
      'Office environment with remote team members',
      'Fully remote setup with distributed teams',
      'Hybrid workplace with flexible hours',
    ];
    const sampleTags = ['developer', 'designer', 'manager', 'frontend', 'backend', 'agile', 'qa'];

    const getRandomItems = (arr, count) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomStyleId = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)].id;

    setName(randomName);
    setGoals(getRandomItems(sampleGoals, 2 + Math.floor(Math.random() * 2)));
    setPainPoints(getRandomItems(samplePainPoints, 2 + Math.floor(Math.random() * 2)));
    setTasks(getRandomItems(sampleTasks, 2 + Math.floor(Math.random() * 2)));
    setFunctionality(getRandomItems(sampleFunctionality, 2 + Math.floor(Math.random() * 2)));
    setContextOfUse(sampleContexts[Math.floor(Math.random() * sampleContexts.length)]);
    setTags(getRandomItems(sampleTags, 2 + Math.floor(Math.random() * 2)));
    setPersonaPriority(Math.floor(Math.random() * 5));
    setAvatarStyle(randomStyleId);

    // Generate avatar with the new name
    const avatarUri = generateAvatar(randomName, randomStyleId);
    if (avatarUri) {
      setAvatarImage(avatarUri);
    }
  };

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
    return getAllTags();
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
      className="space-y-6 p-6 bg-white rounded-xl border border-slate-200"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {personaToEdit ? 'Edit Persona' : 'Add a New Persona'}
        </h3>
        {!personaToEdit && (
          <button
            type="button"
            onClick={prefillSampleData}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Pre-fill Sample Data
          </button>
        )}
      </div>

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
          autoFocus
          data-testid="name-input"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Avatar Image:</label>
        <div className="flex items-start gap-4">
          <div className="relative w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
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
          <div className="flex flex-col gap-3">
            {/* Generate Avatar Section */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {AVATAR_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setAvatarStyle(style.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      avatarStyle === style.id
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => generateAvatar()}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
              >
                Generate Avatar
              </button>
              <p className="text-xs text-slate-400">
                {name ? `Based on "${name}"` : 'Enter a name first for consistent results'}
              </p>
            </div>

            {/* Upload/Remove Section */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
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
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Upload Custom
              </button>
              {avatarImage && (
                <button
                  type="button"
                  onClick={() => setAvatarImage(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Tags:</label>
        <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-indigo-500">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
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
                className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Add Goal
              </button>
            )}
            {shouldShowDeleteButton(goals) && (
              <button
                type="button"
                onClick={() => handleDeleteField(index, 'goals')}
                className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-red-500 transition-colors"
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
                className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Add Pain Point
              </button>
            )}
            {shouldShowDeleteButton(painPoints) && (
              <button
                type="button"
                onClick={() => handleDeleteField(index, 'painPoints')}
                className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-red-500 transition-colors"
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
                className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Add Task
              </button>
            )}
            {shouldShowDeleteButton(tasks) && (
              <button
                type="button"
                onClick={() => handleDeleteField(index, 'tasks')}
                className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-red-500 transition-colors"
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
                className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Add Functionality
              </button>
            )}
            {shouldShowDeleteButton(functionality) && (
              <button
                type="button"
                onClick={() => handleDeleteField(index, 'functionality')}
                className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-red-500 transition-colors"
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

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
        >
          {personaToEdit ? 'Save Changes' : 'Add Persona'}
        </button>
      </div>
    </form>
  );
};

export default PersonaForm;
