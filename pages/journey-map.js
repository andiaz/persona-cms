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

const SAMPLE_TOUCHPOINTS = {
  web: ['Browse product catalog', 'Read reviews', 'Compare features', 'Check pricing page', 'View documentation'],
  mobile: ['Download app', 'Enable notifications', 'Use mobile checkout', 'Scan QR code', 'Access on-the-go'],
  email: ['Welcome email', 'Order confirmation', 'Shipping updates', 'Newsletter', 'Support response'],
  phone: ['Customer support call', 'Sales consultation', 'Technical assistance', 'Follow-up call'],
  'in-person': ['Store visit', 'Product demo', 'Training session', 'Meeting with rep', 'Event attendance'],
};

const SAMPLE_PAIN_POINTS = [
  'Information hard to find', 'Too many steps required', 'Confusing navigation',
  'Slow response time', 'Unclear error messages', 'Missing key features',
  'Price not transparent', 'Too many form fields', 'No progress indicator',
  'Inconsistent experience', 'Lack of personalization', 'Poor mobile experience',
];

const SAMPLE_OPPORTUNITIES = [
  'Add quick filters', 'Implement live chat', 'Simplify checkout flow',
  'Add progress tracking', 'Personalize recommendations', 'Improve loading speed',
  'Add comparison tool', 'Enable guest checkout', 'Send proactive updates',
  'Add FAQ section', 'Implement autosave', 'Offer multiple payment options',
];

export default function JourneyMapPage() {
  const [journeyMap, setJourneyMap] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const [mapName, setMapName] = useState('');
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
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

  const handleGenerateTestData = () => {
    if (!journeyMap) return;

    const getRandomItems = (arr, count) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const channels = Object.keys(SAMPLE_TOUCHPOINTS);
    const currentPersonas = getLinkedPersonas();

    const updatedStages = journeyMap.stages.map((stage) => {
      // Generate 1-3 random touchpoints
      const numTouchpoints = 1 + Math.floor(Math.random() * 3);
      const touchpoints = [];
      for (let i = 0; i < numTouchpoints; i++) {
        const channel = channels[Math.floor(Math.random() * channels.length)];
        const descriptions = SAMPLE_TOUCHPOINTS[channel];
        touchpoints.push({
          id: Date.now() + i + stage.id,
          channel,
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
        });
      }

      // Generate emotions for each linked persona (-2 to 2)
      const emotions = currentPersonas.map((persona) => ({
        personaId: persona.id,
        value: Math.floor(Math.random() * 5) - 2,
      }));

      // Generate 1-2 pain points
      const painPoints = getRandomItems(SAMPLE_PAIN_POINTS, 1 + Math.floor(Math.random() * 2));

      // Generate 1-2 opportunities
      const opportunities = getRandomItems(SAMPLE_OPPORTUNITIES, 1 + Math.floor(Math.random() * 2));

      return {
        ...stage,
        touchpoints,
        emotions,
        painPoints,
        opportunities,
      };
    });

    saveMap({ ...journeyMap, stages: updatedStages });
  };

  const exportAsPNG = async () => {
    if (!mapRef.current) return;

    setShowExportMenu(false);
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
    link.download = `${journeyMap.name.replace(/\s+/g, '-').toLowerCase()}-journey-map.png`;
    link.click();
  };

  // Export as Markdown
  const handleExportMarkdown = () => {
    if (!journeyMap) return;
    setShowExportMenu(false);

    const linkedPersonas = getLinkedPersonas();

    let md = `# ${journeyMap.name}\n\n`;
    md += `*Exported: ${new Date().toLocaleDateString()}*\n\n`;

    if (linkedPersonas.length > 0) {
      md += `**Personas:** ${linkedPersonas.map((p) => p.name).join(', ')}\n\n`;
    }

    md += `---\n\n`;

    journeyMap.stages?.forEach((stage, idx) => {
      md += `## ${idx + 1}. ${stage.name}\n\n`;

      // Touchpoints
      if (stage.touchpoints?.length > 0) {
        md += `### Touchpoints\n`;
        stage.touchpoints.forEach((tp) => {
          md += `- **${tp.channel}**: ${tp.description}\n`;
        });
        md += `\n`;
      }

      // Emotions
      if (stage.emotions?.length > 0 && linkedPersonas.length > 0) {
        md += `### Emotions\n`;
        stage.emotions.forEach((emo) => {
          const persona = linkedPersonas.find((p) => p.id === emo.personaId);
          if (persona) {
            const emotionLabel = emo.value >= 1 ? 'Positive' : emo.value <= -1 ? 'Negative' : 'Neutral';
            md += `- **${persona.name}**: ${emotionLabel} (${emo.value})\n`;
          }
        });
        md += `\n`;
      }

      // Pain Points
      if (stage.painPoints?.length > 0) {
        md += `### Pain Points\n`;
        stage.painPoints.forEach((pp) => {
          md += `- ${pp}\n`;
        });
        md += `\n`;
      }

      // Opportunities
      if (stage.opportunities?.length > 0) {
        md += `### Opportunities\n`;
        stage.opportunities.forEach((op) => {
          md += `- ${op}\n`;
        });
        md += `\n`;
      }

      md += `---\n\n`;
    });

    md += `_Exported from Persona Lab_\n`;

    // Download as file
    const blob = new Blob([md], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.download = `${journeyMap.name.replace(/\s+/g, '-').toLowerCase()}-journey-map.md`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (!journeyMap) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-slate-500">Loading journey map...</div>
      </div>
    );
  }

  const linkedPersonas = getLinkedPersonas();

  return (
    <div>
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 sm:py-0 sm:h-14">
            {/* Left side */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Back button */}
              <Link
                href="/journey-maps"
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
                title="Back to Journey Maps"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              {/* Editable title */}
              {editingName ? (
                <input
                  type="text"
                  value={mapName}
                  onChange={(e) => setMapName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                  className="text-base sm:text-lg font-semibold border-b-2 border-blue-500 focus:outline-none bg-transparent min-w-0"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setEditingName(true)}
                  className="flex items-center gap-2 group min-w-0"
                  title="Click to rename"
                >
                  <h1 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {journeyMap.name}
                  </h1>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
              {/* Persona selector */}
              <div className="relative">
                <button
                  onClick={() => setShowPersonaSelector(!showPersonaSelector)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <span className="flex -space-x-2">
                    {linkedPersonas.slice(0, 3).map((p, i) => (
                      p.avatarImage ? (
                        <img
                          key={p.id}
                          src={p.avatarImage}
                          alt={p.name}
                          className="w-6 h-6 rounded-full border-2 border-white object-cover"
                        />
                      ) : (
                        <span
                          key={p.id}
                          className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                          style={{ backgroundColor: PERSONA_COLORS[i % PERSONA_COLORS.length] }}
                        >
                          {p.name?.charAt(0) || '?'}
                        </span>
                      )
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
                          No personas yet.
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
                            {persona.avatarImage ? (
                              <img
                                src={persona.avatarImage}
                                alt={persona.name}
                                className="w-7 h-7 rounded-full object-cover ring-2 ring-offset-1"
                                style={{ '--tw-ring-color': PERSONA_COLORS[idx % PERSONA_COLORS.length] }}
                              />
                            ) : (
                              <span
                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white"
                                style={{ backgroundColor: PERSONA_COLORS[idx % PERSONA_COLORS.length] }}
                              >
                                {persona.name?.charAt(0) || '?'}
                              </span>
                            )}
                            <span className="text-sm text-slate-700">{persona.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                    <div className="p-2 border-t border-slate-100">
                      <Link
                        href={`/add-persona?from=journey-map&mapId=${id}`}
                        className="flex items-center gap-2 p-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Persona
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleAddStage}
                className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
              >
                <span className="sm:hidden">+ Stage</span>
                <span className="hidden sm:inline">+ Add Stage</span>
              </button>

              <button
                onClick={handleGenerateTestData}
                className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                title="Fill stages with sample data"
              >
                Generate Test Data
              </button>

              {/* Export Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="hidden sm:inline">Export</span>
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                    <button
                      onClick={exportAsPNG}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <span className="text-lg">🖼️</span> Export as PNG
                    </button>
                    <button
                      onClick={handleExportMarkdown}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <span className="text-lg">📝</span> Export as Markdown
                    </button>
                    <button
                      onClick={() => {
                        setShowExportMenu(false);
                        window.print();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <span className="text-lg">🖨️</span> Print / PDF
                    </button>
                  </div>
                )}
              </div>

              <Link
                href="/journey-maps"
                className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
              >
                Done
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div ref={mapRef} className="space-y-8">
          {/* Persona Legend */}
          {linkedPersonas.length > 0 && (
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <span className="text-slate-500 font-medium">Tracking:</span>
              {linkedPersonas.map((persona, idx) => (
                <span key={persona.id} className="inline-flex items-center gap-2">
                  {persona.avatarImage ? (
                    <img
                      src={persona.avatarImage}
                      alt={persona.name}
                      className="w-6 h-6 rounded-full object-cover ring-2 ring-offset-1"
                      style={{ '--tw-ring-color': PERSONA_COLORS[idx % PERSONA_COLORS.length] }}
                    />
                  ) : (
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                      style={{ backgroundColor: PERSONA_COLORS[idx % PERSONA_COLORS.length] }}
                    >
                      {persona.name?.charAt(0) || '?'}
                    </span>
                  )}
                  <span className="text-slate-700">{persona.name}</span>
                </span>
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

      {/* Click outside to close dropdowns */}
      {(showPersonaSelector || showExportMenu) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowPersonaSelector(false);
            setShowExportMenu(false);
          }}
        />
      )}
    </div>
  );
}
