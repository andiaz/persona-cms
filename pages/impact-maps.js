// pages/impact-maps.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  getImpactMaps,
  deleteImpactMap,
  duplicateImpactMap,
  addImpactMap,
  getPersonas,
} from '../lib/storage';

export default function ImpactMapsPage() {
  const [impactMaps, setImpactMaps] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMapName, setNewMapName] = useState('');
  const [newMapGoal, setNewMapGoal] = useState('');
  const router = useRouter();

  useEffect(() => {
    setImpactMaps(getImpactMaps());
    setPersonas(getPersonas());
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this impact map?')) {
      deleteImpactMap(id);
      setImpactMaps(getImpactMaps());
    }
  };

  const handleDuplicate = (id) => {
    duplicateImpactMap(id);
    setImpactMaps(getImpactMaps());
  };

  const handleCreate = () => {
    if (!newMapName.trim() || !newMapGoal.trim()) return;

    const newMap = addImpactMap({
      name: newMapName.trim(),
      goal: newMapGoal.trim(),
      nodes: [],
    });

    setShowCreateModal(false);
    setNewMapName('');
    setNewMapGoal('');
    router.push(`/impact-map?id=${newMap.id}`);
  };

  const getNodeCounts = (nodes) => {
    const counts = { actors: 0, impacts: 0, deliverables: 0 };
    nodes?.forEach((node) => {
      if (node.type === 'actor') counts.actors++;
      else if (node.type === 'impact') counts.impacts++;
      else if (node.type === 'deliverable') counts.deliverables++;
    });
    return counts;
  };

  const getLinkedPersonas = (nodes) => {
    const personaIds = nodes
      ?.filter((n) => n.type === 'actor' && n.personaId)
      .map((n) => n.personaId) || [];
    return personaIds
      .map((id) => personas.find((p) => p.id === id))
      .filter(Boolean);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Impact Maps</h1>
          <p className="text-sm text-slate-500 mt-1">
            Connect goals to deliverables through actors and impacts
          </p>
        </div>
        <button
          onClick={() => {
            setNewMapName(`Impact Map ${impactMaps.length + 1}`);
            setNewMapGoal('');
            setShowCreateModal(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
        >
          + New Impact Map
        </button>
      </div>

      {/* Impact Maps Grid */}
      {impactMaps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="text-5xl mb-4 opacity-50">🎯</div>
          <h2 className="text-lg font-semibold text-slate-700 mb-2">
            No Impact Maps Yet
          </h2>
          <p className="text-slate-500 mb-6 text-sm max-w-md mx-auto">
            Impact maps help you connect business goals to deliverables through the actors who can influence outcomes.
          </p>
          <button
            onClick={() => {
              setNewMapName('Impact Map 1');
              setNewMapGoal('');
              setShowCreateModal(true);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
          >
            Create Impact Map
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impactMaps.map((map) => {
            const counts = getNodeCounts(map.nodes);
            const linkedPersonas = getLinkedPersonas(map.nodes);

            return (
              <div
                key={map.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors p-5"
              >
                <Link
                  href={`/impact-map?id=${map.id}`}
                  className="text-base font-semibold text-slate-900 hover:text-slate-600 transition-colors block mb-2"
                >
                  {map.name}
                </Link>

                {/* Goal */}
                <div className="text-sm text-slate-600 mb-3 line-clamp-2">
                  <span className="font-medium text-slate-500">Goal:</span> {map.goal}
                </div>

                {/* Node counts */}
                <div className="flex gap-3 text-sm text-slate-500 mb-3">
                  <span>
                    <span className="font-medium text-blue-600">{counts.actors}</span> actors
                  </span>
                  <span>
                    <span className="font-medium text-amber-600">{counts.impacts}</span> impacts
                  </span>
                  <span>
                    <span className="font-medium text-green-600">{counts.deliverables}</span> deliverables
                  </span>
                </div>

                {/* Linked Personas */}
                {linkedPersonas.length > 0 && (
                  <div className="flex items-center gap-1 mb-4">
                    <span className="text-xs text-slate-500 mr-1">Linked:</span>
                    <div className="flex -space-x-2">
                      {linkedPersonas.slice(0, 4).map((persona) => (
                        <div
                          key={persona.id}
                          className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden"
                          title={persona.name}
                        >
                          {persona.avatarImage ? (
                            <img
                              src={persona.avatarImage}
                              alt={persona.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="w-full h-full flex items-center justify-center text-xs text-slate-600">
                              {persona.name?.charAt(0) || '?'}
                            </span>
                          )}
                        </div>
                      ))}
                      {linkedPersonas.length > 4 && (
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-xs text-slate-600">
                          +{linkedPersonas.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/impact-map?id=${map.id}`}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg text-center hover:bg-slate-900 transition-colors"
                  >
                    Open
                  </Link>
                  <button
                    onClick={() => handleDuplicate(map.id)}
                    className="px-3 py-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm"
                    aria-label="Duplicate impact map"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => handleDelete(map.id)}
                    className="px-3 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm"
                    aria-label="Delete impact map"
                  >
                    Delete
                  </button>
                </div>

                {/* Updated date */}
                <div className="text-xs text-slate-400 mt-3">
                  Updated: {new Date(map.updatedAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Create Impact Map</h2>

            {/* Name input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Impact Map Name
              </label>
              <input
                type="text"
                value={newMapName}
                onChange={(e) => setNewMapName(e.target.value)}
                placeholder="e.g., Q1 Growth Strategy"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                autoFocus
              />
            </div>

            {/* Goal input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Goal
              </label>
              <textarea
                value={newMapGoal}
                onChange={(e) => setNewMapGoal(e.target.value)}
                placeholder="e.g., Increase user retention by 20%"
                rows={3}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                The business objective you want to achieve
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewMapName('');
                  setNewMapGoal('');
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newMapName.trim() || !newMapGoal.trim()}
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
