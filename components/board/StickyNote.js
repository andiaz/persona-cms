// components/board/StickyNote.js
import { useState, useRef, useEffect, useCallback } from 'react';

const NOTE_COLORS = {
  yellow: { bg: 'bg-yellow-200', border: 'border-yellow-300', shadow: 'shadow-yellow-200/50' },
  pink: { bg: 'bg-pink-200', border: 'border-pink-300', shadow: 'shadow-pink-200/50' },
  blue: { bg: 'bg-blue-200', border: 'border-blue-300', shadow: 'shadow-blue-200/50' },
  green: { bg: 'bg-green-200', border: 'border-green-300', shadow: 'shadow-green-200/50' },
  purple: { bg: 'bg-purple-200', border: 'border-purple-300', shadow: 'shadow-purple-200/50' },
  orange: { bg: 'bg-orange-200', border: 'border-orange-300', shadow: 'shadow-orange-200/50' },
};

export default function StickyNote({
  element,
  isSelected,
  isMultiSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onMultiDragStart,
  zoom,
  isExporting,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const textareaRef = useRef(null);
  const noteRef = useRef(null);

  const colors = NOTE_COLORS[element.color] || NOTE_COLORS.yellow;

  // Focus textarea when editing
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  // Close color picker when clicking outside
  useEffect(() => {
    if (!showColorPicker) return;

    const handleClickOutside = (e) => {
      if (!noteRef.current?.contains(e.target)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColorPicker]);

  // Handle drag start (Alt+drag to duplicate)
  const handleMouseDown = useCallback((e) => {
    if (isEditing || e.target.tagName === 'BUTTON' || e.target.tagName === 'TEXTAREA') return;

    e.stopPropagation();

    // If part of multi-selection, let Canvas handle the drag
    if (isMultiSelected && onMultiDragStart) {
      if (onMultiDragStart(e)) {
        return; // Canvas is handling this drag
      }
    }

    // Alt+drag to duplicate: create copy at current position, then drag original
    if (e.altKey && onDuplicate) {
      onDuplicate(); // Creates a copy at the same position
      // Don't return - continue to drag the original element
    }

    onSelect();

    setIsDragging(true);
    setDragOffset({
      x: e.clientX / zoom - element.x,
      y: e.clientY / zoom - element.y,
    });
  }, [isEditing, element.x, element.y, zoom, onSelect, onDuplicate, isMultiSelected, onMultiDragStart]);

  // Handle drag
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const newX = e.clientX / zoom - dragOffset.x;
      const newY = e.clientY / zoom - dragOffset.y;
      onUpdate({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, zoom, onUpdate]);

  // Handle double-click to edit
  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  // Handle text change
  const handleTextChange = (e) => {
    onUpdate({ content: e.target.value });
  };

  // Handle blur - stop editing
  const handleBlur = () => {
    setIsEditing(false);
  };

  // Handle key events in textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
    // Stop propagation to prevent canvas shortcuts
    e.stopPropagation();
  };

  // Handle color change
  const handleColorChange = (color) => {
    onUpdate({ color });
    setShowColorPicker(false);
  };

  // Determine selection ring style
  const getSelectionRingClass = () => {
    if (isExporting) return '';
    if (isMultiSelected) return 'ring-2 ring-blue-500 ring-offset-2';
    if (isSelected) return 'ring-2 ring-slate-900 ring-offset-2';
    return '';
  };

  return (
    <div
      ref={noteRef}
      className={`absolute select-none ${colors.bg} ${colors.border} border-2 rounded-lg shadow-lg ${colors.shadow} ${getSelectionRingClass()} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        zIndex: element.zIndex || 1,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Note content */}
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={element.content || ''}
          onChange={handleTextChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`w-full h-full p-3 text-sm resize-none focus:outline-none ${colors.bg} rounded-lg`}
          placeholder="Type here..."
        />
      ) : (
        <div className="w-full h-full p-3 text-sm overflow-hidden">
          {element.content || (
            <span className="text-slate-400 italic">Double-click to edit</span>
          )}
        </div>
      )}

      {/* Vote count badge - always show if votes > 0 */}
      {(element.votes || 0) > 0 && (
        <div
          className="absolute -bottom-2 -right-2 min-w-[24px] h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md px-1.5"
          title={`${element.votes} vote${element.votes !== 1 ? 's' : ''}`}
        >
          +{element.votes}
        </div>
      )}

      {/* Action buttons - only show when selected and not exporting */}
      {isSelected && !isExporting && !isEditing && (
        <>
          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-md"
            title="Delete note"
          >
            ×
          </button>

          {/* Color picker button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowColorPicker(!showColorPicker);
            }}
            className="absolute -top-2 -left-2 w-6 h-6 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center text-xs hover:border-slate-400 transition-colors shadow-md"
            title="Change color"
          >
            <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
          </button>

          {/* Vote controls */}
          <div
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white rounded-full shadow-md border border-slate-200 px-1 py-0.5"
            onDoubleClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdate({ votes: Math.max(0, (element.votes || 0) - 1) });
              }}
              className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-full text-sm font-bold"
              title="Remove vote"
            >
              −
            </button>
            <span className="text-xs font-medium text-slate-700 min-w-[20px] text-center">
              {element.votes || 0}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdate({ votes: (element.votes || 0) + 1 });
              }}
              className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-full text-sm font-bold"
              title="Add vote"
            >
              +
            </button>
            {(element.votes || 0) > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate({ votes: 0 });
                }}
                className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full text-xs"
                title="Reset votes"
              >
                ✕
              </button>
            )}
          </div>

          {/* Color picker dropdown */}
          {showColorPicker && (
            <div className="absolute -left-2 top-6 bg-white rounded-lg shadow-lg border border-slate-200 p-2 z-50 flex gap-1">
              {Object.entries(NOTE_COLORS).map(([colorName, colorClasses]) => (
                <button
                  key={colorName}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleColorChange(colorName);
                  }}
                  className={`w-6 h-6 rounded-full ${colorClasses.bg} ${colorClasses.border} border-2 hover:scale-110 transition-transform ${
                    element.color === colorName ? 'ring-2 ring-slate-900 ring-offset-1' : ''
                  }`}
                  title={colorName}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Export colors for use in other components
export { NOTE_COLORS };
