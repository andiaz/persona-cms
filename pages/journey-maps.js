// pages/journey-maps.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  getJourneyMaps,
  deleteJourneyMap,
  addJourneyMap,
  getPersonas,
  getDefaultStages,
} from '../lib/storage';

export default function JourneyMapsPage() {
  const [journeyMaps, setJourneyMaps] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMapName, setNewMapName] = useState('');
  const [selectedPersonaIds, setSelectedPersonaIds] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setJourneyMaps(getJourneyMaps());
    setPersonas(getPersonas());
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this journey map?')) {
      deleteJourneyMap(id);
      setJourneyMaps(getJourneyMaps());
    }
  };

  const handleCreate = () => {
    if (!newMapName.trim()) return;

    const newMap = addJourneyMap({
      name: newMapName.trim(),
      personaIds: selectedPersonaIds,
      stages: getDefaultStages(),
    });

    setShowCreateModal(false);
    setNewMapName('');
    setSelectedPersonaIds([]);
    router.push(`/journey-map?id=${newMap.id}`);
  };

  const togglePersonaSelection = (personaId) => {
    setSelectedPersonaIds((prev) =>
      prev.includes(personaId)
        ? prev.filter((id) => id !== personaId)
        : [...prev, personaId]
    );
  };

  const getLinkedPersonaNames = (personaIds) => {
    return personaIds
      .map((id) => personas.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Journey Maps</h1>
          <p className="text-gray-600 mt-1">
            Visualize user journeys across touchpoints
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/"
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Back to Personas
          </Link>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            New Journey Map
          </button>
        </div>
      </div>

      {/* Journey Maps Grid */}
      {journeyMaps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Journey Maps Yet
          </h2>
          <p className="text-gray-500 mb-6">
            Create your first journey map to visualize user experiences
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Create Journey Map
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journeyMaps.map((map) => (
            <div
              key={map.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <h3 className="text-lg font-semibold mb-2">{map.name}</h3>

              {/* Linked Personas */}
              <div className="text-sm text-gray-500 mb-3">
                {map.personaIds?.length > 0 ? (
                  <span>
                    <span className="font-medium">Personas:</span>{' '}
                    {getLinkedPersonaNames(map.personaIds) || 'None linked'}
                  </span>
                ) : (
                  <span className="italic">No personas linked</span>
                )}
              </div>

              {/* Stage count */}
              <div className="text-sm text-gray-500 mb-4">
                <span className="font-medium">{map.stages?.length || 0}</span> stages
              </div>

              {/* Stage preview */}
              <div className="flex gap-1 mb-4 overflow-hidden">
                {map.stages?.slice(0, 5).map((stage) => (
                  <div
                    key={stage.id}
                    className="flex-1 h-2 bg-blue-200 rounded"
                    title={stage.name}
                  />
                ))}
                {(map.stages?.length || 0) > 5 && (
                  <div className="text-xs text-gray-400">+{map.stages.length - 5}</div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/journey-map?id=${map.id}`}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded text-center hover:bg-blue-600 text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(map.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  aria-label="Delete journey map"
                >
                  Delete
                </button>
              </div>

              {/* Updated date */}
              <div className="text-xs text-gray-400 mt-3">
                Updated: {new Date(map.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Create Journey Map</h2>

            {/* Name input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Journey Map Name
              </label>
              <input
                type="text"
                value={newMapName}
                onChange={(e) => setNewMapName(e.target.value)}
                placeholder="e.g., Customer Onboarding Journey"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>

            {/* Persona selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link Personas (optional)
              </label>
              {personas.length === 0 ? (
                <p className="text-sm text-gray-500 italic">
                  No personas available. Create some personas first.
                </p>
              ) : (
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                  {personas.map((persona) => (
                    <label
                      key={persona.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPersonaIds.includes(persona.id)}
                        onChange={() => togglePersonaSelection(persona.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm">{persona.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewMapName('');
                  setSelectedPersonaIds([]);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newMapName.trim()}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
