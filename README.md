# Persona Lab

A free, privacy-first tool for creating user personas, journey maps, impact maps, sprint boards, and site maps. Your data stays on your device - no account required, no cloud storage, complete privacy.

**[Try the Live Demo →](https://andiaz.github.io/persona-cms/)**

## Why Persona Lab?

| Feature          | Persona Lab                    | Paid Alternatives     |
| ---------------- | ------------------------------ | --------------------- |
| Price            | Free                           | $$$                   |
| Data Location    | Your device only               | Cloud servers         |
| Account Required | No                             | Yes                   |
| Offline Usage    | Full                           | Limited               |
| Privacy          | Data never leaves your browser | Data on their servers |

## Who Is This For?

- **UX Designers** creating and presenting user personas
- **Product Managers** documenting target users, journeys, and planning sprints
- **Researchers** organizing findings into actionable personas
- **Students** learning UX design principles
- **Startups** needing persona and planning tools without the subscription cost
- **Development Teams** tracking sprint work and mapping application architecture

## Features

### Persona Management

- Create detailed user personas with goals, pain points, tasks, and context
- Auto-generated avatars with multiple style options (DiceBear integration)
- Priority levels for persona importance
- Tag-based organization and filtering
- Search across all persona attributes

### Journey Mapping

- Visual stage-based journey maps
- Link multiple personas to a single journey
- Track touchpoints, emotions, pain points, and opportunities per stage
- Emotion indicators with visual graphs
- Drag-and-drop stage reordering

### Impact Mapping

- Goal-oriented strategy visualization (Goal → Actors → Impacts → Deliverables)
- Link actors to existing personas for consistency
- Track deliverable status (Planned, In Progress, Done, Rejected)
- Interactive tree visualization with zoom controls
- Hover to highlight related nodes in the hierarchy
- Export as PNG or Markdown (Obsidian-compatible)
- Reorder nodes with visual feedback

### Sprint Board

- Kanban-style board with customizable columns (Backlog, To Do, In Progress, Done)
- Link tasks to personas to track who benefits from each work item
- Story point estimation and tracking
- Priority levels (Critical, High, Medium, Low)
- Pan and zoom canvas for large boards
- Filter tasks by persona, priority, or points
- Export as PNG or Markdown

### Site Maps

- Visual tree structure for mapping website/app architecture (FlowMapp-style)
- 16 screen types with distinctive thumbnails (Landing, Login, Dashboard, Form, Table, etc.)
- Hierarchical parent-child relationships with auto-layout
- Release tagging (MVP, v1.0, v2.0, etc.) with custom tags
- Status tracking (Planned, In Progress, Done)
- Link screens to personas to show which users access each screen
- Filter by status, release tag, or persona (including "unassigned" filters)
- Pan and zoom canvas with keyboard shortcuts (Space+drag, Ctrl+scroll)
- Export as PNG or Markdown

### Export & Layouts

- Multiple layout templates (Card, Full Profile, Minimal, Print)
- Export personas as PNG images
- Export boards and site maps as PNG
- Export to Markdown (Obsidian-compatible)
- PDF export via print dialog
- JSON export/import for backups

### Privacy-First Design

- All data stored in browser localStorage
- Works completely offline
- No tracking, no analytics, no data collection
- Your research stays yours

## Getting Started

Requires Node.js 18+

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with React 19
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Avatars:** [DiceBear](https://dicebear.com/) (CC BY 4.0 / MIT)
- **Icons:** [Heroicons](https://heroicons.com/)
- **Export:** html2canvas for PNG generation
- **Storage:** Browser localStorage (no backend required)

## Data Management

### Backup Your Data

Use the export feature to save all your data as JSON files. This includes:

- Personas
- Journey Maps
- Impact Maps
- Sprint Boards
- Site Maps

This allows you to:

- Back up your work
- Transfer data between devices
- Share templates with colleagues

### Import Data

Import previously exported JSON files to restore all your personas, maps, boards, and site maps.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT License - feel free to use this for personal or commercial projects.
