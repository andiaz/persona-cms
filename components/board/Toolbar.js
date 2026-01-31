// components/board/Toolbar.js
import { NOTE_COLORS } from './StickyNote';
import { GROUP_COLORS } from './GroupFrame';

export default function Toolbar({
  viewport,
  onViewportChange,
  onAddNote,
  onAddGroup,
  selectedElement,
  onUpdateSelected,
}) {
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

  const handleColorChange = (color) => {
    if (selectedElement) {
      onUpdateSelected({ color });
    }
  };

  // Handle drag start for toolbar items
  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('application/board-element', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-lg shadow-sm border border-slate-200 p-1.5 sm:p-2 flex-wrap sm:flex-nowrap">
      {/* Add Note Button - draggable */}
      <button
        onClick={onAddNote}
        draggable
        onDragStart={(e) => handleDragStart(e, 'note')}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-sm font-medium text-slate-700 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors cursor-grab active:cursor-grabbing"
        title="Click to add, or drag to canvas"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="hidden sm:inline">Note</span>
      </button>

      {/* Add Group Button - draggable */}
      <button
        onClick={onAddGroup}
        draggable
        onDragStart={(e) => handleDragStart(e, 'group')}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-grab active:cursor-grabbing"
        title="Click to add, or drag to canvas"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
        </svg>
        <span className="hidden sm:inline">Group</span>
      </button>

      {/* Divider */}
      <div className="w-px h-8 bg-slate-200 hidden sm:block" />

      {/* Color Picker - show for notes */}
      {selectedElement && selectedElement.type === 'note' && (
        <>
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-xs text-slate-500 mr-1">Color:</span>
            {Object.entries(NOTE_COLORS).map(([colorName, colorClasses]) => (
              <button
                key={colorName}
                onClick={() => handleColorChange(colorName)}
                className={`w-6 h-6 rounded-full ${colorClasses.bg} ${colorClasses.border} border hover:scale-110 transition-transform ${
                  selectedElement.color === colorName ? 'ring-2 ring-slate-900 ring-offset-1' : ''
                }`}
                title={colorName}
              />
            ))}
          </div>
          <div className="w-px h-8 bg-slate-200 hidden sm:block" />
        </>
      )}

      {/* Color Picker - show for groups */}
      {selectedElement && selectedElement.type === 'group' && (
        <>
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-xs text-slate-500 mr-1">Color:</span>
            {Object.entries(GROUP_COLORS).map(([colorName, colorClasses]) => (
              <button
                key={colorName}
                onClick={() => handleColorChange(colorName)}
                className={`w-6 h-6 rounded-full ${colorClasses.bg.replace('/50', '')} ${colorClasses.border} border hover:scale-110 transition-transform ${
                  selectedElement.color === colorName ? 'ring-2 ring-slate-900 ring-offset-1' : ''
                }`}
                title={colorName}
              />
            ))}
          </div>
          <div className="w-px h-8 bg-slate-200 hidden sm:block" />
        </>
      )}

      {/* Zoom Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Zoom out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <button
          onClick={handleResetZoom}
          className="px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors min-w-[50px]"
          title="Reset zoom and position"
        >
          {Math.round(viewport.zoom * 100)}%
        </button>

        <button
          onClick={handleZoomIn}
          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Zoom in"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Keyboard shortcuts help */}
      <div className="ml-auto text-xs text-slate-400 hidden sm:block">
        <span className="mr-2">Ctrl+scroll: zoom</span>
        <span>Space+drag: pan</span>
      </div>
    </div>
  );
}
