// components/sitemap/ScreenEditor.js
import { useState, useEffect, useRef } from 'react';
import { SCREEN_TYPES, getPersonas } from '../../lib/storage';

const DEFAULT_RELEASE_PRESETS = ['MVP', 'v1.0', 'v2.0', 'v3.0', 'Planned', 'Future'];
const STATUS_OPTIONS = [
  { value: 'planned', label: 'Planned', color: 'bg-slate-400' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-amber-500' },
  { value: 'done', label: 'Done', color: 'bg-green-500' },
];

export default function ScreenEditor({
  screen,
  screens,
  onUpdate,
  onDelete,
  onClose,
  isVisible = true,
}) {
  const [personas, setPersonas] = useState([]);
  const [showReleasePresets, setShowReleasePresets] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    setPersonas(getPersonas());
  }, []);

  // Animate in on mount
  useEffect(() => {
    if (isVisible) {
      // Trigger animation on next frame
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    }
  }, [isVisible]);

  if (!screen) return null;

  // Get available parent options (all screens except self and descendants)
  const getDescendantIds = (screenId) => {
    const ids = new Set();
    const addDescendants = (parentId) => {
      screens.forEach((s) => {
        if (s.parentId === parentId && !ids.has(s.id)) {
          ids.add(s.id);
          addDescendants(s.id);
        }
      });
    };
    addDescendants(screenId);
    return ids;
  };

  const descendantIds = getDescendantIds(screen.id);
  const parentOptions = screens.filter(
    (s) => s.id !== screen.id && !descendantIds.has(s.id)
  );

  // Collect all unique release tags from screens + presets
  const existingTags = [...new Set(screens.map((s) => s.release).filter(Boolean))];
  const allReleaseTags = [...new Set([...existingTags, ...DEFAULT_RELEASE_PRESETS])].sort();

  const handleChange = (field, value) => {
    onUpdate({ ...screen, [field]: value });
  };

  const togglePersona = (personaId) => {
    const currentIds = screen.personaIds || [];
    const newIds = currentIds.includes(personaId)
      ? currentIds.filter((id) => id !== personaId)
      : [...currentIds, personaId];
    handleChange('personaIds', newIds);
  };

  return (
    <div
      ref={panelRef}
      className={`w-80 bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden transform transition-transform duration-200 ease-out ${
        isAnimating ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">Edit Screen</h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content - single scrollable area */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Screen Name
          </label>
          <input
            type="text"
            value={screen.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Home Page"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={screen.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of this screen..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
          />
        </div>

        {/* Screen Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Screen Type
          </label>
          <select
            value={screen.screenType || 'other'}
            onChange={(e) => handleChange('screenType', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          >
            {Object.entries(SCREEN_TYPES).map(([key, type]) => (
              <option key={key} value={key}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Parent Screen */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Parent Screen
          </label>
          <select
            value={screen.parentId || ''}
            onChange={(e) => handleChange('parentId', e.target.value || null)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          >
            <option value="">None (Root Level)</option>
            {parentOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name || 'Untitled Screen'}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleChange('status', option.value)}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border-2 transition-colors ${
                  screen.status === option.value
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={`inline-block w-2 h-2 rounded-full ${option.color} mr-1.5`} />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Release */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Release Tag
          </label>
          <div className="relative">
            <input
              type="text"
              value={screen.release || ''}
              onChange={(e) => handleChange('release', e.target.value)}
              onFocus={() => setShowReleasePresets(true)}
              onBlur={() => setTimeout(() => setShowReleasePresets(false), 200)}
              placeholder="Type or select a release tag"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
            {showReleasePresets && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                {screen.release && !allReleaseTags.includes(screen.release) && (
                  <button
                    onMouseDown={() => handleChange('release', screen.release)}
                    className="w-full px-3 py-2 text-sm text-left text-slate-700 hover:bg-slate-50 flex items-center justify-between border-b border-slate-100"
                  >
                    <span>"{screen.release}"</span>
                    <span className="text-xs text-green-600">New tag</span>
                  </button>
                )}
                {allReleaseTags.map((tag) => {
                  const usageCount = screens.filter((s) => s.release === tag).length;
                  return (
                    <button
                      key={tag}
                      onMouseDown={() => handleChange('release', tag)}
                      className={`w-full px-3 py-2 text-sm text-left hover:bg-slate-50 flex items-center justify-between ${
                        screen.release === tag ? 'bg-slate-50 font-medium' : 'text-slate-700'
                      }`}
                    >
                      <span>{tag}</span>
                      {usageCount > 0 && (
                        <span className="text-xs text-slate-400">{usageCount} screen{usageCount !== 1 ? 's' : ''}</span>
                      )}
                    </button>
                  );
                })}
                {screen.release && (
                  <button
                    onMouseDown={() => handleChange('release', '')}
                    className="w-full px-3 py-2 text-sm text-left text-slate-400 hover:bg-slate-50 border-t border-slate-100"
                  >
                    Clear release tag
                  </button>
                )}
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Type to create a new tag or select existing
          </p>
        </div>

        {/* Personas */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Target Personas
          </label>
          {personas.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No personas created yet</p>
          ) : (
            <div className="border border-slate-200 rounded-lg">
              {personas.map((persona) => (
                <label
                  key={persona.id}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={(screen.personaIds || []).includes(persona.id)}
                    onChange={() => togglePersona(persona.id)}
                    className="w-4 h-4 text-slate-800 rounded border-slate-300 flex-shrink-0"
                  />
                  {persona.avatarImage ? (
                    <img
                      src={persona.avatarImage}
                      alt={persona.name}
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-xs text-white flex-shrink-0">
                      {persona.name?.charAt(0) || '?'}
                    </span>
                  )}
                  <span className="text-sm text-slate-700 truncate">{persona.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Delete button at bottom of scroll area */}
        <div className="pt-4 border-t border-slate-200 mt-4">
          <button
            onClick={onDelete}
            className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            Delete Screen
          </button>
        </div>
      </div>
    </div>
  );
}
