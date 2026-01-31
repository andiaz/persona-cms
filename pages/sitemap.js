// pages/sitemap.js
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import html2canvas from 'html2canvas';
import {
  getSitemapById,
  updateSitemap,
  createScreen,
  SCREEN_TYPES,
  getPersonas,
} from '../lib/storage';
import SitemapCanvas from '../components/sitemap/SitemapCanvas';
import SitemapToolbar from '../components/sitemap/SitemapToolbar';
import ScreenEditor from '../components/sitemap/ScreenEditor';

export default function SitemapPage() {
  const [sitemap, setSitemap] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [sitemapName, setSitemapName] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addParentId, setAddParentId] = useState(null);
  const [newScreenName, setNewScreenName] = useState('');
  const [newScreenType, setNewScreenType] = useState('landing');
  // Filter state
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPersonaId, setFilterPersonaId] = useState(null);
  const [filterRelease, setFilterRelease] = useState('');
  const [editorVisible, setEditorVisible] = useState(false);
  const [closingEditor, setClosingEditor] = useState(false);
  const canvasRef = useRef(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const loadedSitemap = getSitemapById(parseInt(id));
      if (loadedSitemap) {
        setSitemap(loadedSitemap);
        setSitemapName(loadedSitemap.name);
      }
    }
  }, [id]);

  const saveSitemap = useCallback((updatedSitemap) => {
    updateSitemap(updatedSitemap);
    setSitemap(updatedSitemap);
  }, []);

  const handleNameSave = () => {
    if (sitemapName.trim() && sitemap) {
      saveSitemap({ ...sitemap, name: sitemapName.trim() });
    }
    setEditingName(false);
  };

  const handleViewportChange = useCallback(
    (viewport) => {
      if (sitemap) {
        saveSitemap({ ...sitemap, viewport });
      }
    },
    [sitemap, saveSitemap]
  );

  // Add new screen
  const handleAddScreen = (parentId = null) => {
    setAddParentId(parentId);
    const defaultType = 'landing';
    setNewScreenType(defaultType);
    setNewScreenName(SCREEN_TYPES[defaultType]?.label || '');
    setShowAddModal(true);
  };

  // Update name when type changes
  const handleScreenTypeChange = (type) => {
    setNewScreenType(type);
    // Auto-fill name based on type if name is empty or matches previous type label
    const prevTypeLabel = SCREEN_TYPES[newScreenType]?.label || '';
    if (!newScreenName || newScreenName === prevTypeLabel) {
      setNewScreenName(SCREEN_TYPES[type]?.label || '');
    }
  };

  const handleConfirmAddScreen = () => {
    if (!newScreenName.trim() || !sitemap) return;

    // Calculate order (add to end of siblings)
    const siblings = sitemap.screens.filter((s) => s.parentId === addParentId);
    const order = siblings.length;

    const newScreen = createScreen(newScreenName.trim(), newScreenType, addParentId, order);
    const updatedSitemap = {
      ...sitemap,
      screens: [...sitemap.screens, newScreen],
    };
    saveSitemap(updatedSitemap);
    setSelectedId(newScreen.id);
    setShowAddModal(false);
  };

  // Update screen
  const handleUpdateScreen = useCallback(
    (updatedScreen) => {
      if (!sitemap) return;

      const updatedScreens = sitemap.screens.map((s) =>
        s.id === updatedScreen.id ? updatedScreen : s
      );
      saveSitemap({ ...sitemap, screens: updatedScreens });
    },
    [sitemap, saveSitemap]
  );

  // Delete screen (with cascade)
  const handleDeleteScreen = useCallback(
    (screenId) => {
      if (!sitemap) return;

      // Get all descendant IDs
      const getDescendantIds = (parentId) => {
        const ids = [];
        sitemap.screens.forEach((s) => {
          if (s.parentId === parentId) {
            ids.push(s.id);
            ids.push(...getDescendantIds(s.id));
          }
        });
        return ids;
      };

      const descendantIds = getDescendantIds(screenId);
      const idsToDelete = new Set([screenId, ...descendantIds]);

      const childCount = descendantIds.length;
      const confirmMsg =
        childCount > 0
          ? `Delete this screen and ${childCount} child screen${childCount > 1 ? 's' : ''}?`
          : 'Delete this screen?';

      if (window.confirm(confirmMsg)) {
        const updatedScreens = sitemap.screens.filter((s) => !idsToDelete.has(s.id));
        saveSitemap({ ...sitemap, screens: updatedScreens });
        setSelectedId(null);
      }
    },
    [sitemap, saveSitemap]
  );

  // Export as PNG
  const handleExportPNG = async () => {
    if (!canvasRef.current || !sitemap) return;

    setShowExportMenu(false);
    setIsExporting(true);
    setSelectedId(null);

    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      if (sitemap.screens.length === 0) {
        alert('Add some screens before exporting.');
        setIsExporting(false);
        return;
      }

      // Import layout function to calculate positions
      const { layoutTree, NODE_WIDTH, NODE_HEIGHT } = await import(
        '../components/sitemap/SitemapCanvas'
      );
      const positions = layoutTree(sitemap.screens);

      // Calculate bounds
      const padding = 50;
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      positions.forEach((pos) => {
        minX = Math.min(minX, pos.x);
        minY = Math.min(minY, pos.y);
        maxX = Math.max(maxX, pos.x + NODE_WIDTH);
        maxY = Math.max(maxY, pos.y + NODE_HEIGHT);
      });

      const width = maxX - minX + padding * 2;
      const height = maxY - minY + padding * 2;

      // Create temporary container
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = `${width}px`;
      tempContainer.style.height = `${height}px`;
      tempContainer.style.backgroundColor = '#f8fafc';
      tempContainer.style.backgroundImage = `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
      `;
      tempContainer.style.backgroundSize = '40px 40px';
      document.body.appendChild(tempContainer);

      // Draw connections (SVG)
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.style.position = 'absolute';
      svg.style.left = '0';
      svg.style.top = '0';
      svg.style.width = `${width}px`;
      svg.style.height = `${height}px`;
      svg.style.overflow = 'visible';

      sitemap.screens.forEach((screen) => {
        if (!screen.parentId) return;
        const parentPos = positions.get(screen.parentId);
        const childPos = positions.get(screen.id);
        if (!parentPos || !childPos) return;

        const startX = parentPos.x - minX + padding + NODE_WIDTH / 2;
        const startY = parentPos.y - minY + padding + NODE_HEIGHT;
        const endX = childPos.x - minX + padding + NODE_WIDTH / 2;
        const endY = childPos.y - minY + padding;
        const midY = (startY + endY) / 2;

        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute(
          'd',
          `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`
        );
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#94a3b8');
        path.setAttribute('stroke-width', '2');
        svg.appendChild(path);
      });

      tempContainer.appendChild(svg);

      // Screen type header colors
      const typeHeaderColors = {
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

      // Draw screens
      sitemap.screens.forEach((screen) => {
        const pos = positions.get(screen.id);
        if (!pos) return;

        const screenType = SCREEN_TYPES[screen.screenType] || SCREEN_TYPES.other;
        const headerColor = typeHeaderColors[screen.screenType] || typeHeaderColors.other;

        const node = document.createElement('div');
        node.style.cssText = `
          position: absolute;
          left: ${pos.x - minX + padding}px;
          top: ${pos.y - minY + padding}px;
          width: ${NODE_WIDTH}px;
          height: ${NODE_HEIGHT}px;
          background: white;
          border: 2px solid ${headerColor};
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
          height: 24px;
          background: ${headerColor};
          padding: 0 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        `;
        header.innerHTML = `
          <span style="font-size: 12px;">${screenType.icon}</span>
          <span style="font-size: 11px; font-weight: 500; color: white;">${screenType.label}</span>
        `;
        node.appendChild(header);

        // Content
        const content = document.createElement('div');
        content.style.cssText = `
          padding: 8px;
        `;
        content.innerHTML = `
          <div style="font-weight: 600; font-size: 13px; color: #0f172a; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${screen.name || 'Untitled Screen'}
          </div>
          <div style="font-size: 11px; color: #64748b; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${screen.description || 'No description'}
          </div>
        `;
        node.appendChild(content);

        tempContainer.appendChild(node);
      });

      const canvas = await html2canvas(tempContainer, {
        backgroundColor: '#f8fafc',
        scale: 2,
        logging: false,
      });

      document.body.removeChild(tempContainer);

      const link = document.createElement('a');
      link.download = `${sitemap.name.replace(/\s+/g, '-').toLowerCase()}-sitemap.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }

    setIsExporting(false);
  };

  // Export as Markdown
  const handleExportMarkdown = () => {
    if (!sitemap) return;
    setShowExportMenu(false);

    const personas = getPersonas();
    const getPersonaNames = (ids) =>
      ids
        .map((id) => personas.find((p) => p.id === id)?.name)
        .filter(Boolean)
        .join(', ');

    let markdown = `# ${sitemap.name}\n\n`;
    markdown += `*Exported: ${new Date().toLocaleDateString()}*\n\n`;
    markdown += `## Site Structure\n\n`;

    // Build tree structure
    const getChildren = (parentId) =>
      sitemap.screens
        .filter((s) => s.parentId === parentId)
        .sort((a, b) => a.order - b.order);

    const renderScreen = (screen, depth = 0) => {
      const indent = '  '.repeat(depth);
      const prefix = depth === 0 ? '### ' : `${indent}- `;
      const screenType = SCREEN_TYPES[screen.screenType] || SCREEN_TYPES.other;

      let statusIcon = '';
      if (screen.status === 'done') statusIcon = ' ✓';
      else if (screen.status === 'in-progress') statusIcon = ' ⏳';

      let line = `${prefix}${screen.name || 'Untitled'} (${screenType.label})`;
      if (screen.release) line += ` - ${screen.release}`;
      line += statusIcon;
      markdown += line + '\n';

      if (screen.description) {
        markdown += `${indent}${depth === 0 ? '' : '  '}*${screen.description}*\n`;
      }

      if (screen.personaIds?.length > 0) {
        const names = getPersonaNames(screen.personaIds);
        markdown += `${indent}${depth === 0 ? '' : '  '}- **Personas:** ${names}\n`;
      }

      markdown += '\n';

      // Render children
      const children = getChildren(screen.id);
      children.forEach((child) => renderScreen(child, depth + 1));
    };

    const roots = getChildren(null);
    roots.forEach((root) => renderScreen(root));

    // Summary
    const statusCounts = { planned: 0, 'in-progress': 0, done: 0 };
    const releaseCounts = {};
    sitemap.screens.forEach((s) => {
      if (statusCounts[s.status] !== undefined) statusCounts[s.status]++;
      if (s.release) {
        releaseCounts[s.release] = (releaseCounts[s.release] || 0) + 1;
      }
    });

    markdown += `---\n\n`;
    markdown += `## Summary\n\n`;
    markdown += `- **Total screens:** ${sitemap.screens.length}\n`;
    if (statusCounts.done > 0) markdown += `- **Done:** ${statusCounts.done} screens\n`;
    if (statusCounts['in-progress'] > 0)
      markdown += `- **In Progress:** ${statusCounts['in-progress']} screens\n`;
    if (statusCounts.planned > 0) markdown += `- **Planned:** ${statusCounts.planned} screens\n`;

    if (Object.keys(releaseCounts).length > 0) {
      markdown += `\n### By Release\n`;
      Object.entries(releaseCounts)
        .sort()
        .forEach(([release, count]) => {
          markdown += `- **${release}:** ${count} screens\n`;
        });
    }

    // Download
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${sitemap.name.replace(/\s+/g, '-').toLowerCase()}-sitemap.md`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Get selected screen
  const selectedScreen = sitemap?.screens.find((s) => s.id === selectedId) || null;

  // Handle editor visibility with animation
  useEffect(() => {
    if (selectedId) {
      setEditorVisible(true);
      setClosingEditor(false);
    }
  }, [selectedId]);

  const handleCloseEditor = useCallback(() => {
    setClosingEditor(true);
    setTimeout(() => {
      setSelectedId(null);
      setEditorVisible(false);
      setClosingEditor(false);
    }, 200); // Match transition duration
  }, []);

  // Handle selection with animation support
  const handleSelect = useCallback((id) => {
    if (id === null && selectedId) {
      handleCloseEditor();
    } else {
      setSelectedId(id);
    }
  }, [selectedId, handleCloseEditor]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && !e.target.closest('textarea, input')) {
        e.preventDefault();
        handleDeleteScreen(selectedId);
      }
      if (e.key === 'Escape') {
        if (selectedId) {
          handleCloseEditor();
        }
        setShowAddModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, handleDeleteScreen, handleCloseEditor]);

  if (!sitemap) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading site map...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/sitemaps"
            className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          {editingName ? (
            <input
              type="text"
              value={sitemapName}
              onChange={(e) => setSitemapName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameSave();
                if (e.key === 'Escape') {
                  setSitemapName(sitemap.name);
                  setEditingName(false);
                }
              }}
              className="text-base sm:text-lg font-semibold text-slate-900 bg-transparent border-b-2 border-slate-300 focus:border-slate-900 outline-none px-1 min-w-0"
              autoFocus
            />
          ) : (
            <h1
              className="text-base sm:text-lg font-semibold text-slate-900 cursor-pointer hover:text-slate-700 truncate"
              onClick={() => setEditingName(true)}
            >
              {sitemap.name}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="px-2.5 sm:px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                <button
                  onClick={handleExportPNG}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="text-lg">🖼️</span> Export as PNG
                </button>
                <button
                  onClick={handleExportMarkdown}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="text-lg">📝</span> Export as Markdown
                </button>
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    window.print();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="text-lg">🖨️</span> Print / PDF
                </button>
              </div>
            )}
          </div>

          {/* Done Button */}
          <Link
            href="/sitemaps"
            className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
          >
            Done
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2">
        <SitemapToolbar
          viewport={sitemap.viewport}
          onViewportChange={handleViewportChange}
          onAddRootScreen={() => handleAddScreen(null)}
          screens={sitemap.screens}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          filterPersonaId={filterPersonaId}
          onFilterPersonaIdChange={setFilterPersonaId}
          filterRelease={filterRelease}
          onFilterReleaseChange={setFilterRelease}
        />
      </div>

      {/* Main area with canvas and editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div ref={canvasRef} className="flex-1 relative">
          <SitemapCanvas
            screens={sitemap.screens}
            viewport={sitemap.viewport}
            onViewportChange={handleViewportChange}
            selectedId={selectedId}
            onSelect={handleSelect}
            onAddChild={handleAddScreen}
            isExporting={isExporting}
            filterStatus={filterStatus}
            filterPersonaId={filterPersonaId}
            filterRelease={filterRelease}
          />
        </div>

        {/* Editor Panel */}
        {editorVisible && selectedScreen && (
          <ScreenEditor
            screen={selectedScreen}
            screens={sitemap.screens}
            onUpdate={handleUpdateScreen}
            onDelete={() => handleDeleteScreen(selectedId)}
            onClose={handleCloseEditor}
            isVisible={!closingEditor}
          />
        )}
      </div>

      {/* Click outside to close export menu */}
      {showExportMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
      )}

      {/* Add Screen Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Add {addParentId ? 'Child ' : 'Root '}Screen
            </h2>

            {/* Type selection first */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Screen Type
              </label>
              <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1">
                {Object.entries(SCREEN_TYPES).map(([key, type]) => (
                  <button
                    key={key}
                    onClick={() => handleScreenTypeChange(key)}
                    className={`p-2 text-center rounded-lg border-2 transition-colors ${
                      newScreenType === key
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl block mb-1">{type.icon}</span>
                    <span className="text-[10px] text-slate-600 block truncate">
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name input below */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Screen Name
              </label>
              <input
                type="text"
                value={newScreenName}
                onChange={(e) => setNewScreenName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newScreenName.trim()) handleConfirmAddScreen();
                  if (e.key === 'Escape') setShowAddModal(false);
                }}
                placeholder="e.g., Home Page"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
              <p className="text-xs text-slate-400 mt-1">
                Pre-filled based on type. Customize as needed.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddScreen}
                disabled={!newScreenName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Screen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
