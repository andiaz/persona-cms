// components/board/GroupFrame.js
import { useState, useRef, useEffect, useCallback } from 'react';

const GROUP_COLORS = {
  slate: { bg: 'bg-slate-100/50', border: 'border-slate-300', label: 'bg-slate-200 text-slate-700' },
  blue: { bg: 'bg-blue-50/50', border: 'border-blue-300', label: 'bg-blue-200 text-blue-700' },
  green: { bg: 'bg-green-50/50', border: 'border-green-300', label: 'bg-green-200 text-green-700' },
  purple: { bg: 'bg-purple-50/50', border: 'border-purple-300', label: 'bg-purple-200 text-purple-700' },
  amber: { bg: 'bg-amber-50/50', border: 'border-amber-300', label: 'bg-amber-200 text-amber-700' },
  rose: { bg: 'bg-rose-50/50', border: 'border-rose-300', label: 'bg-rose-200 text-rose-700' },
};

export default function GroupFrame({
  element,
  isSelected,
  isMultiSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveWithContents,
  onMultiDragStart,
  zoom,
  isExporting,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeCorner, setResizeCorner] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const inputRef = useRef(null);
  const groupRef = useRef(null);

  const colors = GROUP_COLORS[element.color] || GROUP_COLORS.slate;

  // Focus input when editing
  useEffect(() => {
    if (isEditingLabel && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingLabel]);

  // Close color picker when clicking outside
  useEffect(() => {
    if (!showColorPicker) return;

    const handleClickOutside = (e) => {
      if (!groupRef.current?.contains(e.target)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColorPicker]);

  // Handle drag start (Alt+drag to duplicate)
  const handleMouseDown = useCallback((e) => {
    if (isEditingLabel || e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
    if (e.target.dataset.resize) return; // Don't drag when clicking resize handle

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
    setDragStartPos({ x: element.x, y: element.y });
    setDragOffset({
      x: e.clientX / zoom - element.x,
      y: e.clientY / zoom - element.y,
    });
  }, [isEditingLabel, element.x, element.y, zoom, onSelect, onDuplicate, isMultiSelected, onMultiDragStart]);

  // Handle resize start
  const handleResizeStart = useCallback((e, corner) => {
    e.stopPropagation();
    onSelect();
    setIsResizing(true);
    setResizeCorner(corner);
    setDragOffset({
      x: e.clientX / zoom,
      y: e.clientY / zoom,
    });
  }, [zoom, onSelect]);

  // Handle drag and resize
  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX / zoom - dragOffset.x;
        const newY = e.clientY / zoom - dragOffset.y;
        const deltaX = newX - dragStartPos.x;
        const deltaY = newY - dragStartPos.y;

        // Move group and its contained elements
        if (onMoveWithContents) {
          onMoveWithContents(deltaX, deltaY);
        } else {
          onUpdate({ x: newX, y: newY });
        }

        setDragStartPos({ x: newX, y: newY });
      } else if (isResizing) {
        const deltaX = e.clientX / zoom - dragOffset.x;
        const deltaY = e.clientY / zoom - dragOffset.y;

        let updates = {};
        const minSize = 100;

        if (resizeCorner.includes('e')) {
          updates.width = Math.max(minSize, element.width + deltaX);
        }
        if (resizeCorner.includes('w')) {
          const newWidth = Math.max(minSize, element.width - deltaX);
          if (newWidth > minSize) {
            updates.x = element.x + deltaX;
            updates.width = newWidth;
          }
        }
        if (resizeCorner.includes('s')) {
          updates.height = Math.max(minSize, element.height + deltaY);
        }
        if (resizeCorner.includes('n')) {
          const newHeight = Math.max(minSize, element.height - deltaY);
          if (newHeight > minSize) {
            updates.y = element.y + deltaY;
            updates.height = newHeight;
          }
        }

        onUpdate(updates);
        setDragOffset({ x: e.clientX / zoom, y: e.clientY / zoom });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeCorner(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, zoom, element, resizeCorner, onUpdate]);

  // Handle label edit
  const handleLabelDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditingLabel(true);
  };

  const handleLabelChange = (e) => {
    onUpdate({ label: e.target.value });
  };

  const handleLabelBlur = () => {
    setIsEditingLabel(false);
  };

  const handleLabelKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setIsEditingLabel(false);
    }
    e.stopPropagation();
  };

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
      ref={groupRef}
      className={`absolute ${colors.bg} ${colors.border} border-2 border-dashed rounded-xl ${getSelectionRingClass()} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        zIndex: element.zIndex || 0,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Label */}
      <div
        className={`absolute -top-3 left-3 px-2 py-0.5 rounded text-sm font-medium ${colors.label}`}
        onDoubleClick={handleLabelDoubleClick}
      >
        {isEditingLabel ? (
          <input
            ref={inputRef}
            type="text"
            value={element.label || ''}
            onChange={handleLabelChange}
            onBlur={handleLabelBlur}
            onKeyDown={handleLabelKeyDown}
            className={`bg-transparent outline-none min-w-[60px] ${colors.label}`}
          />
        ) : (
          element.label || 'Group'
        )}
      </div>

      {/* Action buttons - only show when selected */}
      {isSelected && !isExporting && (
        <>
          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-md z-10"
            title="Delete group"
          >
            ×
          </button>

          {/* Color picker button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowColorPicker(!showColorPicker);
            }}
            className="absolute -top-2 left-[-8px] w-6 h-6 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center hover:border-slate-400 transition-colors shadow-md z-10"
            title="Change color"
          >
            <div className={`w-3 h-3 rounded-full ${colors.bg.replace('/50', '')}`} />
          </button>

          {/* Color picker dropdown */}
          {showColorPicker && (
            <div className="absolute -left-2 top-6 bg-white rounded-lg shadow-lg border border-slate-200 p-2 z-50 flex gap-1">
              {Object.entries(GROUP_COLORS).map(([colorName, colorClasses]) => (
                <button
                  key={colorName}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleColorChange(colorName);
                  }}
                  className={`w-6 h-6 rounded-full ${colorClasses.bg.replace('/50', '')} border-2 ${colorClasses.border} hover:scale-110 transition-transform ${
                    element.color === colorName ? 'ring-2 ring-slate-900 ring-offset-1' : ''
                  }`}
                  title={colorName}
                />
              ))}
            </div>
          )}

          {/* Resize handles */}
          {['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'].map((corner) => {
            const positions = {
              nw: 'top-0 left-0 cursor-nw-resize',
              ne: 'top-0 right-0 cursor-ne-resize',
              sw: 'bottom-0 left-0 cursor-sw-resize',
              se: 'bottom-0 right-0 cursor-se-resize',
              n: 'top-0 left-1/2 -translate-x-1/2 cursor-n-resize',
              s: 'bottom-0 left-1/2 -translate-x-1/2 cursor-s-resize',
              e: 'top-1/2 right-0 -translate-y-1/2 cursor-e-resize',
              w: 'top-1/2 left-0 -translate-y-1/2 cursor-w-resize',
            };

            return (
              <div
                key={corner}
                data-resize={corner}
                className={`absolute w-3 h-3 bg-white border-2 border-slate-400 rounded-sm ${positions[corner]} hover:border-slate-600 hover:bg-slate-100`}
                onMouseDown={(e) => handleResizeStart(e, corner)}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

export { GROUP_COLORS };
