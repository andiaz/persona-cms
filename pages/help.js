// pages/help.js
import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Help & Documentation</h1>
        <p className="text-slate-500 mt-1">
          Learn how to use Persona Lab for UX research and planning
        </p>
      </div>

      {/* Quick Start */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Quick Start</h2>
        <p className="text-slate-600 mb-4">
          Persona Lab is a local-first tool for UX research and product planning. All your data is stored
          in your browser - no account required. Use the <strong>Data</strong> menu in the header to
          export your work for backup or transfer between devices.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
            Start with Personas
          </Link>
          <Link href="/journey-maps" className="px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors">
            Create a Journey Map
          </Link>
        </div>
      </section>

      {/* Features */}
      <div className="space-y-6">
        {/* Personas */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl">
              <span role="img" aria-label="persona">👤</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Personas</h2>
          </div>
          <p className="text-slate-600 mb-4">
            Create detailed user personas to represent your target audience. Each persona captures
            goals, pain points, tasks, context of use, and required functionality.
          </p>
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Key Features</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li><strong>Avatar generation</strong> - Auto-generate avatars based on persona names</li>
              <li><strong>Tags</strong> - Organize personas with custom tags for filtering</li>
              <li><strong>Priority levels</strong> - Mark importance (Critical, High, Medium, Low)</li>
              <li><strong>Sample data</strong> - Use "Pre-fill Sample Data" to quickly test</li>
            </ul>
          </div>
        </section>

        {/* Journey Maps */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-xl">
              <span role="img" aria-label="journey">🗺️</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Journey Maps</h2>
          </div>
          <p className="text-slate-600 mb-4">
            Map customer experiences across multiple stages. Capture touchpoints, emotions,
            pain points, and opportunities at each step of the journey.
          </p>
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Key Features</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li><strong>Stages</strong> - Define journey stages (Awareness, Consideration, etc.)</li>
              <li><strong>Touchpoints</strong> - Document user interactions at each stage</li>
              <li><strong>Emotions</strong> - Track emotional highs and lows</li>
              <li><strong>Pain points & opportunities</strong> - Identify problems and solutions</li>
              <li><strong>Persona links</strong> - Connect journeys to specific personas</li>
            </ul>
          </div>
        </section>

        {/* Impact Maps */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-xl">
              <span role="img" aria-label="impact">🎯</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Impact Maps</h2>
          </div>
          <p className="text-slate-600 mb-4">
            Plan features based on desired user impacts using the Goal → Actors → Impacts → Deliverables
            framework. Connect actors to your personas for integrated planning.
          </p>
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Structure</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="inline-block w-3 h-3 rounded bg-slate-300 mr-2"></span>
                <strong>Goal</strong>
                <p className="text-slate-500 text-xs mt-1">Business objective</p>
              </div>
              <div>
                <span className="inline-block w-3 h-3 rounded bg-blue-300 mr-2"></span>
                <strong>Actors</strong>
                <p className="text-slate-500 text-xs mt-1">Who can help achieve it</p>
              </div>
              <div>
                <span className="inline-block w-3 h-3 rounded bg-amber-300 mr-2"></span>
                <strong>Impacts</strong>
                <p className="text-slate-500 text-xs mt-1">Behavior changes needed</p>
              </div>
              <div>
                <span className="inline-block w-3 h-3 rounded bg-green-300 mr-2"></span>
                <strong>Deliverables</strong>
                <p className="text-slate-500 text-xs mt-1">Features to build</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sprint Board */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-xl">
              <span role="img" aria-label="board">📋</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Sprint Board</h2>
          </div>
          <p className="text-slate-600 mb-4">
            A freeform canvas for brainstorming and planning with sticky notes and groups.
            Perfect for design thinking sessions and collaborative ideation.
          </p>
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Key Features</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li><strong>Sticky notes</strong> - Add colorful notes anywhere on the canvas</li>
              <li><strong>Groups</strong> - Organize notes into labeled groups</li>
              <li><strong>Pan & zoom</strong> - Navigate large boards easily</li>
              <li><strong>Drag to add</strong> - Drag items from toolbar to canvas</li>
            </ul>
          </div>
        </section>

        {/* Site Maps */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center text-xl">
              <span role="img" aria-label="sitemap">🌐</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Site Maps</h2>
          </div>
          <p className="text-slate-600 mb-4">
            Create visual site/app architecture with hierarchical screen trees. Define screen types,
            track release status, and link screens to personas.
          </p>
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Key Features</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li><strong>Screen types</strong> - Landing, Login, Dashboard, Form, Table, etc.</li>
              <li><strong>Hierarchy</strong> - Build parent-child relationships</li>
              <li><strong>Release tags</strong> - Track MVP, v1.0, v2.0, etc.</li>
              <li><strong>Status</strong> - Mark screens as Planned, In Progress, or Done</li>
              <li><strong>Persona links</strong> - Connect screens to specific personas</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Data Management */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 mt-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Data Management</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Local Storage</h3>
            <p className="text-sm text-slate-600">
              All data is stored in your browser's local storage. No server, no account required.
              Your data stays private and works offline.
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Backup & Restore</h3>
            <p className="text-sm text-slate-600">
              Use <strong>Data → Export All Data</strong> in the header to download a JSON backup.
              Import the file later to restore or transfer to another device.
            </p>
          </div>
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 mt-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Keyboard Shortcuts</h2>
        <p className="text-sm text-slate-500 mb-4">Available on canvas views (Sprint Board, Site Maps)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-200">
                <th className="py-2 pr-4 font-medium text-slate-700">Action</th>
                <th className="py-2 font-medium text-slate-700">Shortcut</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-4">Pan canvas</td>
                <td className="py-2"><kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Space</kbd> + drag</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-4">Zoom in/out</td>
                <td className="py-2"><kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Ctrl</kbd> + scroll</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-4">Delete selected</td>
                <td className="py-2"><kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Delete</kbd> or <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Backspace</kbd></td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Deselect</td>
                <td className="py-2"><kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Escape</kbd></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Tips */}
      <section className="bg-amber-50 rounded-xl border border-amber-100 p-6 mt-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Tips & Best Practices</h2>
        <ul className="text-sm text-slate-600 space-y-2">
          <li><strong>Start with personas</strong> - Build your user understanding first, then create maps and boards</li>
          <li><strong>Use tags consistently</strong> - Create a tagging system for easy filtering across personas</li>
          <li><strong>Export regularly</strong> - Browser data can be cleared; keep backups of important work</li>
          <li><strong>Link personas</strong> - Connect personas to journey maps, impact map actors, and site map screens</li>
          <li><strong>Use priorities</strong> - Mark persona priorities to focus on your most important users</li>
        </ul>
      </section>
    </div>
  );
}
