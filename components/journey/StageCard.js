// components/journey/StageCard.js
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from '@heroicons/react/24/outline';

const CHANNELS = [
  { id: 'web', label: 'Web', icon: '🌐' },
  { id: 'mobile', label: 'Mobile', icon: '📱' },
  { id: 'email', label: 'Email', icon: '📧' },
  { id: 'phone', label: 'Phone', icon: '📞' },
  { id: 'in-person', label: 'In-Person', icon: '🤝' },
  { id: 'other', label: 'Other', icon: '📌' },
];

const EMOTIONS = [
  { value: 2, label: 'Very Happy', icon: '😄' },
  { value: 1, label: 'Happy', icon: '🙂' },
  { value: 0, label: 'Neutral', icon: '😐' },
  { value: -1, label: 'Unhappy', icon: '😕' },
  { value: -2, label: 'Very Unhappy', icon: '😞' },
];

export default function StageCard({
  stage,
  stageIndex,
  totalStages,
  linkedPersonas,
  personaColors,
  onUpdate,
  onDelete,
  onMoveLeft,
  onMoveRight,
}) {
  const [editingName, setEditingName] = useState(false);
  const [stageName, setStageName] = useState(stage.name);
  const [newTouchpoint, setNewTouchpoint] = useState({ channel: 'web', description: '' });
  const [newPainPoint, setNewPainPoint] = useState('');
  const [newOpportunity, setNewOpportunity] = useState('');
  const [showPainPointSuggestions, setShowPainPointSuggestions] = useState(false);

  // Get pain point suggestions from linked personas
  const getPainPointSuggestions = () => {
    const suggestions = [];
    linkedPersonas.forEach((persona) => {
      persona.painPoints?.forEach((pp) => {
        if (!stage.painPoints?.includes(pp) && !suggestions.includes(pp)) {
          suggestions.push(pp);
        }
      });
    });
    return suggestions;
  };

  const handleNameSave = () => {
    if (stageName.trim()) {
      onUpdate({ name: stageName.trim() });
    }
    setEditingName(false);
  };

  const handleAddTouchpoint = () => {
    if (!newTouchpoint.description.trim()) return;
    const touchpoints = [
      ...(stage.touchpoints || []),
      { id: Date.now(), ...newTouchpoint },
    ];
    onUpdate({ touchpoints });
    setNewTouchpoint({ channel: 'web', description: '' });
  };

  const handleRemoveTouchpoint = (id) => {
    const touchpoints = stage.touchpoints.filter((t) => t.id !== id);
    onUpdate({ touchpoints });
  };

  const handleAddPainPoint = (text) => {
    if (!text?.trim()) return;
    const painPoints = [...(stage.painPoints || []), text.trim()];
    onUpdate({ painPoints });
    setNewPainPoint('');
    setShowPainPointSuggestions(false);
  };

  const handleRemovePainPoint = (index) => {
    const painPoints = stage.painPoints.filter((_, i) => i !== index);
    onUpdate({ painPoints });
  };

  const handleAddOpportunity = () => {
    if (!newOpportunity.trim()) return;
    const opportunities = [...(stage.opportunities || []), newOpportunity.trim()];
    onUpdate({ opportunities });
    setNewOpportunity('');
  };

  const handleRemoveOpportunity = (index) => {
    const opportunities = stage.opportunities.filter((_, i) => i !== index);
    onUpdate({ opportunities });
  };

  const handleEmotionChange = (personaId, value) => {
    const emotions = [...(stage.emotions || [])];
    const existingIndex = emotions.findIndex((e) => e.personaId === personaId);
    if (existingIndex >= 0) {
      emotions[existingIndex] = { ...emotions[existingIndex], value };
    } else {
      emotions.push({ personaId, value });
    }
    onUpdate({ emotions });
  };

  const getEmotionValue = (personaId) => {
    const emotion = stage.emotions?.find((e) => e.personaId === personaId);
    return emotion?.value ?? 0;
  };

  const painPointSuggestions = getPainPointSuggestions();

  return (
    <div className="w-72 flex-shrink-0 bg-gray-50 rounded-lg border border-gray-200">
      {/* Stage Header */}
      <div className="bg-blue-600 text-white p-3 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={onMoveLeft}
              disabled={stageIndex === 0}
              className="p-1 hover:bg-blue-700 rounded disabled:opacity-30"
              title="Move left"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onMoveRight}
              disabled={stageIndex === totalStages - 1}
              className="p-1 hover:bg-blue-700 rounded disabled:opacity-30"
              title="Move right"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>

          {editingName ? (
            <input
              type="text"
              value={stageName}
              onChange={(e) => setStageName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
              className="flex-1 mx-2 px-2 py-1 text-sm bg-blue-700 rounded border-none focus:outline-none focus:ring-1 focus:ring-white"
              autoFocus
            />
          ) : (
            <span
              className="flex-1 mx-2 font-medium cursor-pointer hover:underline text-center"
              onClick={() => setEditingName(true)}
              title="Click to edit"
            >
              {stage.name}
            </span>
          )}

          <button
            onClick={onDelete}
            className="p-1 hover:bg-red-600 rounded"
            title="Delete stage"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-3 space-y-4 max-h-[500px] overflow-y-auto">
        {/* Emotions per persona */}
        {linkedPersonas.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Emotions
            </h4>
            <div className="space-y-2">
              {linkedPersonas.map((persona, idx) => (
                <div key={persona.id} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: personaColors[idx % personaColors.length] }}
                  />
                  <span className="text-xs text-gray-600 w-16 truncate" title={persona.name}>
                    {persona.name}
                  </span>
                  <div className="flex gap-1">
                    {EMOTIONS.map((emotion) => (
                      <button
                        key={emotion.value}
                        onClick={() => handleEmotionChange(persona.id, emotion.value)}
                        className={`text-sm p-1 rounded ${
                          getEmotionValue(persona.id) === emotion.value
                            ? 'bg-blue-100 ring-1 ring-blue-400'
                            : 'hover:bg-gray-100'
                        }`}
                        title={emotion.label}
                      >
                        {emotion.icon}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Touchpoints */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Touchpoints
          </h4>
          <div className="space-y-2">
            {stage.touchpoints?.map((tp) => (
              <div
                key={tp.id}
                className="flex items-start gap-2 bg-white p-2 rounded text-sm group"
              >
                <span title={CHANNELS.find((c) => c.id === tp.channel)?.label}>
                  {CHANNELS.find((c) => c.id === tp.channel)?.icon || '📌'}
                </span>
                <span className="flex-1">{tp.description}</span>
                <button
                  onClick={() => handleRemoveTouchpoint(tp.id)}
                  className="text-red-500 opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
            {/* Add touchpoint form */}
            <div className="flex gap-1">
              <select
                value={newTouchpoint.channel}
                onChange={(e) =>
                  setNewTouchpoint({ ...newTouchpoint, channel: e.target.value })
                }
                className="text-xs border rounded px-1 py-1"
              >
                {CHANNELS.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.icon} {ch.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newTouchpoint.description}
                onChange={(e) =>
                  setNewTouchpoint({ ...newTouchpoint, description: e.target.value })
                }
                onKeyDown={(e) => e.key === 'Enter' && handleAddTouchpoint()}
                placeholder="Add touchpoint..."
                className="flex-1 text-xs border rounded px-2 py-1"
              />
              <button
                onClick={handleAddTouchpoint}
                className="text-xs bg-blue-500 text-white px-2 rounded hover:bg-blue-600"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Pain Points */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Pain Points
          </h4>
          <div className="space-y-2">
            {stage.painPoints?.map((pp, index) => (
              <div
                key={index}
                className="flex items-start gap-2 bg-red-50 p-2 rounded text-sm group"
              >
                <span className="text-red-500">⚠</span>
                <span className="flex-1">{pp}</span>
                <button
                  onClick={() => handleRemovePainPoint(index)}
                  className="text-red-500 opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
            {/* Add pain point */}
            <div className="relative">
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newPainPoint}
                  onChange={(e) => setNewPainPoint(e.target.value)}
                  onFocus={() => setShowPainPointSuggestions(true)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPainPoint(newPainPoint)}
                  placeholder="Add pain point..."
                  className="flex-1 text-xs border rounded px-2 py-1"
                />
                <button
                  onClick={() => handleAddPainPoint(newPainPoint)}
                  className="text-xs bg-red-500 text-white px-2 rounded hover:bg-red-600"
                >
                  +
                </button>
              </div>
              {/* Suggestions from personas */}
              {showPainPointSuggestions && painPointSuggestions.length > 0 && (
                <div className="absolute z-10 left-0 right-0 mt-1 bg-white border rounded shadow-lg max-h-32 overflow-y-auto">
                  <div className="text-xs text-gray-500 px-2 py-1 border-b">
                    From linked personas:
                  </div>
                  {painPointSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddPainPoint(suggestion)}
                      className="w-full text-left text-xs px-2 py-1 hover:bg-gray-100 truncate"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Opportunities */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Opportunities
          </h4>
          <div className="space-y-2">
            {stage.opportunities?.map((opp, index) => (
              <div
                key={index}
                className="flex items-start gap-2 bg-green-50 p-2 rounded text-sm group"
              >
                <span className="text-green-500">💡</span>
                <span className="flex-1">{opp}</span>
                <button
                  onClick={() => handleRemoveOpportunity(index)}
                  className="text-red-500 opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
            {/* Add opportunity */}
            <div className="flex gap-1">
              <input
                type="text"
                value={newOpportunity}
                onChange={(e) => setNewOpportunity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddOpportunity()}
                placeholder="Add opportunity..."
                className="flex-1 text-xs border rounded px-2 py-1"
              />
              <button
                onClick={handleAddOpportunity}
                className="text-xs bg-green-500 text-white px-2 rounded hover:bg-green-600"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
