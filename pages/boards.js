// pages/boards.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getBoards, deleteBoard, duplicateBoard, addBoard, createBoardElement } from '../lib/storage';

// Template definitions
const TEMPLATES = {
  blank: {
    name: 'Blank Canvas',
    description: 'Start from scratch',
    icon: '📄',
    generate: () => [],
  },
  crazy8s: {
    name: 'Crazy 8s',
    description: '8 frames for rapid sketching (8 ideas in 8 minutes)',
    icon: '⚡',
    generate: () => {
      const elements = [];
      const frameWidth = 200;
      const frameHeight = 200;
      const gap = 30;
      const startX = 50;
      const startY = 50;

      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 4; col++) {
          const x = startX + col * (frameWidth + gap);
          const y = startY + row * (frameHeight + gap);
          elements.push({
            ...createBoardElement('group', x, y, {
              width: frameWidth,
              height: frameHeight,
              label: `Idea ${row * 4 + col + 1}`,
              color: 'slate',
            }),
            zIndex: 0,
          });
        }
      }
      return elements;
    },
  },
  matrix2x2: {
    name: '2x2 Matrix',
    description: 'Prioritization matrix (Impact vs Effort)',
    icon: '📊',
    generate: () => {
      const elements = [];
      const quadrantWidth = 300;
      const quadrantHeight = 250;
      const gap = 10;
      const startX = 80;
      const startY = 80;

      const labels = [
        { label: 'High Impact / Low Effort', color: 'green' },
        { label: 'High Impact / High Effort', color: 'blue' },
        { label: 'Low Impact / Low Effort', color: 'slate' },
        { label: 'Low Impact / High Effort', color: 'rose' },
      ];

      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
          const idx = row * 2 + col;
          const x = startX + col * (quadrantWidth + gap);
          const y = startY + row * (quadrantHeight + gap);
          elements.push({
            ...createBoardElement('group', x, y, {
              width: quadrantWidth,
              height: quadrantHeight,
              label: labels[idx].label,
              color: labels[idx].color,
            }),
            zIndex: 0,
          });
        }
      }

      // Add axis labels as notes
      elements.push({
        ...createBoardElement('note', startX - 60, startY + quadrantHeight, {
          width: 50,
          height: 80,
          content: '← Low Effort | High Effort →',
          color: 'purple',
        }),
        zIndex: 1,
      });

      return elements;
    },
  },
  affinity: {
    name: 'Affinity Map',
    description: 'Group similar ideas together',
    icon: '🗂️',
    generate: () => {
      const elements = [];
      const groupWidth = 250;
      const groupHeight = 350;
      const gap = 40;
      const startX = 50;
      const startY = 50;

      const categories = [
        { label: 'Category 1', color: 'blue' },
        { label: 'Category 2', color: 'green' },
        { label: 'Category 3', color: 'purple' },
        { label: 'Category 4', color: 'amber' },
      ];

      categories.forEach((cat, idx) => {
        const x = startX + idx * (groupWidth + gap);
        elements.push({
          ...createBoardElement('group', x, startY, {
            width: groupWidth,
            height: groupHeight,
            label: cat.label,
            color: cat.color,
          }),
          zIndex: 0,
        });

        // Add a sample note in each category
        elements.push({
          ...createBoardElement('note', x + 20, startY + 40, {
            width: 120,
            height: 80,
            content: 'Add ideas here',
            color: 'yellow',
          }),
          zIndex: 1,
        });
      });

      return elements;
    },
  },
  taskflow: {
    name: 'Task Flow',
    description: 'Map out user journey steps',
    icon: '🔄',
    generate: () => {
      const elements = [];
      const noteWidth = 150;
      const noteHeight = 100;
      const gap = 80;
      const startX = 100;
      const startY = 150;

      const steps = ['Start', 'Step 1', 'Step 2', 'Step 3', 'End'];
      const colors = ['green', 'yellow', 'yellow', 'yellow', 'blue'];

      steps.forEach((step, idx) => {
        const x = startX + idx * (noteWidth + gap);
        elements.push({
          ...createBoardElement('note', x, startY, {
            width: noteWidth,
            height: noteHeight,
            content: step,
            color: colors[idx],
          }),
          zIndex: 1,
        });
      });

      // Add a group for the whole flow
      elements.push({
        ...createBoardElement('group', startX - 30, startY - 60, {
          width: steps.length * (noteWidth + gap) - gap + 60,
          height: noteHeight + 120,
          label: 'User Flow',
          color: 'slate',
        }),
        zIndex: 0,
      });

      return elements;
    },
  },
  infoarch: {
    name: 'Info Architecture',
    description: 'Organize objects, actions, and relationships',
    icon: '🏗️',
    generate: () => {
      const elements = [];
      const groupWidth = 280;
      const groupHeight = 300;
      const gap = 40;
      const startX = 50;
      const startY = 50;

      // Three main columns: Objects, Actions, Properties
      const columns = [
        { label: 'Objects (Nouns)', color: 'blue', examples: ['User', 'Product', 'Order'] },
        { label: 'Actions (Verbs)', color: 'green', examples: ['Create', 'Edit', 'Delete'] },
        { label: 'Properties', color: 'purple', examples: ['Name', 'Status', 'Date'] },
      ];

      columns.forEach((col, colIdx) => {
        const x = startX + colIdx * (groupWidth + gap);

        // Add group
        elements.push({
          ...createBoardElement('group', x, startY, {
            width: groupWidth,
            height: groupHeight,
            label: col.label,
            color: col.color,
          }),
          zIndex: 0,
        });

        // Add example notes
        col.examples.forEach((example, noteIdx) => {
          elements.push({
            ...createBoardElement('note', x + 20, startY + 40 + noteIdx * 85, {
              width: 120,
              height: 70,
              content: example,
              color: 'yellow',
            }),
            zIndex: 1,
          });
        });
      });

      // Add a relationships section below
      elements.push({
        ...createBoardElement('group', startX, startY + groupHeight + gap, {
          width: 3 * groupWidth + 2 * gap,
          height: 150,
          label: 'Relationships & Rules',
          color: 'amber',
        }),
        zIndex: 0,
      });

      // Add example relationship notes
      const relationships = [
        'User can create Order',
        'Order has many Products',
        'Product has Status',
      ];
      relationships.forEach((rel, idx) => {
        elements.push({
          ...createBoardElement('note', startX + 20 + idx * 300, startY + groupHeight + gap + 40, {
            width: 180,
            height: 80,
            content: rel,
            color: 'orange',
          }),
          zIndex: 1,
        });
      });

      return elements;
    },
  },
};

// Miniature preview of board elements
function BoardPreview({ elements }) {
  if (!elements || elements.length === 0) return null;

  // Calculate bounds of all elements
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  elements.forEach((el) => {
    const width = el.width || (el.type === 'note' ? 150 : 400);
    const height = el.height || (el.type === 'note' ? 100 : 300);
    minX = Math.min(minX, el.x);
    minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + width);
    maxY = Math.max(maxY, el.y + height);
  });

  const contentWidth = maxX - minX;
  const contentHeight = maxY - minY;

  // Calculate scale to fit in preview (with padding)
  const previewWidth = 280;
  const previewHeight = 100;
  const padding = 8;
  const scale = Math.min(
    (previewWidth - padding * 2) / contentWidth,
    (previewHeight - padding * 2) / contentHeight,
    0.3 // Max scale to keep things small
  );

  // Note color mapping
  const noteColors = {
    yellow: '#fef08a',
    pink: '#fbcfe8',
    blue: '#bfdbfe',
    green: '#bbf7d0',
    purple: '#e9d5ff',
    orange: '#fed7aa',
  };

  // Group color mapping
  const groupColors = {
    slate: { bg: 'rgba(241, 245, 249, 0.7)', border: '#cbd5e1' },
    blue: { bg: 'rgba(239, 246, 255, 0.7)', border: '#93c5fd' },
    green: { bg: 'rgba(240, 253, 244, 0.7)', border: '#86efac' },
    purple: { bg: 'rgba(250, 245, 255, 0.7)', border: '#d8b4fe' },
    amber: { bg: 'rgba(255, 251, 235, 0.7)', border: '#fcd34d' },
    rose: { bg: 'rgba(255, 241, 242, 0.7)', border: '#fda4af' },
  };

  // Sort: groups first (behind), then notes
  const sortedElements = [...elements].sort((a, b) => {
    if (a.type === 'group' && b.type !== 'group') return -1;
    if (a.type !== 'group' && b.type === 'group') return 1;
    return (a.zIndex || 0) - (b.zIndex || 0);
  });

  return (
    <div
      className="absolute"
      style={{
        left: padding,
        top: padding,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      {sortedElements.map((el) => {
        const x = el.x - minX;
        const y = el.y - minY;
        const width = el.width || (el.type === 'note' ? 150 : 400);
        const height = el.height || (el.type === 'note' ? 100 : 300);

        if (el.type === 'group') {
          const colors = groupColors[el.color] || groupColors.slate;
          return (
            <div
              key={el.id}
              className="absolute rounded"
              style={{
                left: x,
                top: y,
                width,
                height,
                backgroundColor: colors.bg,
                border: `1px dashed ${colors.border}`,
              }}
            />
          );
        }

        if (el.type === 'note') {
          const bgColor = noteColors[el.color] || noteColors.yellow;
          return (
            <div
              key={el.id}
              className="absolute rounded shadow-sm"
              style={{
                left: x,
                top: y,
                width,
                height,
                backgroundColor: bgColor,
                border: '1px solid rgba(0,0,0,0.1)',
              }}
            >
              {/* Vote badge in preview */}
              {el.votes > 0 && (
                <div
                  className="absolute -bottom-1 -right-1 bg-slate-800 text-white rounded-full text-[8px] font-bold flex items-center justify-center"
                  style={{ width: 14, height: 14 }}
                >
                  {el.votes}
                </div>
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

export default function BoardsPage() {
  const [boards, setBoards] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const router = useRouter();

  useEffect(() => {
    setBoards(getBoards());
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      deleteBoard(id);
      setBoards(getBoards());
    }
  };

  const handleDuplicate = (id) => {
    duplicateBoard(id);
    setBoards(getBoards());
  };

  const handleCreate = () => {
    if (!newBoardName.trim()) return;

    const template = TEMPLATES[selectedTemplate];
    const elements = template.generate();

    const newBoard = addBoard({
      name: newBoardName.trim(),
      template: selectedTemplate === 'blank' ? null : selectedTemplate,
      viewport: { x: 0, y: 0, zoom: 1 },
      elements,
    });

    setShowCreateModal(false);
    setNewBoardName('');
    setSelectedTemplate('blank');
    router.push(`/board?id=${newBoard.id}`);
  };

  const getElementCounts = (elements) => {
    const counts = { notes: 0, groups: 0, connectors: 0, votes: 0 };
    elements?.forEach((el) => {
      if (el.type === 'note') {
        counts.notes++;
        counts.votes += el.votes || 0;
      } else if (el.type === 'group') counts.groups++;
      else if (el.type === 'connector') counts.connectors++;
    });
    return counts;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Sprint Boards</h1>
          <p className="text-sm text-slate-500 mt-1">
            Infinite canvas for brainstorming, ideation, and design sprints
          </p>
        </div>
        <button
          onClick={() => {
            setNewBoardName(`Board ${boards.length + 1}`);
            setSelectedTemplate('blank');
            setShowCreateModal(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors self-start sm:self-auto"
        >
          + New Board
        </button>
      </div>

      {/* Boards Grid */}
      {boards.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="text-5xl mb-4 opacity-50">📋</div>
          <h2 className="text-lg font-semibold text-slate-700 mb-2">
            No Boards Yet
          </h2>
          <p className="text-slate-500 mb-6 text-sm max-w-md mx-auto">
            Create an infinite canvas board for brainstorming sessions, affinity mapping, crazy 8s, or any collaborative exercise.
          </p>
          <button
            onClick={() => {
              setNewBoardName('Board 1');
              setSelectedTemplate('blank');
              setShowCreateModal(true);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
          >
            Create Board
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => {
            const counts = getElementCounts(board.elements);
            const totalElements = counts.notes + counts.groups + counts.connectors;

            return (
              <div
                key={board.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <Link
                    href={`/board?id=${board.id}`}
                    className="text-base font-semibold text-slate-900 hover:text-slate-600 transition-colors"
                  >
                    {board.name}
                  </Link>
                  {board.template && TEMPLATES[board.template] && (
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                      {TEMPLATES[board.template].icon} {TEMPLATES[board.template].name}
                    </span>
                  )}
                </div>

                {/* Element counts */}
                <div className="flex gap-3 text-sm text-slate-500 mb-4">
                  <span>
                    <span className="font-medium text-yellow-600">{counts.notes}</span> notes
                  </span>
                  {counts.groups > 0 && (
                    <span>
                      <span className="font-medium text-blue-600">{counts.groups}</span> groups
                    </span>
                  )}
                  {counts.connectors > 0 && (
                    <span>
                      <span className="font-medium text-slate-600">{counts.connectors}</span> connectors
                    </span>
                  )}
                  {counts.votes > 0 && (
                    <span>
                      <span className="font-medium text-slate-800">{counts.votes}</span> votes
                    </span>
                  )}
                </div>

                {/* Miniature Canvas Preview */}
                <Link
                  href={`/board?id=${board.id}`}
                  className="block h-28 bg-slate-50 rounded-lg mb-4 border border-slate-100 overflow-hidden relative hover:border-slate-300 transition-colors cursor-pointer group"
                >
                  {totalElements === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-slate-400">Empty canvas</span>
                    </div>
                  ) : (
                    <BoardPreview elements={board.elements} />
                  )}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors flex items-center justify-center">
                    <span className="text-xs font-medium text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-2 py-1 rounded">
                      Click to open
                    </span>
                  </div>
                </Link>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/board?id=${board.id}`}
                    className="flex-1 min-w-[80px] px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg text-center hover:bg-slate-900 transition-colors"
                  >
                    Open
                  </Link>
                  <button
                    onClick={() => handleDuplicate(board.id)}
                    className="hidden sm:block px-3 py-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm"
                    aria-label="Duplicate board"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => handleDelete(board.id)}
                    className="px-3 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm"
                    aria-label="Delete board"
                  >
                    Delete
                  </button>
                </div>

                {/* Updated date */}
                <div className="text-xs text-slate-400 mt-3">
                  Updated: {new Date(board.updatedAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Create Board</h2>

            {/* Name input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Board Name
              </label>
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newBoardName.trim()) handleCreate();
                  if (e.key === 'Escape') {
                    setShowCreateModal(false);
                    setNewBoardName('');
                    setSelectedTemplate('blank');
                  }
                }}
                placeholder="e.g., Sprint 1 Ideation"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                autoFocus
              />
            </div>

            {/* Template Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start from template
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(TEMPLATES).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`p-3 text-left rounded-lg border-2 transition-colors ${
                      selectedTemplate === key
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{template.icon}</span>
                      <span className="text-sm font-medium text-slate-900">{template.name}</span>
                    </div>
                    <p className="text-xs text-slate-500">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewBoardName('');
                  setSelectedTemplate('blank');
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newBoardName.trim()}
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
