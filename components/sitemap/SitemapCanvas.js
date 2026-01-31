// components/sitemap/SitemapCanvas.js
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import ScreenNode from './ScreenNode';
import TreeConnections from './TreeConnections';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 140;
const H_GAP = 60;
const V_GAP = 80;

// Calculate tree layout positions
function layoutTree(screens) {
  const positions = new Map();

  // Get children of a screen, sorted by order
  const getChildren = (parentId) =>
    screens
      .filter((s) => s.parentId === parentId)
      .sort((a, b) => a.order - b.order);

  // Get root screens
  const roots = screens.filter((s) => !s.parentId).sort((a, b) => a.order - b.order);

  // Recursive layout
  const layoutSubtree = (screenId, depth, leftBound) => {
    const children = getChildren(screenId);

    if (children.length === 0) {
      // Leaf node - position at leftBound
      positions.set(screenId, {
        x: leftBound,
        y: depth * (NODE_HEIGHT + V_GAP) + 50,
      });
      return leftBound + NODE_WIDTH + H_GAP;
    }

    // Layout children first
    let childLeft = leftBound;
    children.forEach((child) => {
      childLeft = layoutSubtree(child.id, depth + 1, childLeft);
    });

    // Center parent above children
    const firstChild = positions.get(children[0].id);
    const lastChild = positions.get(children[children.length - 1].id);
    const parentX = (firstChild.x + lastChild.x) / 2;

    positions.set(screenId, {
      x: parentX,
      y: depth * (NODE_HEIGHT + V_GAP) + 50,
    });

    return childLeft;
  };

  // Layout each root tree
  let currentLeft = 50;
  roots.forEach((root) => {
    currentLeft = layoutSubtree(root.id, 0, currentLeft);
  });

  return positions;
}

export default function SitemapCanvas({
  screens,
  viewport,
  onViewportChange,
  selectedId,
  onSelect,
  onAddChild,
  isExporting,
  filterStatus,
  filterPersonaId,
  filterRelease,
}) {
  const containerRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [spacePressed, setSpacePressed] = useState(false);

  // Calculate positions
  const positions = useMemo(() => layoutTree(screens), [screens]);

  // Check if screen matches filters
  const matchesFilter = useCallback((screen) => {
    if (filterStatus && screen.status !== filterStatus) return false;
    if (filterPersonaId) {
      if (filterPersonaId === '__none__') {
        // Filter for screens with no persona
        if (screen.personaIds && screen.personaIds.length > 0) return false;
      } else {
        // Filter for specific persona
        if (!(screen.personaIds || []).includes(filterPersonaId)) return false;
      }
    }
    if (filterRelease) {
      if (filterRelease === '__none__') {
        // Filter for screens with no release
        if (screen.release) return false;
      } else {
        // Filter for specific release
        if (screen.release !== filterRelease) return false;
      }
    }
    return true;
  }, [filterStatus, filterPersonaId, filterRelease]);

  const hasActiveFilters = filterStatus || filterPersonaId || filterRelease;

  // Handle keyboard events for space+drag panning
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.target.closest('textarea, input, select')) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat) {
          setSpacePressed(true);
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setSpacePressed(false);
        setIsPanning(false);
      }
    };

    // Use capture phase to catch space before it triggers scroll
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp, { capture: true });
    };
  }, []);

  // Non-passive wheel event listener for zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (!e.ctrlKey) return;

      e.preventDefault();
      e.stopPropagation();

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const delta = -e.deltaY * 0.001;
      const newZoom = Math.min(2, Math.max(0.25, viewport.zoom + delta));

      const zoomRatio = newZoom / viewport.zoom;
      const newX = mouseX - (mouseX - viewport.x) * zoomRatio;
      const newY = mouseY - (mouseY - viewport.y) * zoomRatio;

      onViewportChange({ x: newX, y: newY, zoom: newZoom });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [viewport, onViewportChange]);

  // Pan start
  const handleMouseDown = useCallback(
    (e) => {
      if (e.button === 1 || (e.button === 0 && spacePressed)) {
        e.preventDefault();
        setIsPanning(true);
        setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
        return;
      }

      // Click on empty canvas - deselect
      if (e.button === 0 && e.target === containerRef.current?.querySelector('.canvas-background')) {
        onSelect(null);
      }
    },
    [spacePressed, viewport.x, viewport.y, onSelect]
  );

  // Pan move
  const handleMouseMove = useCallback(
    (e) => {
      if (isPanning) {
        e.preventDefault();
        const newX = e.clientX - panStart.x;
        const newY = e.clientY - panStart.y;
        onViewportChange({ ...viewport, x: newX, y: newY });
      }
    },
    [isPanning, panStart, viewport, onViewportChange]
  );

  // Pan end
  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
    }
  }, [isPanning]);

  // Calculate canvas bounds for proper sizing
  const bounds = useMemo(() => {
    let maxX = 0;
    let maxY = 0;
    positions.forEach((pos) => {
      maxX = Math.max(maxX, pos.x + NODE_WIDTH);
      maxY = Math.max(maxY, pos.y + NODE_HEIGHT);
    });
    return { width: maxX + 100, height: maxY + 100 };
  }, [positions]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ cursor: isPanning || spacePressed ? 'grabbing' : 'default' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
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
        {/* Connections */}
        <TreeConnections
          screens={screens}
          positions={positions}
          nodeWidth={NODE_WIDTH}
          nodeHeight={NODE_HEIGHT}
        />

        {/* Screen nodes */}
        {screens.map((screen) => {
          const pos = positions.get(screen.id);
          if (!pos) return null;

          const isFilterMatch = matchesFilter(screen);
          const isDimmed = hasActiveFilters && !isFilterMatch;

          return (
            <ScreenNode
              key={screen.id}
              screen={screen}
              position={pos}
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              isSelected={selectedId === screen.id}
              onSelect={() => onSelect(screen.id)}
              onAddChild={() => onAddChild(screen.id)}
              isExporting={isExporting}
              isDimmed={isDimmed}
            />
          );
        })}
      </div>

      {/* Zoom indicator */}
      {!isExporting && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm text-slate-600 shadow-sm border border-slate-200">
          {Math.round(viewport.zoom * 100)}%
        </div>
      )}

      {/* Help hint */}
      {!isExporting && screens.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-slate-400">
            <p className="text-lg mb-2">Click "Add Root Screen" to start</p>
            <p className="text-sm">Ctrl+scroll to zoom, Space+drag or middle-click to pan</p>
          </div>
        </div>
      )}
    </div>
  );
}

export { NODE_WIDTH, NODE_HEIGHT, layoutTree };
