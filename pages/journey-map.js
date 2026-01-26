// pages/journey-map.js
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import html2canvas from 'html2canvas';
import {
  getJourneyMapById,
  updateJourneyMap,
  getPersonas,
  getPersonaById,
  createStage,
} from '../lib/storage';
import StageCard from '../components/journey/StageCard';
import EmotionGraph from '../components/journey/EmotionGraph';

const EMOTION_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
];

export default function JourneyMapPage() {
  const [journeyMap, setJourneyMap] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const [mapName, setMapName] = useState('');
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);
  const mapRef = useRef(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const map = getJourneyMapById(parseInt(id));
      if (map) {
        setJourneyMap(map);
        setMapName(map.name);
      }
      setPersonas(getPersonas());
    }
  }, [id]);

  const saveMap = (updatedMap) => {
    updateJourneyMap(updatedMap);
    setJourneyMap(updatedMap);
  };

  const handleNameSave = () => {
    if (mapName.trim() && journeyMap) {
      saveMap({ ...journeyMap, name: mapName.trim() });
    }
    setEditingName(false);
  };

  const handleAddStage = () => {
    if (!journeyMap) return;
    const newStage = createStage(
      `Stage ${(journeyMap.stages?.length || 0) + 1}`,
      journeyMap.stages?.length || 0
    );
    saveMap({
      ...journeyMap,
      stages: [...(journeyMap.stages || []), newStage],
    });
  };

  const handleUpdateStage = (stageId, updates) => {
    if (!journeyMap) return;
    const updatedStages = journeyMap.stages.map((stage) =>
      stage.id === stageId ? { ...stage, ...updates } : stage
    );
    saveMap({ ...journeyMap, stages: updatedStages });
  };

  const handleDeleteStage = (stageId) => {
    if (!journeyMap) return;
    if (journeyMap.stages.length <= 1) {
      alert('Journey map must have at least one stage');
      return;
    }
    const updatedStages = journeyMap.stages.filter((s) => s.id !== stageId);
    saveMap({ ...journeyMap, stages: updatedStages });
  };

  const handleMoveStage = (stageId, direction) => {
    if (!journeyMap) return;
    const stages = [...journeyMap.stages];
    const index = stages.findIndex((s) => s.id === stageId);
    if (
      (direction === 'left' && index === 0) ||
      (direction === 'right' && index === stages.length - 1)
    ) {
      return;
    }
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    [stages[index], stages[newIndex]] = [stages[newIndex], stages[index]];
    saveMap({ ...journeyMap, stages });
  };

  const togglePersona = (personaId) => {
    if (!journeyMap) return;
    const currentIds = journeyMap.personaIds || [];
    const newIds = currentIds.includes(personaId)
      ? currentIds.filter((id) => id !== personaId)
      : [...currentIds, personaId];
    saveMap({ ...journeyMap, personaIds: newIds });
  };

  const getLinkedPersonas = () => {
    if (!journeyMap?.personaIds) return [];
    return journeyMap.personaIds
      .map((id) => getPersonaById(id))
      .filter(Boolean);
  };

  const exportAsPNG = async () => {
    if (!mapRef.current) return;
    const canvas = await html2canvas(mapRef.current, {
      backgroundColor: '#ffffff',
      scale: 2,
    });
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `journey-map-${journeyMap?.name || 'export'}.png`;
    link.click();
  };

  if (!journeyMap) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading journey map...</div>
      </div>
    );
  }

  const linkedPersonas = getLinkedPersonas();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/journey-maps"
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back
              </Link>

              {/* Editable title */}
              {editingName ? (
                <input
                  type="text"
                  value={mapName}
                  onChange={(e) => setMapName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                  className="text-xl font-semibold border-b-2 border-blue-500 focus:outline-none"
                  autoFocus
                />
              ) : (
                <h1
                  className="text-xl font-semibold cursor-pointer hover:text-blue-600"
                  onClick={() => setEditingName(true)}
                  title="Click to edit"
                >
                  {journeyMap.name}
                </h1>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Persona selector */}
              <div className="relative">
                <button
                  onClick={() => setShowPersonaSelector(!showPersonaSelector)}
                  className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                >
                  Personas ({linkedPersonas.length})
                </button>
                {showPersonaSelector && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-20">
                    <div className="p-2 border-b text-sm font-medium text-gray-700">
                      Link Personas
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {personas.length === 0 ? (
                        <div className="p-3 text-sm text-gray-500">
                          No personas available
                        </div>
                      ) : (
                        personas.map((persona) => (
                          <label
                            key={persona.id}
                            className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={journeyMap.personaIds?.includes(persona.id)}
                              onChange={() => togglePersona(persona.id)}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm">{persona.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleAddStage}
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                + Add Stage
              </button>
              <button
                onClick={exportAsPNG}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Export PNG
              </button>
            </div>
          </div>

          {/* Linked personas legend */}
          {linkedPersonas.length > 0 && (
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="text-gray-500">Emotion tracking:</span>
              {linkedPersonas.map((persona, idx) => (
                <div key={persona.id} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: EMOTION_COLORS[idx % EMOTION_COLORS.length] }}
                  />
                  <span>{persona.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Journey Map Content */}
      <div className="p-4 overflow-x-auto">
        <div ref={mapRef} className="bg-white rounded-lg shadow-sm p-6 min-w-max">
          {/* Emotion Graph */}
          {linkedPersonas.length > 0 && (
            <EmotionGraph
              stages={journeyMap.stages}
              personas={linkedPersonas}
              colors={EMOTION_COLORS}
            />
          )}

          {/* Stages */}
          <div className="flex gap-4">
            {journeyMap.stages?.map((stage, index) => (
              <StageCard
                key={stage.id}
                stage={stage}
                stageIndex={index}
                totalStages={journeyMap.stages.length}
                linkedPersonas={linkedPersonas}
                personaColors={EMOTION_COLORS}
                onUpdate={(updates) => handleUpdateStage(stage.id, updates)}
                onDelete={() => handleDeleteStage(stage.id)}
                onMoveLeft={() => handleMoveStage(stage.id, 'left')}
                onMoveRight={() => handleMoveStage(stage.id, 'right')}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Click outside to close persona selector */}
      {showPersonaSelector && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowPersonaSelector(false)}
        />
      )}
    </div>
  );
}
