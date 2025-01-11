import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { ChevronDownIcon, TrashIcon } from '@heroicons/react/24/outline'; // Import Heroicons
import Link from 'next/link';
import Image from 'next/image';

const PersonaList = ({ personas, onDeletePersona }) => {
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState(''); // State for filtering by tag
  const [searchQuery, setSearchQuery] = useState(''); // Search state
  const [dropdownOpen, setDropdownOpen] = useState(false); // Track if dropdown is open
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null); // Ref for the search input field

  const handleEditClick = (persona) => {
    // Navigate to the add-persona page with the persona ID
    router.push(`/add-persona?id=${persona.id}`);
  };

  // Get unique tags from all personas
  const allTags = Array.from(
    new Set(personas.flatMap((persona) => persona.tags || []))
  );

  // Filter tags based on the search query
  const filteredTags = allTags
    .filter((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.localeCompare(b)); // Sort alphabetically

  // Filter personas by selected tag
  const filteredPersonas = selectedTag
    ? personas.filter((persona) => persona.tags?.includes(selectedTag))
    : personas;

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

  return (
    <div>
      {/* Custom dropdown for tag filter */}
      <div className="relative z-40" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 flex items-center justify-center"
        >
          <span>{selectedTag || 'Select a Tag'}</span>
          <ChevronDownIcon
            className={`w-4 h-4 ml-2 transition-transform ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
            {/* Search input */}
            <input
              ref={searchInputRef} // Set the ref to the input field
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tags..."
              className="w-full px-4 py-2 border-b border-gray-300 rounded-t-md focus:ring-2 focus:ring-indigo-500"
            />
            {/* Dropdown options */}
            <div className="max-h-60 overflow-y-auto">
              {/* Only render "All tags" if there's no search query */}
              {!searchQuery && (
                <button
                  onClick={() => {
                    setSelectedTag(''); // Reset the filter
                    setSearchQuery(''); // Clear the search query
                    setDropdownOpen(false); // Close dropdown
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  All tags
                </button>
              )}

              {/* Filtered tags */}
              {filteredTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(tag); // Set selected tag
                    setDropdownOpen(false); // Close dropdown
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ul className="space-y-4">
        {personas.length === 0 ? (
          <p>No personas found.</p>
        ) : (
          filteredPersonas.map((persona) => (
            <li
              key={persona.id}
              className="p-4 border rounded-lg shadow-md hover:shadow-lg transition duration-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 bg-gray-200 rounded-full overflow-hidden shrink-0">
                  {persona.avatarImage ? (
                    <Image
                      src={persona.avatarImage}
                      alt={`${persona.name}'s avatar`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm text-center">
                      No image
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold">{persona.name}</h3>
              </div>
              {/* Tags Section */}
              <div className="mt-2">
                <strong className="block">Tags:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(persona.tags || []).length > 0 ? (
                    persona.tags.map((tag, index) => (
                      <span
                        key={`tag-${index}`}
                        onClick={() => handleEditClick(persona)}
                        className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm"
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
              <div className="mt-4">
                <button
                  onClick={() => handleEditClick(persona)}
                  className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeletePersona(persona.id)}
                  className="px-4 py-2 bg-gray-50 text-gray-500 rounded hover:bg-gray-300 focus:ring-2 focus:ring-indigo-500"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
                <Link
                  href={`/view-persona?id=${persona.id}`}
                  className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  View Layout
                </Link>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default PersonaList;
