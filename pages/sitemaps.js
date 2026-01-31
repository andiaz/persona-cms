// pages/sitemaps.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSitemaps, deleteSitemap, duplicateSitemap, addSitemap, SCREEN_TYPES } from '../lib/storage';

// Miniature preview of sitemap tree
function SitemapPreview({ screens }) {
  if (!screens || screens.length === 0) return null;

  // Build tree structure for preview
  const rootScreens = screens.filter(s => !s.parentId);
  const getChildren = (parentId) => screens.filter(s => s.parentId === parentId);

  // Calculate simple layout
  const nodeWidth = 60;
  const nodeHeight = 30;
  const hGap = 15;
  const vGap = 20;

  const positions = new Map();
  let currentX = 10;

  const layoutSubtree = (screenId, depth) => {
    const children = getChildren(screenId).sort((a, b) => a.order - b.order);

    if (children.length === 0) {
      positions.set(screenId, { x: currentX, y: depth * (nodeHeight + vGap) + 10 });
      currentX += nodeWidth + hGap;
      return;
    }

    children.forEach(child => layoutSubtree(child.id, depth + 1));

    const firstChild = positions.get(children[0].id);
    const lastChild = positions.get(children[children.length - 1].id);
    const parentX = (firstChild.x + lastChild.x) / 2;

    positions.set(screenId, { x: parentX, y: depth * (nodeHeight + vGap) + 10 });
  };

  rootScreens.sort((a, b) => a.order - b.order).forEach(root => layoutSubtree(root.id, 0));

  // Calculate bounds
  let maxX = 0, maxY = 0;
  positions.forEach(pos => {
    maxX = Math.max(maxX, pos.x + nodeWidth);
    maxY = Math.max(maxY, pos.y + nodeHeight);
  });

  // Scale to fit preview
  const previewWidth = 280;
  const previewHeight = 100;
  const scale = Math.min(
    previewWidth / (maxX + 20),
    previewHeight / (maxY + 20),
    1
  );

  // Screen type colors
  const typeColors = {
    landing: '#3b82f6',
    login: '#a855f7',
    dashboard: '#22c55e',
    form: '#f59e0b',
    table: '#64748b',
    detail: '#06b6d4',
    wizard: '#6366f1',
    settings: '#6b7280',
    profile: '#ec4899',
    pricing: '#eab308',
    contact: '#14b8a6',
    error: '#ef4444',
    search: '#f97316',
    checkout: '#10b981',
    modal: '#8b5cf6',
    other: '#94a3b8',
  };

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${previewWidth} ${previewHeight}`}
      className="overflow-visible"
    >
      <g transform={`scale(${scale})`}>
        {/* Draw connections */}
        {screens.map(screen => {
          if (!screen.parentId) return null;
          const parentPos = positions.get(screen.parentId);
          const childPos = positions.get(screen.id);
          if (!parentPos || !childPos) return null;

          const startX = parentPos.x + nodeWidth / 2;
          const startY = parentPos.y + nodeHeight;
          const endX = childPos.x + nodeWidth / 2;
          const endY = childPos.y;
          const midY = (startY + endY) / 2;

          return (
            <path
              key={`conn-${screen.id}`}
              d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Draw nodes */}
        {screens.map(screen => {
          const pos = positions.get(screen.id);
          if (!pos) return null;
          const color = typeColors[screen.screenType] || typeColors.other;

          return (
            <g key={screen.id}>
              <rect
                x={pos.x}
                y={pos.y}
                width={nodeWidth}
                height={nodeHeight}
                rx="4"
                fill="white"
                stroke={color}
                strokeWidth="2"
              />
              <rect
                x={pos.x}
                y={pos.y}
                width={nodeWidth}
                height={8}
                rx="4"
                fill={color}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export default function SitemapsPage() {
  const [sitemaps, setSitemaps] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSitemapName, setNewSitemapName] = useState('');
  const router = useRouter();

  useEffect(() => {
    setSitemaps(getSitemaps());
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this site map?')) {
      deleteSitemap(id);
      setSitemaps(getSitemaps());
    }
  };

  const handleDuplicate = (id) => {
    duplicateSitemap(id);
    setSitemaps(getSitemaps());
  };

  const handleCreate = () => {
    if (!newSitemapName.trim()) return;

    const newSitemap = addSitemap({
      name: newSitemapName.trim(),
      viewport: { x: 0, y: 0, zoom: 1 },
      screens: [],
    });

    setShowCreateModal(false);
    setNewSitemapName('');
    router.push(`/sitemap?id=${newSitemap.id}`);
  };

  const getScreenTypeCounts = (screens) => {
    const counts = {};
    screens?.forEach(s => {
      counts[s.screenType] = (counts[s.screenType] || 0) + 1;
    });
    return counts;
  };

  const getStatusCounts = (screens) => {
    const counts = { planned: 0, 'in-progress': 0, done: 0 };
    screens?.forEach(s => {
      if (counts[s.status] !== undefined) counts[s.status]++;
    });
    return counts;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Site Maps</h1>
          <p className="text-sm text-slate-500 mt-1">
            Visual site architecture with hierarchical screen trees
          </p>
        </div>
        <button
          onClick={() => {
            setNewSitemapName(`Site Map ${sitemaps.length + 1}`);
            setShowCreateModal(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
        >
          + New Site Map
        </button>
      </div>

      {/* Sitemaps Grid */}
      {sitemaps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="text-5xl mb-4 opacity-50">🗺️</div>
          <h2 className="text-lg font-semibold text-slate-700 mb-2">
            No Site Maps Yet
          </h2>
          <p className="text-slate-500 mb-6 text-sm max-w-md mx-auto">
            Create a visual site map to plan your website or app architecture with hierarchical screen trees.
          </p>
          <button
            onClick={() => {
              setNewSitemapName('Site Map 1');
              setShowCreateModal(true);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
          >
            Create Site Map
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sitemaps.map((sitemap) => {
            const screenCount = sitemap.screens?.length || 0;
            const statusCounts = getStatusCounts(sitemap.screens);

            return (
              <div
                key={sitemap.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <Link
                    href={`/sitemap?id=${sitemap.id}`}
                    className="text-base font-semibold text-slate-900 hover:text-slate-600 transition-colors"
                  >
                    {sitemap.name}
                  </Link>
                </div>

                {/* Screen count and status */}
                <div className="flex gap-3 text-sm text-slate-500 mb-3">
                  <span>
                    <span className="font-medium text-slate-700">{screenCount}</span> screens
                  </span>
                  {statusCounts.done > 0 && (
                    <span>
                      <span className="font-medium text-green-600">{statusCounts.done}</span> done
                    </span>
                  )}
                  {statusCounts['in-progress'] > 0 && (
                    <span>
                      <span className="font-medium text-amber-600">{statusCounts['in-progress']}</span> in progress
                    </span>
                  )}
                </div>

                {/* Tree Preview */}
                <Link
                  href={`/sitemap?id=${sitemap.id}`}
                  className="block h-28 bg-slate-50 rounded-lg mb-4 border border-slate-100 overflow-hidden relative hover:border-slate-300 transition-colors cursor-pointer group"
                >
                  {screenCount === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-slate-400">Empty site map</span>
                    </div>
                  ) : (
                    <SitemapPreview screens={sitemap.screens} />
                  )}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors flex items-center justify-center">
                    <span className="text-xs font-medium text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-2 py-1 rounded">
                      Click to open
                    </span>
                  </div>
                </Link>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/sitemap?id=${sitemap.id}`}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg text-center hover:bg-slate-900 transition-colors"
                  >
                    Open
                  </Link>
                  <button
                    onClick={() => handleDuplicate(sitemap.id)}
                    className="px-3 py-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm"
                    aria-label="Duplicate site map"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => handleDelete(sitemap.id)}
                    className="px-3 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm"
                    aria-label="Delete site map"
                  >
                    Delete
                  </button>
                </div>

                {/* Updated date */}
                <div className="text-xs text-slate-400 mt-3">
                  Updated: {new Date(sitemap.updatedAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Create Site Map</h2>

            {/* Name input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Site Map Name
              </label>
              <input
                type="text"
                value={newSitemapName}
                onChange={(e) => setNewSitemapName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newSitemapName.trim()) handleCreate();
                  if (e.key === 'Escape') {
                    setShowCreateModal(false);
                    setNewSitemapName('');
                  }
                }}
                placeholder="e.g., E-commerce Website"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                autoFocus
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewSitemapName('');
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newSitemapName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
