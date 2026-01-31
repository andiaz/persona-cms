// components/sitemap/ScreenNode.js
import { SCREEN_TYPES } from '../../lib/storage';
import ScreenTypeThumbnail from './ScreenTypeThumbnail';

// Status colors
const STATUS_COLORS = {
  planned: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  'in-progress': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  done: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
};

// Screen type border colors
const TYPE_BORDER_COLORS = {
  landing: 'border-blue-400',
  login: 'border-purple-400',
  dashboard: 'border-green-400',
  form: 'border-amber-400',
  table: 'border-slate-400',
  detail: 'border-cyan-400',
  wizard: 'border-indigo-400',
  settings: 'border-gray-400',
  profile: 'border-pink-400',
  pricing: 'border-yellow-400',
  contact: 'border-teal-400',
  error: 'border-red-400',
  search: 'border-orange-400',
  checkout: 'border-emerald-400',
  modal: 'border-violet-400',
  other: 'border-slate-400',
};

export default function ScreenNode({
  screen,
  position,
  width,
  height,
  isSelected,
  onSelect,
  onAddChild,
  isExporting,
  isDimmed,
}) {
  const screenType = SCREEN_TYPES[screen.screenType] || SCREEN_TYPES.other;
  const statusStyle = STATUS_COLORS[screen.status] || STATUS_COLORS.planned;
  const borderColor = TYPE_BORDER_COLORS[screen.screenType] || TYPE_BORDER_COLORS.other;

  return (
    <div
      className="absolute"
      style={{
        left: position.x,
        top: position.y,
        width,
        height: height + 16, // Extra space for button
      }}
    >
      {/* Card container */}
      <div
        className={`rounded-lg border-2 shadow-md transition-all cursor-pointer overflow-hidden bg-white ${borderColor} ${
          isSelected ? 'ring-2 ring-slate-900 ring-offset-2' : 'hover:shadow-lg'
        } ${isDimmed ? 'opacity-30' : ''}`}
        style={{ height }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {/* Thumbnail and type label */}
        <div className="flex items-start gap-2 p-2 pb-1">
        {/* SVG Thumbnail */}
        <div className="flex-shrink-0 rounded overflow-hidden border border-slate-200">
          <ScreenTypeThumbnail type={screen.screenType} size={40} />
        </div>

        {/* Name and type */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-sm truncate">
            {screen.name || 'Untitled Screen'}
          </h3>
          <span className="text-[10px] text-slate-500">
            {screenType.icon} {screenType.label}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="px-2">
        <p className="text-xs text-slate-500 line-clamp-2">
          {screen.description || 'No description'}
        </p>
      </div>

      {/* Bottom row */}
      <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 flex items-center justify-between bg-slate-50/80 border-t border-slate-100">
        {/* Status and release */}
        <div className="flex items-center gap-2">
          {/* Status dot */}
          <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} title={screen.status} />

          {/* Release tag */}
          {screen.release && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded">
              {screen.release}
            </span>
          )}
        </div>

        {/* Persona count */}
        {screen.personaIds?.length > 0 && (
          <span className="text-[10px] text-slate-500">
            {screen.personaIds.length} persona{screen.personaIds.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      </div>

      {/* Add child button - outside card to avoid clipping */}
      {!isExporting && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddChild();
          }}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-7 h-7 bg-slate-800 hover:bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg transition-colors z-10"
          title="Add child screen"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
}
