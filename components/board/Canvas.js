// components/board/Canvas.js
import { useState, useRef, useCallback, useEffect } from 'react';
import StickyNote from './StickyNote';
import GroupFrame from './GroupFrame';

export default function Canvas({
  elements,
  viewport,
  onViewportChange,
  onUpdateElement,
  onDeleteElement,
  onAddElement,
  onDuplicateElement,
  onMoveElements,
  selectedId,
  onSelect,
  isExporting,
}) {
  // Helper: check if a note is inside a group's bounds
  const isInsideGroup = useCallback((note, group) => {
    return (
      note.x >= group.x &&
      note.y >= group.y &&
      note.x + (note.width || 150) <= group.x + group.width &&
      note.y + (note.height || 100) <= group.y + group.height
    );
  }, []);

  // Get all notes contained within a group
  const getContainedNotes = useCallback((groupId) => {
    const group = elements.find((el) => el.id === groupId);
    if (!group) return [];

    return elements.filter(
      (el) => el.type === 'note' && isInsideGroup(el, group)
    );
  }, [elements, isInsideGroup]);

  const containerRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [spacePressed, setSpacePressed] = useState(false);

  // Box selection state
  const [isBoxSelecting, setIsBoxSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState(null); // { startX, startY, endX, endY } in screen coords
  const [multiSelectedIds, setMultiSelectedIds] = useState([]); // IDs of multi-selected elements
  const [isMultiDragging, setIsMultiDragging] = useState(false);
  const [multiDragStart, setMultiDragStart] = useState({ x: 0, y: 0 });

  // Handle keyboard events for space+drag panning
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only capture space if not in an input/textarea
      if (e.code === 'Space' && !e.repeat && !e.target.closest('textarea, input')) {
        e.preventDefault();
        setSpacePressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Non-passive wheel event listener for zoom (required to preventDefault browser zoom)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // Only zoom with Ctrl+scroll
      if (!e.ctrlKey) return;

      e.preventDefault();
      e.stopPropagation();

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate zoom
      const delta = -e.deltaY * 0.001;
      const newZoom = Math.min(2, Math.max(0.25, viewport.zoom + delta));

      // Zoom towards mouse position
      const zoomRatio = newZoom / viewport.zoom;
      const newX = mouseX - (mouseX - viewport.x) * zoomRatio;
      const newY = mouseY - (mouseY - viewport.y) * zoomRatio;

      onViewportChange({ x: newX, y: newY, zoom: newZoom });
    };

    // Use non-passive listener to allow preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [viewport, onViewportChange]);

  // Helper: check if element overlaps with selection box (in canvas coords)
  const elementInSelectionBox = useCallback((element, box) => {
    const elWidth = element.width || (element.type === 'note' ? 150 : 400);
    const elHeight = element.height || (element.type === 'note' ? 100 : 300);

    // Normalize box coordinates (handle drag in any direction)
    const boxLeft = Math.min(box.startX, box.endX);
    const boxRight = Math.max(box.startX, box.endX);
    const boxTop = Math.min(box.startY, box.endY);
    const boxBottom = Math.max(box.startY, box.endY);

    // Check overlap
    return !(
      element.x + elWidth < boxLeft ||
      element.x > boxRight ||
      element.y + elHeight < boxTop ||
      element.y > boxBottom
    );
  }, []);

  // Pan/Selection start
  const handleMouseDown = useCallback((e) => {
    // Middle mouse button or space+left click - panning
    if (e.button === 1 || (e.button === 0 && spacePressed)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
      return;
    }

    // Left click on empty canvas - start box selection or deselect
    if (e.button === 0 && e.target === containerRef.current?.querySelector('.canvas-background')) {
      // Clear any existing selection
      onSelect(null);
      setMultiSelectedIds([]);

      // Start box selection
      const rect = containerRef.current.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;

      setIsBoxSelecting(true);
      setSelectionBox({ startX, startY, endX: startX, endY: startY });
    }
  }, [spacePressed, viewport.x, viewport.y, onSelect]);

  // Pan/Selection move
  const handleMouseMove = useCallback((e) => {
    // Handle panning
    if (isPanning) {
      e.preventDefault();
      const newX = e.clientX - panStart.x;
      const newY = e.clientY - panStart.y;
      onViewportChange({ ...viewport, x: newX, y: newY });
      return;
    }

    // Handle box selection
    if (isBoxSelecting && selectionBox) {
      e.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;
      setSelectionBox({ ...selectionBox, endX, endY });
    }

    // Handle multi-element dragging
    if (isMultiDragging && multiSelectedIds.length > 0) {
      e.preventDefault();
      const deltaX = (e.clientX - multiDragStart.x) / viewport.zoom;
      const deltaY = (e.clientY - multiDragStart.y) / viewport.zoom;

      if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
        const updates = multiSelectedIds.map((id) => {
          const el = elements.find((e) => e.id === id);
          if (!el) return null;
          return { id, x: el.x + deltaX, y: el.y + deltaY };
        }).filter(Boolean);

        if (updates.length > 0 && onMoveElements) {
          onMoveElements(updates);
        }
        setMultiDragStart({ x: e.clientX, y: e.clientY });
      }
    }
  }, [isPanning, panStart, viewport, onViewportChange, isBoxSelecting, selectionBox, isMultiDragging, multiSelectedIds, multiDragStart, elements, onMoveElements]);

  // Pan/Selection end
  const handleMouseUp = useCallback(() => {
    // End panning
    if (isPanning) {
      setIsPanning(false);
    }

    // End box selection - determine selected elements
    if (isBoxSelecting && selectionBox) {
      // Convert screen coords to canvas coords
      const canvasBox = {
        startX: (selectionBox.startX - viewport.x) / viewport.zoom,
        startY: (selectionBox.startY - viewport.y) / viewport.zoom,
        endX: (selectionBox.endX - viewport.x) / viewport.zoom,
        endY: (selectionBox.endY - viewport.y) / viewport.zoom,
      };

      // Find elements within selection box
      const selectedElements = elements.filter((el) => elementInSelectionBox(el, canvasBox));
      const selectedIds = selectedElements.map((el) => el.id);

      if (selectedIds.length === 1) {
        // Single element - use normal selection
        onSelect(selectedIds[0]);
        setMultiSelectedIds([]);
      } else if (selectedIds.length > 1) {
        // Multiple elements - use multi-selection
        onSelect(null);
        setMultiSelectedIds(selectedIds);
      }

      setIsBoxSelecting(false);
      setSelectionBox(null);
    }

    // End multi-dragging
    if (isMultiDragging) {
      setIsMultiDragging(false);
    }
  }, [isPanning, isBoxSelecting, selectionBox, viewport, elements, elementInSelectionBox, onSelect, isMultiDragging]);

  // Handle starting multi-drag when clicking a multi-selected element
  const handleMultiDragStart = useCallback((elementId, e) => {
    if (multiSelectedIds.includes(elementId) && multiSelectedIds.length > 1) {
      e.stopPropagation();
      setIsMultiDragging(true);
      setMultiDragStart({ x: e.clientX, y: e.clientY });
      return true; // Indicate we're handling this
    }
    return false;
  }, [multiSelectedIds]);

  // Clear multi-selection when single-selecting
  const handleSingleSelect = useCallback((elementId) => {
    setMultiSelectedIds([]);
    onSelect(elementId);
  }, [onSelect]);

  // Double-click to add note
  const handleDoubleClick = useCallback((e) => {
    if (e.target !== containerRef.current?.querySelector('.canvas-background')) return;

    const rect = containerRef.current.getBoundingClientRect();
    const canvasX = (e.clientX - rect.left - viewport.x) / viewport.zoom;
    const canvasY = (e.clientY - rect.top - viewport.y) / viewport.zoom;

    onAddElement('note', canvasX, canvasY);
  }, [viewport, onAddElement]);

  // Handle drag over (allow drop)
  const handleDragOver = useCallback((e) => {
    if (e.dataTransfer.types.includes('application/board-element')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  }, []);

  // Handle drop from toolbar
  const handleDrop = useCallback((e) => {
    const elementType = e.dataTransfer.getData('application/board-element');
    if (!elementType) return;

    e.preventDefault();

    const rect = containerRef.current.getBoundingClientRect();
    const canvasX = (e.clientX - rect.left - viewport.x) / viewport.zoom;
    const canvasY = (e.clientY - rect.top - viewport.y) / viewport.zoom;

    // Center the element on drop position
    const offsetX = elementType === 'note' ? 75 : 200; // half of default width
    const offsetY = elementType === 'note' ? 50 : 150; // half of default height

    onAddElement(elementType, canvasX - offsetX, canvasY - offsetY);
  }, [viewport, onAddElement]);

  // Sort elements - groups first (lower zIndex), then notes
  const groups = elements.filter((el) => el.type === 'group').sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  const notes = elements.filter((el) => el.type === 'note').sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ cursor: isPanning || spacePressed ? 'grabbing' : 'default' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Canvas background with grid */}
      <div
        className="canvas-background absolute"
        style={{
          width: '10000px',
          height: '10000px',
          left: '-5000px',
          top: '-5000px',
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: '5000px 5000px',
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundColor: '#f8fafc',
        }}
      />

      {/* Elements layer */}
      <div
        className="absolute"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Render groups first (behind notes) */}
        {groups.map((element) => (
          <GroupFrame
            key={element.id}
            element={element}
            isSelected={selectedId === element.id || multiSelectedIds.includes(element.id)}
            isMultiSelected={multiSelectedIds.includes(element.id)}
            onSelect={() => handleSingleSelect(element.id)}
            onUpdate={(updates) => onUpdateElement(element.id, updates)}
            onDelete={() => onDeleteElement(element.id)}
            onDuplicate={() => onDuplicateElement && onDuplicateElement(element.id)}
            onMoveWithContents={(deltaX, deltaY) => {
              // Move the group and all contained notes
              const containedNotes = getContainedNotes(element.id);
              const updates = [
                { id: element.id, x: element.x + deltaX, y: element.y + deltaY },
                ...containedNotes.map((note) => ({
                  id: note.id,
                  x: note.x + deltaX,
                  y: note.y + deltaY,
                })),
              ];
              if (onMoveElements) {
                onMoveElements(updates);
              } else {
                // Fallback: just move the group
                onUpdateElement(element.id, { x: element.x + deltaX, y: element.y + deltaY });
              }
            }}
            onMultiDragStart={(e) => handleMultiDragStart(element.id, e)}
            zoom={viewport.zoom}
            isExporting={isExporting}
          />
        ))}

        {/* Render notes on top */}
        {notes.map((element) => (
          <StickyNote
            key={element.id}
            element={element}
            isSelected={selectedId === element.id || multiSelectedIds.includes(element.id)}
            isMultiSelected={multiSelectedIds.includes(element.id)}
            onSelect={() => handleSingleSelect(element.id)}
            onUpdate={(updates) => onUpdateElement(element.id, updates)}
            onDelete={() => onDeleteElement(element.id)}
            onDuplicate={() => onDuplicateElement && onDuplicateElement(element.id)}
            onMultiDragStart={(e) => handleMultiDragStart(element.id, e)}
            zoom={viewport.zoom}
            isExporting={isExporting}
          />
        ))}
      </div>

      {/* Selection box overlay */}
      {isBoxSelecting && selectionBox && (
        <div
          className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none"
          style={{
            left: Math.min(selectionBox.startX, selectionBox.endX),
            top: Math.min(selectionBox.startY, selectionBox.endY),
            width: Math.abs(selectionBox.endX - selectionBox.startX),
            height: Math.abs(selectionBox.endY - selectionBox.startY),
          }}
        />
      )}

      {/* Zoom indicator */}
      {!isExporting && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm text-slate-600 shadow-sm border border-slate-200">
          {Math.round(viewport.zoom * 100)}%
        </div>
      )}

      {/* Help hint */}
      {!isExporting && elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-slate-400">
            <p className="text-lg mb-2">Double-click to add a note</p>
            <p className="text-sm">Ctrl+scroll to zoom, Space+drag or middle-click to pan</p>
          </div>
        </div>
      )}
    </div>
  );
}
