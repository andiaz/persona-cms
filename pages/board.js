// pages/board.js
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import html2canvas from 'html2canvas';
import { getBoardById, updateBoard, createBoardElement } from '../lib/storage';
import Canvas from '../components/board/Canvas';
import Toolbar from '../components/board/Toolbar';

export default function BoardPage() {
  const [board, setBoard] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const canvasRef = useRef(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const loadedBoard = getBoardById(parseInt(id));
      if (loadedBoard) {
        setBoard(loadedBoard);
        setBoardName(loadedBoard.name);
      }
    }
  }, [id]);

  const saveBoard = useCallback((updatedBoard) => {
    updateBoard(updatedBoard);
    setBoard(updatedBoard);
  }, []);

  const handleNameSave = () => {
    if (boardName.trim() && board) {
      saveBoard({ ...board, name: boardName.trim() });
    }
    setEditingName(false);
  };

  const handleViewportChange = useCallback((viewport) => {
    if (board) {
      saveBoard({ ...board, viewport });
    }
  }, [board, saveBoard]);

  const handleAddElement = useCallback((type, x, y, options = {}) => {
    if (!board) return;

    // Default position in center of viewport if not specified
    const canvasX = x ?? ((-board.viewport.x + 400) / board.viewport.zoom);
    const canvasY = y ?? ((-board.viewport.y + 300) / board.viewport.zoom);

    const newElement = createBoardElement(type, canvasX, canvasY, {
      ...options,
      zIndex: Math.max(0, ...board.elements.map(e => e.zIndex || 0)) + 1,
    });

    const updatedBoard = {
      ...board,
      elements: [...board.elements, newElement],
    };
    saveBoard(updatedBoard);
    setSelectedId(newElement.id);
  }, [board, saveBoard]);

  const handleUpdateElement = useCallback((elementId, updates) => {
    if (!board) return;

    const updatedElements = board.elements.map((el) =>
      el.id === elementId ? { ...el, ...updates } : el
    );
    saveBoard({ ...board, elements: updatedElements });
  }, [board, saveBoard]);

  const handleDeleteElement = useCallback((elementId) => {
    if (!board) return;

    const updatedElements = board.elements.filter((el) => el.id !== elementId);
    saveBoard({ ...board, elements: updatedElements });
    if (selectedId === elementId) {
      setSelectedId(null);
    }
  }, [board, saveBoard, selectedId]);

  const handleAddNote = () => {
    handleAddElement('note');
  };

  const handleAddGroup = () => {
    handleAddElement('group');
  };

  // Duplicate an element (Alt+drag) - creates copy at same position
  // The original element continues to be dragged to new position
  const handleDuplicateElement = useCallback((elementId) => {
    if (!board) return;

    const element = board.elements.find((el) => el.id === elementId);
    if (!element) return;

    // Create a duplicate at the SAME position (copy stays, original gets dragged)
    const newElement = createBoardElement(element.type, element.x, element.y, {
      ...element,
      zIndex: Math.max(0, ...board.elements.map((e) => e.zIndex || 0)) + 1,
    });

    const updatedBoard = {
      ...board,
      elements: [...board.elements, newElement],
    };
    saveBoard(updatedBoard);
    // Don't change selection - keep dragging the original
  }, [board, saveBoard]);

  // Move multiple elements at once (for group with contents)
  const handleMoveElements = useCallback((updates) => {
    if (!board) return;

    const updatedElements = board.elements.map((el) => {
      const update = updates.find((u) => u.id === el.id);
      if (update) {
        return { ...el, x: update.x, y: update.y };
      }
      return el;
    });
    saveBoard({ ...board, elements: updatedElements });
  }, [board, saveBoard]);

  // Export as PNG
  const handleExportPNG = async () => {
    if (!canvasRef.current || !board) return;

    setShowExportMenu(false);
    setIsExporting(true);
    setSelectedId(null);

    // Wait for state update
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      // Calculate bounds of all elements
      if (board.elements.length === 0) {
        alert('Add some elements before exporting.');
        setIsExporting(false);
        return;
      }

      const padding = 50;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

      // Include both notes and groups in bounds calculation
      board.elements.forEach((el) => {
        if (el.type === 'note' || el.type === 'group') {
          const width = el.width || (el.type === 'note' ? 150 : 400);
          const height = el.height || (el.type === 'note' ? 100 : 300);
          minX = Math.min(minX, el.x);
          minY = Math.min(minY, el.y);
          maxX = Math.max(maxX, el.x + width);
          maxY = Math.max(maxY, el.y + height);
        }
      });

      const width = (maxX - minX + padding * 2);
      const height = (maxY - minY + padding * 2);

      // Create temporary container for export
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

      // Group colors mapping
      const groupColorBg = {
        slate: 'rgba(241, 245, 249, 0.5)',
        blue: 'rgba(239, 246, 255, 0.5)',
        green: 'rgba(240, 253, 244, 0.5)',
        purple: 'rgba(250, 245, 255, 0.5)',
        amber: 'rgba(255, 251, 235, 0.5)',
        rose: 'rgba(255, 241, 242, 0.5)',
      };
      const groupColorBorder = {
        slate: '#cbd5e1',
        blue: '#93c5fd',
        green: '#86efac',
        purple: '#d8b4fe',
        amber: '#fcd34d',
        rose: '#fda4af',
      };
      const groupLabelBg = {
        slate: '#e2e8f0',
        blue: '#bfdbfe',
        green: '#bbf7d0',
        purple: '#e9d5ff',
        amber: '#fde68a',
        rose: '#fecdd3',
      };

      // Render groups first (behind notes)
      board.elements
        .filter((el) => el.type === 'group')
        .forEach((el) => {
          const group = document.createElement('div');
          const color = el.color || 'slate';

          group.style.cssText = `
            position: absolute;
            left: ${el.x - minX + padding}px;
            top: ${el.y - minY + padding}px;
            width: ${el.width || 400}px;
            height: ${el.height || 300}px;
            background-color: ${groupColorBg[color] || groupColorBg.slate};
            border: 2px dashed ${groupColorBorder[color] || groupColorBorder.slate};
            border-radius: 12px;
          `;

          // Add label
          const label = document.createElement('div');
          label.style.cssText = `
            position: absolute;
            top: -10px;
            left: 12px;
            padding: 2px 8px;
            background-color: ${groupLabelBg[color] || groupLabelBg.slate};
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
          `;
          label.textContent = el.label || 'Group';
          group.appendChild(label);

          tempContainer.appendChild(group);
        });

      // Note colors mapping
      const noteColorBg = {
        yellow: '#fef08a',
        pink: '#fbcfe8',
        blue: '#bfdbfe',
        green: '#bbf7d0',
        purple: '#e9d5ff',
        orange: '#fed7aa',
      };

      // Render notes on top
      board.elements
        .filter((el) => el.type === 'note')
        .forEach((el) => {
          const note = document.createElement('div');
          const colorBg = noteColorBg[el.color] || noteColorBg.yellow;

          note.style.cssText = `
            position: absolute;
            left: ${el.x - minX + padding}px;
            top: ${el.y - minY + padding}px;
            width: ${el.width || 150}px;
            height: ${el.height || 100}px;
            background-color: ${colorBg};
            border: 2px solid rgba(0,0,0,0.1);
            border-radius: 8px;
            padding: 12px;
            font-size: 14px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            overflow: visible;
          `;
          // Add text content in a separate div
          const contentDiv = document.createElement('div');
          contentDiv.style.cssText = `
            width: 100%;
            height: 100%;
            overflow: hidden;
            word-wrap: break-word;
          `;
          contentDiv.textContent = el.content || '';
          note.appendChild(contentDiv);

          // Add vote badge if votes > 0
          if (el.votes && el.votes > 0) {
            const voteBadge = document.createElement('div');
            voteBadge.style.cssText = `
              position: absolute;
              bottom: -8px;
              right: -8px;
              min-width: 24px;
              height: 24px;
              background-color: #1e293b;
              color: white;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              font-weight: bold;
              padding: 0 6px;
            `;
            voteBadge.textContent = `+${el.votes}`;
            note.appendChild(voteBadge);
          }

          tempContainer.appendChild(note);
        });

      const canvas = await html2canvas(tempContainer, {
        backgroundColor: '#f8fafc',
        scale: 2,
        logging: false,
      });

      document.body.removeChild(tempContainer);

      const link = document.createElement('a');
      link.download = `${board.name.replace(/\s+/g, '-').toLowerCase()}-board.png`;
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
    if (!board) return;
    setShowExportMenu(false);

    const groups = board.elements.filter((el) => el.type === 'group');
    const notes = board.elements.filter((el) => el.type === 'note');

    // Helper to check if a note is inside a group
    const isInsideGroup = (note, group) => {
      const noteWidth = note.width || 150;
      const noteHeight = note.height || 100;
      return (
        note.x >= group.x &&
        note.y >= group.y &&
        note.x + noteWidth <= group.x + group.width &&
        note.y + noteHeight <= group.y + group.height
      );
    };

    // Find which group a note belongs to (if any)
    const getGroupForNote = (note) => {
      return groups.find((group) => isInsideGroup(note, group));
    };

    // Build markdown
    let markdown = `# ${board.name}\n\n`;

    // Add export date
    markdown += `*Exported: ${new Date().toLocaleDateString()}*\n\n`;

    // Organize notes by group
    const notesByGroup = new Map(); // groupId -> notes[]
    const ungroupedNotes = [];

    notes.forEach((note) => {
      const group = getGroupForNote(note);
      if (group) {
        if (!notesByGroup.has(group.id)) {
          notesByGroup.set(group.id, []);
        }
        notesByGroup.get(group.id).push(note);
      } else {
        ungroupedNotes.push(note);
      }
    });

    // Output grouped notes
    groups.forEach((group) => {
      const groupNotes = notesByGroup.get(group.id) || [];
      markdown += `## ${group.label || 'Untitled Group'}\n\n`;

      if (groupNotes.length === 0) {
        markdown += `*No notes in this group*\n\n`;
      } else {
        // Sort by votes (highest first), then by position
        groupNotes.sort((a, b) => (b.votes || 0) - (a.votes || 0));
        groupNotes.forEach((note) => {
          const content = note.content || '*Empty note*';
          const votes = note.votes || 0;
          if (votes > 0) {
            markdown += `- ${content} **(+${votes} votes)**\n`;
          } else {
            markdown += `- ${content}\n`;
          }
        });
        markdown += '\n';
      }
    });

    // Output ungrouped notes
    if (ungroupedNotes.length > 0) {
      markdown += `## Ungrouped Notes\n\n`;
      ungroupedNotes.sort((a, b) => (b.votes || 0) - (a.votes || 0));
      ungroupedNotes.forEach((note) => {
        const content = note.content || '*Empty note*';
        const votes = note.votes || 0;
        if (votes > 0) {
          markdown += `- ${content} **(+${votes} votes)**\n`;
        } else {
          markdown += `- ${content}\n`;
        }
      });
      markdown += '\n';
    }

    // Add summary
    const totalVotes = notes.reduce((sum, note) => sum + (note.votes || 0), 0);
    markdown += `---\n\n`;
    markdown += `**Summary:** ${notes.length} notes, ${groups.length} groups, ${totalVotes} total votes\n`;

    // Download the markdown file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${board.name.replace(/\s+/g, '-').toLowerCase()}-board.md`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Get selected element
  const selectedElement = board?.elements.find((el) => el.id === selectedId) || null;

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Delete selected element
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && !e.target.closest('textarea, input')) {
        e.preventDefault();
        handleDeleteElement(selectedId);
      }
      // Escape to deselect
      if (e.key === 'Escape') {
        setSelectedId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, handleDeleteElement]);

  if (!board) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading board...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/boards"
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          {editingName ? (
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameSave();
                if (e.key === 'Escape') {
                  setBoardName(board.name);
                  setEditingName(false);
                }
              }}
              className="text-lg font-semibold text-slate-900 bg-transparent border-b-2 border-slate-300 focus:border-slate-900 outline-none px-1"
              autoFocus
            />
          ) : (
            <h1
              className="text-lg font-semibold text-slate-900 cursor-pointer hover:text-slate-700"
              onClick={() => setEditingName(true)}
            >
              {board.name}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {isExporting ? 'Exporting...' : 'Export'}
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
            href="/boards"
            className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
          >
            Done
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2">
        <Toolbar
          viewport={board.viewport}
          onViewportChange={handleViewportChange}
          onAddNote={handleAddNote}
          onAddGroup={handleAddGroup}
          selectedElement={selectedElement}
          onUpdateSelected={(updates) => {
            if (selectedId) {
              handleUpdateElement(selectedId, updates);
            }
          }}
        />
      </div>

      {/* Canvas */}
      <div ref={canvasRef} className="flex-1 relative">
        <Canvas
          elements={board.elements}
          viewport={board.viewport}
          onViewportChange={handleViewportChange}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onAddElement={handleAddElement}
          onDuplicateElement={handleDuplicateElement}
          onMoveElements={handleMoveElements}
          selectedId={selectedId}
          onSelect={setSelectedId}
          isExporting={isExporting}
        />
      </div>

      {/* Click outside to close export menu */}
      {showExportMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </div>
  );
}
