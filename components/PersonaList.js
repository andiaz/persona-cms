import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { ChevronDownIcon, TrashIcon } from '@heroicons/react/24/outline'; // Import Heroicons
import Link from 'next/link';
import Image from 'next/image';

const SORT_OPTIONS = {
  priority: { label: 'Priority', fn: (a, b) => (b.priority || 0) - (a.priority || 0) },
  alphabetical: { label: 'A-Z', fn: (a, b) => a.name.localeCompare(b.name) },
  newest: { label: 'Newest', fn: (a, b) => b.id - a.id },
  oldest: { label: 'Oldest', fn: (a, b) => a.id - b.id },
};

const PersonaList = ({ personas, onDeletePersona, onDuplicatePersona }) => {
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState(''); // State for filtering by tag
  const [searchQuery, setSearchQuery] = useState(''); // Search state
  const [dropdownOpen, setDropdownOpen] = useState(false); // Track if dropdown is open
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null); // Ref for the search input field
  const [personaSearchQuery, setPersonaSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  const priorityLabels = {
    0: 'Needs prioritization',
    1: 'Low',
    2: 'Medium',
    3: 'High',
    4: 'Critical',
  };

  const priorityColors = {
    0: 'bg-gray-100 text-gray-800',
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-green-100 text-green-800',
    3: 'bg-yellow-100 text-yellow-800',
    4: 'bg-red-100 text-red-800',
  };

  const handleEditClick = (persona) => {
    // Navigate to the add-persona page with the persona ID
    router.push(`/add-persona?id=${persona.id}`);
  };

  // Get unique tags from all personas
  const allTags = Array.from(
    new Set(personas.flatMap((persona) => persona.tags || []))
  );

  // Filter tags based on the tag search query
  const filteredTags = allTags
    .filter((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  // Filter personas by selected tag and persona search query
  const filteredPersonas = personas
    .filter((persona) => {
      // Priority filter
      if (
        priorityFilter !== 'all' &&
        persona.priority < parseInt(priorityFilter)
      ) {
        return false;
      }

      // Tag filter
      if (
        selectedTag &&
        (!persona.tags || !persona.tags.includes(selectedTag))
      ) {
        return false;
      }

      // Search query filter
      if (personaSearchQuery) {
        const searchLower = personaSearchQuery.toLowerCase();
        return (
          persona.name.toLowerCase().includes(searchLower) ||
          persona.goals.some((goal) =>
            goal.toLowerCase().includes(searchLower)
          ) ||
          persona.painPoints.some((point) =>
            point.toLowerCase().includes(searchLower)
          ) ||
          (persona.tags &&
            persona.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
        );
      }

      return true;
    })
    .sort(SORT_OPTIONS[sortBy]?.fn || SORT_OPTIONS.priority.fn);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    // Attach event listener
    document.addEventListener('click', handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Set focus on the search input field when dropdown opens
    if (dropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [dropdownOpen]); // Trigger focus when dropdown opens

  // Empty state - show before filters when no personas exist
  if (personas.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
        <div className="text-5xl mb-4 opacity-50">👤</div>
        <h2 className="text-lg font-semibold text-slate-700 mb-2">
          No Personas Yet
        </h2>
        <p className="text-slate-500 mb-6 text-sm">
          Create your first persona to get started
        </p>
        <Link
          href="/add-persona"
          className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
        >
          Create Persona
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div>
        {/* Filters section with background */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Filters</h2>
            <button
              onClick={() => {
                setPersonaSearchQuery('');
                setPriorityFilter('all');
                setSelectedTag('');
                setSearchQuery('');
              }}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <span>Clear all filters</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
            {/* Search input */}
            <div className="flex-1">
              <input
                type="text"
                value={personaSearchQuery}
                onChange={(e) => setPersonaSearchQuery(e.target.value)}
                placeholder="Search personas..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            {/* Filters - wrap on mobile */}
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {/* Priority filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="flex-1 min-w-[120px] sm:flex-none sm:w-40 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="4">Critical</option>
                <option value="3">High+</option>
                <option value="2">Medium+</option>
                <option value="1">Low+</option>
                <option value="0">Unset</option>
              </select>

              {/* Tag filter */}
              <div className="relative flex-1 min-w-[120px] sm:flex-none sm:w-40" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 flex items-center justify-between bg-white text-sm"
                >
                  <span className="truncate">{selectedTag || 'All Tags'}</span>
                  <ChevronDownIcon
                    className={`w-4 h-4 ml-1 shrink-0 transition-transform ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 sm:right-0 sm:left-auto w-64 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tags..."
                      className="w-full px-4 py-2 border-b border-gray-300 rounded-t-md focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="max-h-60 overflow-y-auto">
                      {!searchQuery && (
                        <button
                          onClick={() => {
                            setSelectedTag('');
                            setSearchQuery('');
                            setDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                        >
                          All tags
                        </button>
                      )}
                      {filteredTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSelectedTag(tag);
                            setDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sort dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 min-w-[100px] sm:flex-none sm:w-28 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
              >
                {Object.entries(SORT_OPTIONS).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          {filteredPersonas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-500">No personas match your filters.</p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPersonas.map((persona) => (
                <li
                  key={persona.id}
                  className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition duration-200 h-full flex flex-col"
                >
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
                    <Link
                      href={`/view-persona?id=${persona.id}`}
                      className="group flex items-center gap-3 sm:gap-4 cursor-pointer min-w-0"
                    >
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full overflow-hidden shrink-0 ring-2 ring-transparent group-hover:ring-blue-500 transition-all">
                        {persona.avatarImage ? (
                          <Image
                            src={persona.avatarImage}
                            alt={`${persona.name}'s avatar`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs sm:text-sm text-center">
                            No image
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold group-hover:text-blue-500 transition-colors truncate">
                        {persona.name}
                      </h3>
                    </Link>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        priorityColors[persona.priority || 0]
                      }`}
                    >
                      {priorityLabels[persona.priority || 0]}
                    </span>
                  </div>
                  {/* Tags Section */}
                  <div className="mt-2">
                    <strong className="block">Tags:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {(persona.tags || []).length > 0 ? (
                        persona.tags.map((tag, index) => (
                          <span
                            key={`tag-${index}`}
                            className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No tags</span>
                      )}
                    </div>
                  </div>

                  {/* Goals Section */}
                  <div>
                    <strong className="block mt-2">Goals:</strong>
                    <ul className="list-disc pl-5">
                      {(persona.goals || []).map((goal, index) => (
                        <li key={`goal-${index}`}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong className="block mt-2">Pain Points:</strong>
                    <ul className="list-disc pl-5">
                      {(persona.painPoints || []).map((painPoint, index) => (
                        <li key={`painPoint-${index}`}>{painPoint}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong className="block mt-2">Tasks:</strong>
                    <ul className="list-disc pl-5">
                      {(persona.tasks || []).map((task, index) => (
                        <li key={`task-${index}`}>{task}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong className="block mt-2">Functionality:</strong>
                    <ul className="list-disc pl-5">
                      {(persona.functionality || []).map((func, index) => (
                        <li key={`func-${index}`}>{func}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong className="block mt-2">Context of Use:</strong>
                    <p className="pl-5">{persona.contextOfUse || ''}</p>
                  </div>
                  <div className="mt-auto pt-4 flex flex-wrap items-center gap-2">
                    <Link
                      href={`/view-persona?id=${persona.id}`}
                      className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleEditClick(persona)}
                      className="px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDuplicatePersona(persona.id)}
                      className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => onDeletePersona(persona.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                      aria-label="Delete persona"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonaList;
