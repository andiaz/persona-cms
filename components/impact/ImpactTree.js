// components/impact/ImpactTree.js
// Horizontal tree visualization for Impact Maps
// Structure: Goal → Actors → Impacts → Deliverables

import { useState, useRef, useEffect } from 'react';

const COLUMN_COLORS = {
  goal: { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-700', label: 'text-slate-500' },
  actor: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: 'text-blue-500' },
  impact: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'text-amber-500' },
  deliverable: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'text-green-500' },
};

const STATUS_COLORS = {
  planned: 'bg-slate-100 text-slate-600',
  'in-progress': 'bg-blue-100 text-blue-600',
  done: 'bg-green-100 text-green-600',
  rejected: 'bg-red-100 text-red-600 line-through',
};

export default function ImpactTree({
  goal,
  nodes,
  personas,
  onUpdateGoal,
  onAddNode,
  onUpdateNode,
  onDeleteNode,
  onReorderNode,
  isExporting = false,
}) {
  const containerRef = useRef(null);
  const treeRef = useRef(null);
  const nodeRefs = useRef({});
  const [connections, setConnections] = useState([]);
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [editingGoal, setEditingGoal] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [recentlyMovedId, setRecentlyMovedId] = useState(null);

  // Get all ancestors of a node (parent chain up to goal)
  const getAncestors = (nodeId) => {
    const ancestors = new Set();
    let current = nodes.find((n) => n.id === nodeId);
    while (current?.parentId) {
      ancestors.add(current.parentId);
      current = nodes.find((n) => n.id === current.parentId);
    }
    return ancestors;
  };

  // Get all descendants of a node (children chain)
  const getDescendants = (nodeId) => {
    const descendants = new Set();
    const findChildren = (parentId) => {
      nodes.forEach((n) => {
        if (n.parentId === parentId) {
          descendants.add(n.id);
          findChildren(n.id);
        }
      });
    };
    findChildren(nodeId);
    return descendants;
  };

  // Check if a node is related to the hovered node
  const isRelatedToHovered = (nodeId) => {
    if (!hoveredNodeId) return true;
    if (nodeId === hoveredNodeId) return true;
    // When goal is hovered, all nodes are related (goal is root)
    if (hoveredNodeId === 'goal') return true;
    if (nodeId === 'goal') {
      // Goal is related if the hovered node is any node (goal connects to all)
      const hoveredNode = nodes.find((n) => n.id === hoveredNodeId);
      return hoveredNode?.type === 'actor' || getAncestors(hoveredNodeId).size > 0 || hoveredNodeId === 'goal';
    }
    const ancestors = getAncestors(hoveredNodeId);
    const descendants = getDescendants(hoveredNodeId);
    return ancestors.has(nodeId) || descendants.has(nodeId);
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 1.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));
  const handleZoomReset = () => setZoom(1);

  // Reorder with animation feedback
  const handleReorderWithAnimation = (nodeId, direction) => {
    setRecentlyMovedId(nodeId);
    onReorderNode(nodeId, direction);
    // Clear animation after it completes
    setTimeout(() => setRecentlyMovedId(null), 400);
  };
  const handleZoomFit = () => {
    if (!containerRef.current || !treeRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const treeWidth = treeRef.current.scrollWidth;
    if (treeWidth > containerWidth) {
      const fitZoom = Math.max((containerWidth - 32) / treeWidth, 0.5);
      setZoom(Math.round(fitZoom * 10) / 10);
    } else {
      setZoom(1);
    }
  };

  // Organize nodes by type
  const actors = nodes.filter((n) => n.type === 'actor').sort((a, b) => a.order - b.order);
  const impacts = nodes.filter((n) => n.type === 'impact').sort((a, b) => a.order - b.order);

  // Get children of a node
  const getChildren = (parentId, type) => {
    return nodes.filter((n) => n.parentId === parentId && n.type === type).sort((a, b) => a.order - b.order);
  };

  // Calculate connection lines
  useEffect(() => {
    const calculateConnections = () => {
      if (!treeRef.current) return;

      const treeRect = treeRef.current.getBoundingClientRect();
      const newConnections = [];

      // Helper to convert screen coordinates to unscaled SVG coordinates
      const toSvgCoord = (screenValue, offset) => (screenValue - offset) / zoom;

      // Goal to Actors connections
      const goalEl = nodeRefs.current['goal'];
      if (goalEl) {
        const goalRect = goalEl.getBoundingClientRect();
        actors.forEach((actor) => {
          const actorEl = nodeRefs.current[actor.id];
          if (actorEl) {
            const actorRect = actorEl.getBoundingClientRect();
            newConnections.push({
              x1: toSvgCoord(goalRect.right, treeRect.left),
              y1: toSvgCoord(goalRect.top + goalRect.height / 2, treeRect.top),
              x2: toSvgCoord(actorRect.left, treeRect.left),
              y2: toSvgCoord(actorRect.top + actorRect.height / 2, treeRect.top),
              color: '#94a3b8',
            });
          }
        });
      }

      // Actor to Impact connections
      actors.forEach((actor) => {
        const actorEl = nodeRefs.current[actor.id];
        if (actorEl) {
          const actorRect = actorEl.getBoundingClientRect();
          const actorImpacts = getChildren(actor.id, 'impact');
          actorImpacts.forEach((impact) => {
            const impactEl = nodeRefs.current[impact.id];
            if (impactEl) {
              const impactRect = impactEl.getBoundingClientRect();
              newConnections.push({
                x1: toSvgCoord(actorRect.right, treeRect.left),
                y1: toSvgCoord(actorRect.top + actorRect.height / 2, treeRect.top),
                x2: toSvgCoord(impactRect.left, treeRect.left),
                y2: toSvgCoord(impactRect.top + impactRect.height / 2, treeRect.top),
                color: '#60a5fa',
              });
            }
          });
        }
      });

      // Impact to Deliverable connections
      impacts.forEach((impact) => {
        const impactEl = nodeRefs.current[impact.id];
        if (impactEl) {
          const impactRect = impactEl.getBoundingClientRect();
          const impactDeliverables = getChildren(impact.id, 'deliverable');
          impactDeliverables.forEach((del) => {
            const delEl = nodeRefs.current[del.id];
            if (delEl) {
              const delRect = delEl.getBoundingClientRect();
              newConnections.push({
                x1: toSvgCoord(impactRect.right, treeRect.left),
                y1: toSvgCoord(impactRect.top + impactRect.height / 2, treeRect.top),
                x2: toSvgCoord(delRect.left, treeRect.left),
                y2: toSvgCoord(delRect.top + delRect.height / 2, treeRect.top),
                color: '#f59e0b',
              });
            }
          });
        }
      });

      setConnections(newConnections);
    };

    const timer = setTimeout(calculateConnections, 100);
    window.addEventListener('resize', calculateConnections);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateConnections);
    };
  }, [nodes, goal, actors, impacts, zoom]);

  // Get persona info for actor
  const getPersonaForActor = (personaId) => {
    return personas?.find((p) => p.id === personaId);
  };

  // Get parent label for display
  const getParentLabel = (parentId, parentType) => {
    const parent = nodes.find((n) => n.id === parentId);
    if (!parent) return '';
    if (parentType === 'actor' && parent.personaId) {
      const persona = getPersonaForActor(parent.personaId);
      return persona ? persona.name : parent.label;
    }
    return parent.label;
  };

  // Render node with reorder controls
  const renderNode = (node, type, siblings) => {
    const colors = COLUMN_COLORS[type];
    const isEditing = editingNodeId === node.id;
    const persona = type === 'actor' ? getPersonaForActor(node.personaId) : null;
    const nodeIndex = siblings.findIndex((s) => s.id === node.id);
    const canMoveUp = nodeIndex > 0;
    const canMoveDown = nodeIndex < siblings.length - 1;
    const isRelated = isRelatedToHovered(node.id);
    const isDimmed = hoveredNodeId && !isRelated;
    const justMoved = recentlyMovedId === node.id;

    return (
      <div
        key={node.id}
        ref={(el) => (nodeRefs.current[node.id] = el)}
        className={`relative p-3 rounded-lg border-2 ${colors.bg} ${colors.border} ${colors.text} ${type === 'deliverable' ? 'min-w-[200px] max-w-[280px]' : 'min-w-[140px] max-w-[180px]'} group transition-all duration-200 ${isDimmed ? 'opacity-30 scale-[0.98]' : 'opacity-100 scale-100'} ${justMoved ? 'animate-pulse ring-2 ring-slate-400 ring-offset-2' : ''}`}
        onMouseEnter={() => !isExporting && setHoveredNodeId(node.id)}
        onMouseLeave={() => !isExporting && setHoveredNodeId(null)}
      >
        {/* Persona avatar for actors - with change option */}
        {persona && (
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-current/20">
            {persona.avatarImage ? (
              <img
                src={persona.avatarImage}
                alt={persona.name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs">
                {persona.name?.charAt(0) || '?'}
              </div>
            )}
            <span className="text-xs font-medium truncate flex-1">{persona.name}</span>
            {/* Change persona button */}
            {!isExporting && (
              <button
                onClick={() => onUpdateNode(node.id, { personaId: null })}
                className="w-4 h-4 text-current/50 hover:text-current opacity-0 group-hover:opacity-100 transition-opacity"
                title="Unlink persona"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Node label with inline status for deliverables */}
        <div className={`flex ${type === 'deliverable' ? 'items-center gap-2 flex-wrap' : 'flex-col'}`}>
          {isEditing && !isExporting ? (
            <input
              type="text"
              defaultValue={node.label}
              autoFocus
              className="flex-1 min-w-0 px-1 py-0.5 text-sm bg-white border rounded focus:ring-2 focus:ring-current/50"
              onBlur={(e) => {
                onUpdateNode(node.id, { label: e.target.value });
                setEditingNodeId(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onUpdateNode(node.id, { label: e.target.value });
                  setEditingNodeId(null);
                }
                if (e.key === 'Escape') setEditingNodeId(null);
              }}
            />
          ) : (
            <p
              className={`text-sm font-medium cursor-pointer hover:underline ${type === 'deliverable' ? 'flex-1 min-w-0' : ''}`}
              onClick={() => !isExporting && setEditingNodeId(node.id)}
            >
              {node.label || 'Click to edit...'}
            </p>
          )}

          {/* Inline status badge for deliverables */}
          {type === 'deliverable' && (
            <select
              value={node.status || 'planned'}
              onChange={(e) => onUpdateNode(node.id, { status: e.target.value })}
              className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[node.status || 'planned']} border-0 cursor-pointer flex-shrink-0`}
              disabled={isExporting}
            >
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
              <option value="rejected">Rejected</option>
            </select>
          )}
        </div>

        {/* Persona selector for actors - show when no persona linked */}
        {type === 'actor' && !persona && !isExporting && (
          <select
            value=""
            onChange={(e) => {
              const personaId = parseInt(e.target.value);
              if (personaId) onUpdateNode(node.id, { personaId });
            }}
            className="mt-2 text-xs w-full px-2 py-1 bg-white border border-current/30 rounded cursor-pointer"
          >
            <option value="">Link persona...</option>
            {personas?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}

        {/* Control buttons - show on hover */}
        {!isExporting && (
          <>
            {/* Delete button */}
            <button
              onClick={() => {
                const childCount = nodes.filter((n) => n.parentId === node.id).length;
                if (childCount > 0) {
                  if (window.confirm(`This will also delete ${childCount} child node(s). Continue?`)) {
                    onDeleteNode(node.id);
                  }
                } else {
                  onDeleteNode(node.id);
                }
              }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>

            {/* Reorder buttons */}
            {siblings.length > 1 && (
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => canMoveUp && handleReorderWithAnimation(node.id, 'up')}
                  disabled={!canMoveUp}
                  className={`w-4 h-4 rounded text-xs flex items-center justify-center ${
                    canMoveUp ? 'bg-slate-600 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => canMoveDown && handleReorderWithAnimation(node.id, 'down')}
                  disabled={!canMoveDown}
                  className={`w-4 h-4 rounded text-xs flex items-center justify-center ${
                    canMoveDown ? 'bg-slate-600 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                  title="Move down"
                >
                  ↓
                </button>
              </div>
            )}

            {/* Add child button */}
            {(type === 'actor' || type === 'impact') && (
              <button
                onClick={() => {
                  const childType = type === 'actor' ? 'impact' : 'deliverable';
                  onAddNode(childType, node.id);
                }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-slate-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-slate-700"
                title={`Add ${type === 'actor' ? 'impact' : 'deliverable'}`}
              >
                +
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  // Render grouped column (impacts grouped by actor, deliverables grouped by impact)
  const renderGroupedColumn = (title, type, parents, parentType) => {
    const colors = COLUMN_COLORS[type];
    const columnWidth = type === 'deliverable' ? 'min-w-[240px]' : 'min-w-[180px]';

    return (
      <div className={`flex flex-col gap-3 ${columnWidth}`}>
        <h3 className={`text-xs font-semibold uppercase tracking-wide ${colors.text} px-1`}>
          {title}
        </h3>
        <div className="flex flex-col gap-4">
          {parents.map((parent) => {
            const children = getChildren(parent.id, type);
            const parentLabel = getParentLabel(parent.id, parentType);

            return (
              <div key={parent.id} className="flex flex-col gap-2">
                {/* Parent label */}
                <div className={`text-xs font-medium ${colors.label} px-1 flex items-center gap-1`}>
                  <span className={`w-2 h-2 rounded-full ${colors.bg} ${colors.border} border`}></span>
                  {parentLabel}
                </div>
                {/* Children */}
                {children.map((child) => renderNode(child, type, children))}
                {/* Add button for this parent */}
                {!isExporting && (
                  <button
                    onClick={() => onAddNode(type, parent.id)}
                    className={`p-1.5 rounded border border-dashed ${colors.border} ${colors.text} text-xs hover:${colors.bg} transition-colors flex items-center justify-center gap-1 opacity-60 hover:opacity-100`}
                  >
                    + Add
                  </button>
                )}
              </div>
            );
          })}
          {/* Show message if no parents */}
          {parents.length === 0 && (
            <div className="text-xs text-slate-400 italic px-1">
              Add {parentType === 'actor' ? 'actors' : 'impacts'} first
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render actors column (no grouping needed)
  const renderActorsColumn = () => {
    const colors = COLUMN_COLORS.actor;

    return (
      <div className="flex flex-col gap-3 min-w-[160px]">
        <h3 className={`text-xs font-semibold uppercase tracking-wide ${colors.text} px-1`}>
          Actors
        </h3>
        <div className="flex flex-col gap-2">
          {actors.map((actor) => renderNode(actor, 'actor', actors))}
          {!isExporting && (
            <button
              onClick={() => onAddNode('actor', null)}
              className={`w-full p-2 rounded-lg border-2 border-dashed ${colors.border} ${colors.text} text-sm hover:${colors.bg} transition-colors flex items-center justify-center gap-1`}
            >
              <span>+</span> Add actor
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Zoom Controls */}
      {!isExporting && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200 shadow-sm px-2 py-1">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded disabled:opacity-40 disabled:cursor-not-allowed"
            title="Zoom out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-xs text-slate-500 min-w-[40px] text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 1.5}
            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded disabled:opacity-40 disabled:cursor-not-allowed"
            title="Zoom in"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <div className="w-px h-5 bg-slate-200 mx-1"></div>
          <button
            onClick={handleZoomFit}
            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded"
            title="Fit to view"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          <button
            onClick={handleZoomReset}
            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded"
            title="Reset zoom"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      )}

      {/* Zoomable Tree Container */}
      <div
        ref={treeRef}
        className="relative origin-top-left transition-transform duration-200"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
      >
        {/* SVG Connection Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        >
          {connections.map((conn, idx) => {
            const midX = (conn.x1 + conn.x2) / 2;
            return (
              <path
                key={idx}
                d={`M ${conn.x1} ${conn.y1} C ${midX} ${conn.y1}, ${midX} ${conn.y2}, ${conn.x2} ${conn.y2}`}
                fill="none"
                stroke={conn.color}
                strokeWidth="2"
                strokeOpacity="0.5"
              />
            );
          })}
        </svg>

        {/* Tree Columns */}
        <div className="relative flex gap-8 p-4" style={{ zIndex: 1 }}>
        {/* Goal Column */}
        <div className="flex flex-col gap-3 min-w-[180px]">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 px-1">
            Goal
          </h3>
          <div
            ref={(el) => (nodeRefs.current['goal'] = el)}
            className={`p-4 rounded-lg border-2 ${COLUMN_COLORS.goal.bg} ${COLUMN_COLORS.goal.border} transition-all duration-200 ${hoveredNodeId && !isRelatedToHovered('goal') ? 'opacity-30 scale-[0.98]' : 'opacity-100 scale-100'}`}
            onMouseEnter={() => !isExporting && setHoveredNodeId('goal')}
            onMouseLeave={() => !isExporting && setHoveredNodeId(null)}
          >
            {editingGoal && !isExporting ? (
              <textarea
                defaultValue={goal}
                autoFocus
                rows={3}
                className="w-full px-2 py-1 text-sm bg-white border rounded focus:ring-2 focus:ring-slate-400 resize-none"
                onBlur={(e) => {
                  onUpdateGoal(e.target.value);
                  setEditingGoal(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setEditingGoal(false);
                }}
              />
            ) : (
              <p
                className="text-sm font-semibold text-slate-700 cursor-pointer hover:underline"
                onClick={() => !isExporting && setEditingGoal(true)}
              >
                {goal || 'Click to set goal...'}
              </p>
            )}
          </div>
        </div>

        {/* Actors Column */}
        {renderActorsColumn()}

        {/* Impacts Column - grouped by actor */}
        {renderGroupedColumn('Impacts', 'impact', actors, 'actor')}

        {/* Deliverables Column - grouped by impact */}
        {renderGroupedColumn('Deliverables', 'deliverable', impacts, 'impact')}
      </div>
      </div>

      {/* Legend */}
      {!isExporting && (
        <div className="mt-4 px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-500">
            <strong>Tip:</strong> Hover nodes to see controls. Use <strong>↑↓</strong> to reorder, <strong>+</strong> to add children, <strong>×</strong> to delete. Use zoom controls (top right) to adjust the view.
          </p>
        </div>
      )}
    </div>
  );
}
