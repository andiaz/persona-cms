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

const PERSONA_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
];

export default function JourneyMapPage() {
  const [journeyMap, setJourneyMap] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const [mapName, setMapName] = useState('');
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
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

    // Set exporting state to hide interactive elements
    setIsExporting(true);

    // Wait for state to update and re-render
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(mapRef.current, {
      backgroundColor: '#f8fafc',
      scale: 2,
    });

    setIsExporting(false);

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `journey-map-${journeyMap?.name || 'export'}.png`;
    link.click();
  };

  if (!journeyMap) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading journey map...</div>
      </div>
    );
  }

  const linkedPersonas = getLinkedPersonas();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center gap-6">
              <Link
                href="/journey-maps"
                className="text-slate-500 hover:text-slate-700 text-sm font-medium"
              >
                ← All Maps
              </Link>

              {/* Editable title */}
              {editingName ? (
                <input
                  type="text"
                  value={mapName}
                  onChange={(e) => setMapName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                  className="text-lg font-semibold border-b-2 border-blue-500 focus:outline-none bg-transparent"
                  autoFocus
                />
              ) : (
                <h1
                  className="text-lg font-semibold text-slate-900 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => setEditingName(true)}
                  title="Click to edit"
                >
                  {journeyMap.name}
                </h1>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Persona selector */}
              <div className="relative">
                <button
                  onClick={() => setShowPersonaSelector(!showPersonaSelector)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <span className="flex -space-x-1">
                    {linkedPersonas.slice(0, 3).map((p, i) => (
                      <span
                        key={p.id}
                        className="w-5 h-5 rounded-full border-2 border-white"
                        style={{ backgroundColor: PERSONA_COLORS[i % PERSONA_COLORS.length] }}
                      />
                    ))}
                  </span>
                  {linkedPersonas.length} Persona{linkedPersonas.length !== 1 ? 's' : ''}
                </button>

                {showPersonaSelector && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 z-30">
                    <div className="p-3 border-b border-slate-100">
                      <h3 className="font-semibold text-slate-900 text-sm">Link Personas</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Track their experience across the journey
                      </p>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-2">
                      {personas.length === 0 ? (
                        <p className="p-3 text-sm text-slate-500 text-center">
                          No personas yet.{' '}
                          <Link href="/add-persona" className="text-blue-500 hover:underline">
                            Create one
                          </Link>
                        </p>
                      ) : (
                        personas.map((persona, idx) => (
                          <label
                            key={persona.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={journeyMap.personaIds?.includes(persona.id)}
                              onChange={() => togglePersona(persona.id)}
                              className="w-4 h-4 text-blue-600 rounded border-slate-300"
                            />
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: PERSONA_COLORS[idx % PERSONA_COLORS.length] }}
                            />
                            <span className="text-sm text-slate-700">{persona.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleAddStage}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
              >
                + Add Stage
              </button>

              <button
                onClick={exportAsPNG}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Export PNG
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div ref={mapRef} className="space-y-8">
          {/* Persona Legend */}
          {linkedPersonas.length > 0 && (
            <div className="flex items-center gap-6 text-sm">
              <span className="text-slate-500 font-medium">Tracking:</span>
              {linkedPersonas.map((persona, idx) => (
                <div key={persona.id} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: PERSONA_COLORS[idx % PERSONA_COLORS.length] }}
                  />
                  <span className="text-slate-700">{persona.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Emotion Graph */}
          {linkedPersonas.length > 0 && (
            <EmotionGraph
              stages={journeyMap.stages}
              personas={linkedPersonas}
              colors={PERSONA_COLORS}
            />
          )}

          {/* Stages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {journeyMap.stages?.map((stage) => (
              <StageCard
                key={stage.id}
                stage={stage}
                linkedPersonas={linkedPersonas}
                personaColors={PERSONA_COLORS}
                onUpdate={(updates) => handleUpdateStage(stage.id, updates)}
                onDelete={() => handleDeleteStage(stage.id)}
                isExporting={isExporting}
              />
            ))}
          </div>
        </div>
      </main>

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
