// components/journey/StageCard.js
import { useState } from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

const CHANNELS = [
  { id: 'web', label: 'Web', icon: '🌐' },
  { id: 'mobile', label: 'Mobile', icon: '📱' },
  { id: 'email', label: 'Email', icon: '📧' },
  { id: 'phone', label: 'Phone', icon: '📞' },
  { id: 'in-person', label: 'In-Person', icon: '🤝' },
  { id: 'other', label: 'Other', icon: '📌' },
];

const EMOTIONS = [
  { value: 2, label: 'Delighted', color: '#22c55e' },
  { value: 1, label: 'Happy', color: '#84cc16' },
  { value: 0, label: 'Neutral', color: '#eab308' },
  { value: -1, label: 'Frustrated', color: '#f97316' },
  { value: -2, label: 'Upset', color: '#ef4444' },
];

export default function StageCard({
  stage,
  linkedPersonas,
  personaColors,
  onUpdate,
  onDelete,
  isExporting = false,
}) {
  const [editingName, setEditingName] = useState(false);
  const [stageName, setStageName] = useState(stage.name);
  const [newTouchpoint, setNewTouchpoint] = useState({ channel: 'web', description: '' });
  const [newPainPoint, setNewPainPoint] = useState('');
  const [newOpportunity, setNewOpportunity] = useState('');
  const [showPainPointSuggestions, setShowPainPointSuggestions] = useState(false);

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

  const getEmotionInfo = (value) => {
    return EMOTIONS.find((e) => e.value === value) || EMOTIONS[2];
  };

  const painPointSuggestions = getPainPointSuggestions();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Stage Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          {editingName && !isExporting ? (
            <input
              type="text"
              value={stageName}
              onChange={(e) => setStageName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
              className="flex-1 px-2 py-1 text-sm bg-slate-600 rounded border-none focus:outline-none focus:ring-2 focus:ring-white/50"
              autoFocus
            />
          ) : (
            <h3 className="font-semibold text-sm flex items-center gap-2">
              {stage.name}
              {!isExporting && (
                <button
                  onClick={() => setEditingName(true)}
                  className="opacity-60 hover:opacity-100"
                >
                  <PencilIcon className="w-3 h-3" />
                </button>
              )}
            </h3>
          )}
          {!isExporting && (
            <button
              onClick={onDelete}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              title="Delete stage"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Emotions per persona */}
        {linkedPersonas.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Experience
            </h4>
            <div className="space-y-3">
              {linkedPersonas.map((persona, idx) => {
                const emotionValue = getEmotionValue(persona.id);
                const emotionInfo = getEmotionInfo(emotionValue);
                return (
                  <div key={persona.id} className="space-y-1.5">
                    <div style={{ fontSize: '12px', lineHeight: '24px' }}>
                        <svg width="10" height="24" style={{ display: 'inline-block', verticalAlign: 'top', marginRight: '8px' }}>
                          <circle cx="5" cy="12" r="5" fill={personaColors[idx % personaColors.length]} />
                        </svg>
                        <span
                          className="font-medium text-slate-600"
                          style={{
                            maxWidth: '100px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'inline-block',
                            verticalAlign: 'top'
                          }}
                        >
                          {persona.name}
                        </span>
                        <span
                          className="font-medium"
                          style={{
                            float: 'right',
                            fontSize: '12px',
                            lineHeight: '20px',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            backgroundColor: `${emotionInfo.color}20`,
                            color: emotionInfo.color,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {emotionInfo.label}
                        </span>
                    </div>
                    {/* Emotion slider - hidden during export */}
                    {!isExporting && (
                      <div className="flex items-center gap-1 pl-4">
                        <input
                          type="range"
                          min="-2"
                          max="2"
                          step="1"
                          value={emotionValue}
                          onChange={(e) => handleEmotionChange(persona.id, parseInt(e.target.value))}
                          className="flex-1 h-1.5 appearance-none rounded-full cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #ef4444, #f97316, #eab308, #84cc16, #22c55e)`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Touchpoints */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Touchpoints
          </h4>
          <div className="space-y-2">
            {stage.touchpoints?.length > 0 ? (
              stage.touchpoints.map((tp) => {
                const channel = CHANNELS.find((c) => c.id === tp.channel);
                return (
                  <div
                    key={tp.id}
                    className="bg-slate-50 px-3 py-2 rounded-lg text-sm group"
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}
                  >
                    <span
                      className="bg-blue-100 rounded flex-shrink-0"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        fontSize: '14px'
                      }}
                    >
                      {channel?.icon || '📌'}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span className="text-slate-700" style={{ display: 'block', lineHeight: '20px' }}>{tp.description}</span>
                      <span className="text-slate-400" style={{ display: 'block', fontSize: '12px', lineHeight: '16px' }}>{channel?.label}</span>
                    </span>
                    {!isExporting && (
                      <button
                        onClick={() => handleRemoveTouchpoint(tp.id)}
                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-slate-400 italic py-2">
                {isExporting ? 'No touchpoints defined' : 'No touchpoints yet'}
              </div>
            )}
            {/* Add touchpoint - hidden during export */}
            {!isExporting && (
              <div className="space-y-2">
                <select
                  value={newTouchpoint.channel}
                  onChange={(e) => setNewTouchpoint({ ...newTouchpoint, channel: e.target.value })}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {CHANNELS.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.icon} {ch.label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTouchpoint.description}
                    onChange={(e) => setNewTouchpoint({ ...newTouchpoint, description: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTouchpoint()}
                    placeholder="Describe the touchpoint..."
                    className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddTouchpoint}
                    disabled={!newTouchpoint.description.trim()}
                    className="px-3 py-2 bg-slate-700 text-white text-xs font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pain Points */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Pain Points
          </h4>
          <div className="space-y-2">
            {stage.painPoints?.length > 0 ? (
              stage.painPoints.map((pp, index) => (
                <div
                  key={index}
                  className="bg-red-50 border border-red-100 px-3 py-2 rounded-lg text-sm group"
                  style={{ lineHeight: '20px' }}
                >
                  <svg width="8" height="20" style={{ display: 'inline-block', verticalAlign: 'top', marginRight: '8px' }}>
                    <circle cx="4" cy="10" r="4" fill="#f87171" />
                  </svg>
                  <span className="text-slate-700" style={{ verticalAlign: 'top' }}>{pp}</span>
                  {!isExporting && (
                    <button
                      onClick={() => handleRemovePainPoint(index)}
                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity float-right"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 italic py-2">
                {isExporting ? 'No pain points identified' : 'No pain points yet'}
              </div>
            )}
            {/* Add pain point - hidden during export */}
            {!isExporting && (
              <div className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPainPoint}
                    onChange={(e) => setNewPainPoint(e.target.value)}
                    onFocus={() => setShowPainPointSuggestions(true)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddPainPoint(newPainPoint)}
                    placeholder="Add a pain point..."
                    className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleAddPainPoint(newPainPoint)}
                    disabled={!newPainPoint.trim()}
                    className="px-3 py-2 bg-slate-700 text-white text-xs font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add
                  </button>
                </div>
                {showPainPointSuggestions && painPointSuggestions.length > 0 && (
                  <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
                    <div className="text-xs text-slate-500 px-3 py-2 border-b border-slate-100 bg-slate-50 font-medium">
                      Suggestions from personas
                    </div>
                    {painPointSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAddPainPoint(suggestion)}
                        className="w-full text-left text-xs px-3 py-2 hover:bg-slate-50 text-slate-600 border-b border-slate-50 last:border-0"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Opportunities */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Opportunities
          </h4>
          <div className="space-y-2">
            {stage.opportunities?.length > 0 ? (
              stage.opportunities.map((opp, index) => (
                <div
                  key={index}
                  className="bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg text-sm group"
                  style={{ lineHeight: '20px' }}
                >
                  <svg width="8" height="20" style={{ display: 'inline-block', verticalAlign: 'top', marginRight: '8px' }}>
                    <circle cx="4" cy="10" r="4" fill="#34d399" />
                  </svg>
                  <span className="text-slate-700" style={{ verticalAlign: 'top' }}>{opp}</span>
                  {!isExporting && (
                    <button
                      onClick={() => handleRemoveOpportunity(index)}
                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity float-right"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 italic py-2">
                {isExporting ? 'No opportunities identified' : 'No opportunities yet'}
              </div>
            )}
            {/* Add opportunity - hidden during export */}
            {!isExporting && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newOpportunity}
                  onChange={(e) => setNewOpportunity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddOpportunity()}
                  placeholder="Add an opportunity..."
                  className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                />
                <button
                  onClick={handleAddOpportunity}
                  disabled={!newOpportunity.trim()}
                  className="px-3 py-2 bg-slate-700 text-white text-xs font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
