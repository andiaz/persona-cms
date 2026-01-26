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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Journey Maps</h1>
          <p className="text-sm text-slate-500 mt-1">
            Visualize user journeys across touchpoints
          </p>
        </div>
        <button
          onClick={() => {
            setNewMapName(`Journey Map ${journeyMaps.length + 1}`);
            setShowCreateModal(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
        >
          + New Journey Map
        </button>
      </div>

      {/* Journey Maps Grid */}
      {journeyMaps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="text-5xl mb-4 opacity-50">🗺️</div>
          <h2 className="text-lg font-semibold text-slate-700 mb-2">
            No Journey Maps Yet
          </h2>
          <p className="text-slate-500 mb-6 text-sm">
            Create your first journey map to visualize user experiences
          </p>
          <button
            onClick={() => {
              setNewMapName(`Journey Map ${journeyMaps.length + 1}`);
              setShowCreateModal(true);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
          >
            Create Journey Map
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journeyMaps.map((map) => (
            <div
              key={map.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors p-5"
            >
              <h3 className="text-base font-semibold text-slate-900 mb-2">{map.name}</h3>

              {/* Linked Personas */}
              <div className="text-sm text-slate-500 mb-3">
                {map.personaIds?.length > 0 ? (
                  <span>
                    <span className="font-medium text-slate-600">Personas:</span>{' '}
                    {getLinkedPersonaNames(map.personaIds) || 'None linked'}
                  </span>
                ) : (
                  <span className="italic">No personas linked</span>
                )}
              </div>

              {/* Stage count */}
              <div className="text-sm text-slate-500 mb-4">
                <span className="font-medium text-slate-600">{map.stages?.length || 0}</span> stages
              </div>

              {/* Stage names preview */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {map.stages?.slice(0, 4).map((stage) => (
                  <span
                    key={stage.id}
                    className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                  >
                    {stage.name}
                  </span>
                ))}
                {(map.stages?.length || 0) > 4 && (
                  <span className="text-xs text-slate-400 px-2 py-0.5">+{map.stages.length - 4} more</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/journey-map?id=${map.id}`}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg text-center hover:bg-slate-900 transition-colors"
                >
                  Open
                </Link>
                <button
                  onClick={() => handleDelete(map.id)}
                  className="px-3 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm"
                  aria-label="Delete journey map"
                >
                  Delete
                </button>
              </div>

              {/* Updated date */}
              <div className="text-xs text-slate-400 mt-3">
                Updated: {new Date(map.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Create Journey Map</h2>

            {/* Name input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Journey Map Name
              </label>
              <input
                type="text"
                value={newMapName}
                onChange={(e) => setNewMapName(e.target.value)}
                placeholder="e.g., Customer Onboarding Journey"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                autoFocus
              />
            </div>

            {/* Persona selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Link Personas (optional)
              </label>
              {personas.length === 0 ? (
                <div className="text-center py-4 border border-slate-200 rounded-lg bg-slate-50">
                  <p className="text-sm text-slate-500 mb-2">
                    No personas available yet.
                  </p>
                  <Link
                    href="/add-persona"
                    className="text-sm font-medium text-slate-800 hover:text-slate-900 underline"
                  >
                    Create a persona first
                  </Link>
                </div>
              ) : (
                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg">
                  {personas.map((persona) => (
                    <label
                      key={persona.id}
                      className="flex items-center gap-3 p-2.5 hover:bg-slate-50 cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPersonaIds.includes(persona.id)}
                        onChange={() => togglePersonaSelection(persona.id)}
                        className="w-4 h-4 text-slate-800 rounded border-slate-300"
                      />
                      <span className="text-slate-700">{persona.name}</span>
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
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newMapName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
