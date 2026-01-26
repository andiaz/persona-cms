// components/layouts/index.js
export { default as CardLayout } from './CardLayout';
export { default as MinimalLayout } from './MinimalLayout';
export { default as FullProfileLayout } from './FullProfileLayout';
export { default as PrintLayout } from './PrintLayout';

export const LAYOUT_OPTIONS = [
  { id: 'card', name: 'Card View', description: 'Detailed grid layout' },
  { id: 'full', name: 'Full Profile', description: 'Presentation-ready' },
  { id: 'minimal', name: 'Minimal', description: 'Quick overview' },
  { id: 'print', name: 'Print', description: 'Optimized for printing' },
];
