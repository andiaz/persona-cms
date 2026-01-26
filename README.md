# Persona Lab

A free, privacy-first tool for creating user personas and journey maps. Your data stays on your device - no account required, no cloud storage, complete privacy.

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
- **Product Managers** documenting target users and their journeys
- **Researchers** organizing findings into actionable personas
- **Students** learning UX design principles
- **Startups** needing persona tools without the subscription cost

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

### Export & Layouts

- Multiple layout templates (Card, Full Profile, Minimal, Print)
- Export personas as PNG images
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

Use the export feature to save your personas and journey maps as JSON files. This allows you to:

- Back up your work
- Transfer data between devices
- Share templates with colleagues

### Import Data

Import previously exported JSON files to restore your personas and journey maps.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT License - feel free to use this for personal or commercial projects.
