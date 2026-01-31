// pages/impact-map.js
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import html2canvas from 'html2canvas';
import {
  getImpactMapById,
  updateImpactMap,
  getPersonas,
  createImpactNode,
} from '../lib/storage';
import ImpactTree from '../components/impact/ImpactTree';

// Sample data for test generation
const SAMPLE_ACTORS = [
  'Power Users', 'New Customers', 'Enterprise Clients', 'Mobile Users',
  'Developers', 'Administrators', 'Support Team', 'Partners',
];

const SAMPLE_IMPACTS = [
  'Use product daily', 'Recommend to others', 'Upgrade subscription',
  'Complete onboarding faster', 'Reduce support tickets', 'Share content',
  'Integrate with other tools', 'Automate workflows', 'Collaborate with team',
  'Access on mobile', 'Export data regularly', 'Customize dashboard',
];

const SAMPLE_DELIVERABLES = [
  'Push notifications', 'Email reminders', 'Dashboard redesign',
  'Mobile app', 'API improvements', 'Onboarding wizard',
  'Help documentation', 'Video tutorials', 'Quick start guide',
  'Integration marketplace', 'Export to PDF', 'Team collaboration features',
  'Dark mode', 'Keyboard shortcuts', 'Search improvements',
];

export default function ImpactMapPage() {
  const [impactMap, setImpactMap] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const [mapName, setMapName] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const mapRef = useRef(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const map = getImpactMapById(parseInt(id));
      if (map) {
        setImpactMap(map);
        setMapName(map.name);
      }
      setPersonas(getPersonas());
    }
  }, [id]);

  const saveMap = (updatedMap) => {
    updateImpactMap(updatedMap);
    setImpactMap(updatedMap);
  };

  const handleNameSave = () => {
    if (mapName.trim() && impactMap) {
      saveMap({ ...impactMap, name: mapName.trim() });
    }
    setEditingName(false);
  };

  const handleUpdateGoal = (goal) => {
    if (impactMap) {
      saveMap({ ...impactMap, goal });
    }
  };

  const handleAddNode = (type, parentId) => {
    if (!impactMap) return;

    const existingOfType = impactMap.nodes.filter((n) => n.type === type);
    const label = `New ${type} ${existingOfType.length + 1}`;
    const newNode = createImpactNode(type, label, parentId, existingOfType.length);

    saveMap({
      ...impactMap,
      nodes: [...impactMap.nodes, newNode],
    });
  };

  const handleUpdateNode = (nodeId, updates) => {
    if (!impactMap) return;

    const updatedNodes = impactMap.nodes.map((node) =>
      node.id === nodeId ? { ...node, ...updates } : node
    );
    saveMap({ ...impactMap, nodes: updatedNodes });
  };

  const handleDeleteNode = (nodeId) => {
    if (!impactMap) return;

    // Delete node and all its descendants
    const nodesToDelete = new Set([nodeId]);

    // Find all descendants recursively
    const findDescendants = (parentId) => {
      impactMap.nodes.forEach((node) => {
        if (node.parentId === parentId && !nodesToDelete.has(node.id)) {
          nodesToDelete.add(node.id);
          findDescendants(node.id);
        }
      });
    };
    findDescendants(nodeId);

    const updatedNodes = impactMap.nodes.filter((n) => !nodesToDelete.has(n.id));
    saveMap({ ...impactMap, nodes: updatedNodes });
  };

  const handleReorderNode = (nodeId, direction) => {
    if (!impactMap) return;

    const node = impactMap.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    // Get siblings (same type and parent)
    const siblings = impactMap.nodes
      .filter((n) => n.type === node.type && n.parentId === node.parentId)
      .sort((a, b) => a.order - b.order);

    const currentIndex = siblings.findIndex((s) => s.id === nodeId);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= siblings.length) return;

    const targetNode = siblings[targetIndex];

    // Swap orders
    const updatedNodes = impactMap.nodes.map((n) => {
      if (n.id === nodeId) return { ...n, order: targetNode.order };
      if (n.id === targetNode.id) return { ...n, order: node.order };
      return n;
    });

    saveMap({ ...impactMap, nodes: updatedNodes });
  };

  const handleGenerateTestData = () => {
    if (!impactMap) return;

    const getRandomItems = (arr, count) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const nodes = [];
    let orderCounter = 0;

    // Create 2-3 actors, optionally linking to existing personas
    const numActors = 2 + Math.floor(Math.random() * 2);
    const actorLabels = getRandomItems(SAMPLE_ACTORS, numActors);
    const availablePersonas = [...personas].sort(() => 0.5 - Math.random());

    actorLabels.forEach((label, idx) => {
      const actorId = `actor-${Date.now()}-${idx}`;
      nodes.push({
        id: actorId,
        type: 'actor',
        label,
        parentId: null,
        order: orderCounter++,
        personaId: availablePersonas[idx]?.id || null,
      });

      // Create 1-3 impacts per actor
      const numImpacts = 1 + Math.floor(Math.random() * 3);
      const impactLabels = getRandomItems(SAMPLE_IMPACTS, numImpacts);

      impactLabels.forEach((impactLabel, impactIdx) => {
        const impactId = `impact-${Date.now()}-${idx}-${impactIdx}`;
        nodes.push({
          id: impactId,
          type: 'impact',
          label: impactLabel,
          parentId: actorId,
          order: orderCounter++,
        });

        // Create 1-2 deliverables per impact
        const numDeliverables = 1 + Math.floor(Math.random() * 2);
        const deliverableLabels = getRandomItems(SAMPLE_DELIVERABLES, numDeliverables);
        const statuses = ['planned', 'planned', 'in-progress', 'done'];

        deliverableLabels.forEach((delLabel, delIdx) => {
          nodes.push({
            id: `deliverable-${Date.now()}-${idx}-${impactIdx}-${delIdx}`,
            type: 'deliverable',
            label: delLabel,
            parentId: impactId,
            order: orderCounter++,
            status: statuses[Math.floor(Math.random() * statuses.length)],
          });
        });
      });
    });

    saveMap({ ...impactMap, nodes });
  };

  // Export as PNG
  const handleExportPNG = async () => {
    if (!mapRef.current) return;

    setIsExporting(true);
    setShowExportMenu(false);

    // Wait for state update
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const canvas = await html2canvas(mapRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `${impactMap.name.replace(/\s+/g, '-').toLowerCase()}-impact-map.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }

    setIsExporting(false);
  };

  // Export as Markdown (for Obsidian)
  const handleExportMarkdown = () => {
    if (!impactMap) return;
    setShowExportMenu(false);

    const actors = impactMap.nodes.filter((n) => n.type === 'actor');
    const impacts = impactMap.nodes.filter((n) => n.type === 'impact');
    const deliverables = impactMap.nodes.filter((n) => n.type === 'deliverable');

    let md = `# ${impactMap.name}\n\n`;
    md += `## Goal\n${impactMap.goal}\n\n`;
    md += `---\n\n`;

    actors.forEach((actor) => {
      const persona = personas.find((p) => p.id === actor.personaId);
      md += `## Actor: ${actor.label}`;
      if (persona) md += ` (${persona.name})`;
      md += `\n\n`;

      const actorImpacts = impacts.filter((i) => i.parentId === actor.id);
      actorImpacts.forEach((impact) => {
        md += `### Impact: ${impact.label}\n\n`;

        const impactDeliverables = deliverables.filter((d) => d.parentId === impact.id);
        if (impactDeliverables.length > 0) {
          md += `**Deliverables:**\n`;
          impactDeliverables.forEach((del) => {
            const checkbox = del.status === 'done' ? '[x]' : '[ ]';
            const statusLabel = del.status !== 'planned' ? ` _(${del.status})_` : '';
            md += `- ${checkbox} ${del.label}${statusLabel}\n`;
          });
          md += `\n`;
        }
      });
    });

    md += `---\n\n`;
    md += `_Exported from Persona Lab on ${new Date().toLocaleDateString()}_\n`;

    // Download as file
    const blob = new Blob([md], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.download = `${impactMap.name.replace(/\s+/g, '-').toLowerCase()}-impact-map.md`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (!impactMap) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <p className="text-slate-500">Loading impact map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/impact-maps"
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          {editingName ? (
            <input
              type="text"
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameSave();
                if (e.key === 'Escape') {
                  setMapName(impactMap.name);
                  setEditingName(false);
                }
              }}
              className="text-2xl font-semibold text-slate-900 bg-transparent border-b-2 border-slate-300 focus:border-slate-900 outline-none px-1"
              autoFocus
            />
          ) : (
            <h1
              className="text-2xl font-semibold text-slate-900 cursor-pointer hover:text-slate-700"
              onClick={() => setEditingName(true)}
            >
              {impactMap.name}
            </h1>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Generate Test Data */}
          <button
            onClick={handleGenerateTestData}
            className="hidden sm:block px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Generate sample data"
          >
            Generate Test Data
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="hidden sm:inline">Export</span>
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
            href="/impact-maps"
            className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
          >
            Done
          </Link>
        </div>
      </div>

      {/* Impact Map Content */}
      <div
        ref={mapRef}
        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto"
      >
        <ImpactTree
          goal={impactMap.goal}
          nodes={impactMap.nodes}
          personas={personas}
          onUpdateGoal={handleUpdateGoal}
          onAddNode={handleAddNode}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          onReorderNode={handleReorderNode}
          isExporting={isExporting}
        />
      </div>

      {/* Help Section */}
      <div className="mt-6 bg-slate-50 rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">About Impact Maps</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="inline-block w-3 h-3 rounded bg-slate-300 mr-2"></span>
            <strong>Goal</strong>
            <p className="text-slate-500 mt-1">The business objective you want to achieve</p>
          </div>
          <div>
            <span className="inline-block w-3 h-3 rounded bg-blue-300 mr-2"></span>
            <strong>Actors</strong>
            <p className="text-slate-500 mt-1">People who can influence the goal (link to personas)</p>
          </div>
          <div>
            <span className="inline-block w-3 h-3 rounded bg-amber-300 mr-2"></span>
            <strong>Impacts</strong>
            <p className="text-slate-500 mt-1">Behavior changes needed from actors</p>
          </div>
          <div>
            <span className="inline-block w-3 h-3 rounded bg-green-300 mr-2"></span>
            <strong>Deliverables</strong>
            <p className="text-slate-500 mt-1">Features or outputs to enable impacts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
