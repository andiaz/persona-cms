// components/sitemap/SitemapToolbar.js
import { useState, useEffect, useRef, useMemo } from 'react';
import { getPersonas } from '../../lib/storage';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status', color: null },
  { value: 'planned', label: 'Planned', color: 'bg-slate-400' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-amber-500' },
  { value: 'done', label: 'Done', color: 'bg-green-500' },
];

export default function SitemapToolbar({
  viewport,
  onViewportChange,
  onAddRootScreen,
  screens = [],
  filterStatus,
  onFilterStatusChange,
  filterPersonaId,
  onFilterPersonaIdChange,
  filterRelease,
  onFilterReleaseChange,
}) {
  const [personas, setPersonas] = useState([]);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const [showReleaseDropdown, setShowReleaseDropdown] = useState(false);
  const statusRef = useRef(null);
  const personaRef = useRef(null);
  const releaseRef = useRef(null);

  useEffect(() => {
    setPersonas(getPersonas());
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setShowStatusDropdown(false);
      }
      if (personaRef.current && !personaRef.current.contains(e.target)) {
        setShowPersonaDropdown(false);
      }
      if (releaseRef.current && !releaseRef.current.contains(e.target)) {
        setShowReleaseDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Calculate counts for filters
  const statusCounts = useMemo(() => {
    const counts = { '': screens.length, planned: 0, 'in-progress': 0, done: 0 };
    screens.forEach((s) => {
      if (counts[s.status] !== undefined) counts[s.status]++;
    });
    return counts;
  }, [screens]);

  const personaCounts = useMemo(() => {
    const counts = {};
    screens.forEach((s) => {
      (s.personaIds || []).forEach((pid) => {
        counts[pid] = (counts[pid] || 0) + 1;
      });
    });
    return counts;
  }, [screens]);

  // Get unique release tags
  const releaseTags = useMemo(() => {
    const tags = new Set();
    screens.forEach((s) => {
      if (s.release) tags.add(s.release);
    });
    return Array.from(tags).sort();
  }, [screens]);

  const releaseCounts = useMemo(() => {
    const counts = { '': screens.length, '__none__': 0 };
    screens.forEach((s) => {
      if (s.release) {
        counts[s.release] = (counts[s.release] || 0) + 1;
      } else {
        counts['__none__']++;
      }
    });
    return counts;
  }, [screens]);

  // Count screens with no persona
  const noPersonaCount = useMemo(() => {
    return screens.filter((s) => !s.personaIds || s.personaIds.length === 0).length;
  }, [screens]);

  const handleZoomIn = () => {
    const newZoom = Math.min(2, viewport.zoom + 0.25);
    onViewportChange({ ...viewport, zoom: newZoom });
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(0.25, viewport.zoom - 0.25);
    onViewportChange({ ...viewport, zoom: newZoom });
  };

  const handleResetZoom = () => {
    onViewportChange({ x: 0, y: 0, zoom: 1 });
  };

  const selectedStatus = STATUS_OPTIONS.find((s) => s.value === filterStatus) || STATUS_OPTIONS[0];
  const selectedPersona = filterPersonaId ? personas.find((p) => p.id === filterPersonaId) : null;

  const hasFilters = filterStatus || filterPersonaId || filterRelease;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white rounded-lg border border-slate-200 px-3 py-2">
      {/* Top row on mobile / Left side on desktop */}
      <div className="flex items-center justify-between sm:justify-start gap-2">
        <button
          onClick={onAddRootScreen}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden xs:inline">Add Root Screen</span>
          <span className="xs:hidden">Add</span>
        </button>

        <div className="text-xs text-slate-400">
          {screens.length} screen{screens.length !== 1 ? 's' : ''}
        </div>

        {/* Zoom controls - shown inline on mobile */}
        <div className="flex sm:hidden items-center gap-1 ml-auto">
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
            title="Zoom out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-xs text-slate-600 min-w-[40px] text-center">{Math.round(viewport.zoom * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
            title="Zoom in"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status filter */}
        <div className="relative" ref={statusRef}>
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-colors whitespace-nowrap ${
              filterStatus
                ? 'border-slate-300 bg-slate-50 text-slate-700'
                : 'border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            {selectedStatus.color && (
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedStatus.color}`} />
            )}
            <span>{selectedStatus.label}</span>
            <svg className="w-3 h-3 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showStatusDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 min-w-[160px]">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onFilterStatusChange(option.value);
                    setShowStatusDropdown(false);
                  }}
                  className={`w-full px-3 py-1.5 text-sm text-left hover:bg-slate-50 flex items-center justify-between ${
                    filterStatus === option.value ? 'bg-slate-50 font-medium' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {option.color && (
                      <span className={`w-2 h-2 rounded-full ${option.color}`} />
                    )}
                    {option.label}
                  </span>
                  <span className="text-xs text-slate-400">{statusCounts[option.value]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Release filter */}
        {releaseTags.length > 0 && (
          <div className="relative" ref={releaseRef}>
            <button
              onClick={() => setShowReleaseDropdown(!showReleaseDropdown)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-colors whitespace-nowrap ${
                filterRelease
                  ? 'border-slate-300 bg-slate-50 text-slate-700'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>{filterRelease === '__none__' ? 'No Release' : filterRelease || 'All Releases'}</span>
              <svg className="w-3 h-3 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showReleaseDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 min-w-[140px] max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    onFilterReleaseChange('');
                    setShowReleaseDropdown(false);
                  }}
                  className={`w-full px-3 py-1.5 text-sm text-left hover:bg-slate-50 flex items-center justify-between ${
                    !filterRelease ? 'bg-slate-50 font-medium' : ''
                  }`}
                >
                  <span>All Releases</span>
                  <span className="text-xs text-slate-400">{screens.length}</span>
                </button>
                <button
                  onClick={() => {
                    onFilterReleaseChange('__none__');
                    setShowReleaseDropdown(false);
                  }}
                  className={`w-full px-3 py-1.5 text-sm text-left hover:bg-slate-50 flex items-center justify-between text-slate-500 italic ${
                    filterRelease === '__none__' ? 'bg-slate-50 font-medium' : ''
                  }`}
                >
                  <span>No Release</span>
                  <span className="text-xs text-slate-400">{releaseCounts['__none__']}</span>
                </button>
                {releaseTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      onFilterReleaseChange(tag);
                      setShowReleaseDropdown(false);
                    }}
                    className={`w-full px-3 py-1.5 text-sm text-left hover:bg-slate-50 flex items-center justify-between ${
                      filterRelease === tag ? 'bg-slate-50 font-medium' : ''
                    }`}
                  >
                    <span>{tag}</span>
                    <span className="text-xs text-slate-400">{releaseCounts[tag]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Persona filter */}
        {personas.length > 0 && (
          <div className="relative" ref={personaRef}>
            <button
              onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-colors whitespace-nowrap ${
                filterPersonaId
                  ? 'border-slate-300 bg-slate-50 text-slate-700'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {selectedPersona?.avatarImage ? (
                <img
                  src={selectedPersona.avatarImage}
                  alt={selectedPersona.name}
                  className="w-4 h-4 rounded-full flex-shrink-0"
                />
              ) : selectedPersona ? (
                <span className="w-4 h-4 rounded-full bg-slate-300 text-[8px] flex items-center justify-center text-white flex-shrink-0">
                  {selectedPersona.name?.charAt(0)}
                </span>
              ) : (
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
              <span>{filterPersonaId === '__none__' ? 'No Persona' : selectedPersona?.name || 'All Personas'}</span>
              <svg className="w-3 h-3 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showPersonaDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 min-w-[180px] max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    onFilterPersonaIdChange(null);
                    setShowPersonaDropdown(false);
                  }}
                  className={`w-full px-3 py-1.5 text-sm text-left hover:bg-slate-50 flex items-center justify-between ${
                    !filterPersonaId ? 'bg-slate-50 font-medium' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    All Personas
                  </span>
                  <span className="text-xs text-slate-400">{screens.length}</span>
                </button>
                <button
                  onClick={() => {
                    onFilterPersonaIdChange('__none__');
                    setShowPersonaDropdown(false);
                  }}
                  className={`w-full px-3 py-1.5 text-sm text-left hover:bg-slate-50 flex items-center justify-between text-slate-500 italic ${
                    filterPersonaId === '__none__' ? 'bg-slate-50 font-medium' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    No Persona
                  </span>
                  <span className="text-xs text-slate-400">{noPersonaCount}</span>
                </button>
                {personas.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => {
                      onFilterPersonaIdChange(persona.id);
                      setShowPersonaDropdown(false);
                    }}
                    className={`w-full px-3 py-1.5 text-sm text-left hover:bg-slate-50 flex items-center justify-between ${
                      filterPersonaId === persona.id ? 'bg-slate-50 font-medium' : ''
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      {persona.avatarImage ? (
                        <img
                          src={persona.avatarImage}
                          alt={persona.name}
                          className="w-4 h-4 rounded-full flex-shrink-0"
                        />
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-slate-300 text-[8px] flex items-center justify-center text-white flex-shrink-0">
                          {persona.name?.charAt(0)}
                        </span>
                      )}
                      <span className="truncate">{persona.name}</span>
                    </span>
                    <span className="text-xs text-slate-400 ml-2">{personaCounts[persona.id] || 0}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={() => {
              onFilterStatusChange('');
              onFilterPersonaIdChange(null);
              onFilterReleaseChange('');
            }}
            className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right side - Zoom controls (desktop only) */}
      <div className="hidden sm:flex items-center gap-1">
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
          title="Zoom out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <button
          onClick={handleResetZoom}
          className="px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded transition-colors min-w-[50px] text-center"
          title="Reset zoom"
        >
          {Math.round(viewport.zoom * 100)}%
        </button>

        <button
          onClick={handleZoomIn}
          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
          title="Zoom in"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <div className="w-px h-6 bg-slate-200 mx-2" />

        <span className="text-xs text-slate-400">
          Ctrl+scroll to zoom
        </span>
      </div>
    </div>
  );
}
