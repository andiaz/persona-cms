import { useState, useEffect } from 'react';
import Link from 'next/link';
import PersonaList from '../components/PersonaList';
import React from 'react';
import {
  getPersonas,
  addPersona as storageAddPersona,
  deletePersona as storageDeletePersona,
  updatePersona as storageUpdatePersona,
  exportAllData,
  importData,
  migrateFromSessionStorage,
} from '../lib/storage';

const generateTestPersona = () => {
  const id = Date.now();

  const possibleGoals = [
    'Improve workflow efficiency',
    'Reduce manual tasks',
    'Better team collaboration',
    'Increase customer satisfaction',
    'Streamline decision making',
    'Minimize technical debt',
    'Enhance user experience',
    'Optimize resource allocation',
    'Accelerate development cycles',
    'Improve documentation quality',
    'Reduce meeting overhead',
    'Better work-life balance',
  ];

  const possiblePainPoints = [
    'Too many manual steps',
    'Lack of automation',
    'Communication gaps',
    'Unclear requirements',
    'Inconsistent processes',
    'Tool fragmentation',
    'Knowledge silos',
    'Technical limitations',
    'Frequent context switching',
    'Limited visibility into progress',
    'Deadline pressure',
    'Legacy system constraints',
  ];

  const possibleTasks = [
    'Daily team updates',
    'Project planning',
    'Resource allocation',
    'Code reviews',
    'Documentation writing',
    'Bug triage',
    'Feature specification',
    'Stakeholder meetings',
    'Performance monitoring',
    'User research',
    'Design reviews',
    'Release planning',
  ];

  const possibleFunctionality = [
    'Task automation',
    'Team chat',
    'Resource dashboard',
    'Automated testing',
    'CI/CD pipeline',
    'Analytics dashboard',
    'Collaboration tools',
    'Version control',
    'Project tracking',
    'Documentation system',
    'Knowledge base',
    'Monitoring alerts',
  ];

  const possibleContexts = [
    'Office environment with remote team members',
    'Fully remote setup with distributed teams',
    'Hybrid workplace with flexible hours',
    'High-pressure startup environment',
    'Enterprise setting with strict processes',
    'Cross-functional team collaboration',
    'Client-facing development environment',
  ];

  const possibleTags = [
    'test',
    'demo',
    'prototype',
    'developer',
    'designer',
    'manager',
    'frontend',
    'backend',
    'fullstack',
    'mobile',
    'web',
    'desktop',
    'junior',
    'senior',
    'lead',
    'agile',
    'devops',
    'qa',
  ];

  // Helper function to get random items from array
  const getRandomItems = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return {
    id,
    name: `Test Persona ${id.toString().slice(-4)}`,
    goals: getRandomItems(possibleGoals, 2 + Math.floor(Math.random() * 2)), // 2-3 goals
    painPoints: getRandomItems(
      possiblePainPoints,
      2 + Math.floor(Math.random() * 2)
    ), // 2-3 pain points
    tasks: getRandomItems(possibleTasks, 2 + Math.floor(Math.random() * 2)), // 2-3 tasks
    functionality: getRandomItems(
      possibleFunctionality,
      2 + Math.floor(Math.random() * 2)
    ), // 2-3 functionalities
    contextOfUse:
      possibleContexts[Math.floor(Math.random() * possibleContexts.length)],
    tags: getRandomItems(possibleTags, 2 + Math.floor(Math.random() * 3)), // 2-4 tags
    priority: Math.floor(Math.random() * 5), // 0-4 priority
  };
};

export default function Home() {
  const [personas, setPersonas] = useState([]);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    // Migrate from sessionStorage if needed (one-time)
    migrateFromSessionStorage();
    // Load personas from localStorage
    setPersonas(getPersonas());
  }, []);

  const editPersona = (updatedPersona) => {
    storageUpdatePersona(updatedPersona);
    setPersonas(getPersonas());
  };

  const deletePersona = (id) => {
    storageDeletePersona(id);
    setPersonas(getPersonas());
  };

  const addPersona = (newPersona) => {
    storageAddPersona(newPersona);
    setPersonas(getPersonas());
  };

  const handleGenerateTest = () => {
    const newPersona = generateTestPersona();
    storageAddPersona(newPersona);
    setPersonas(getPersonas());
  };

  const handleExport = () => {
    const blob = exportAllData();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personas-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const result = importData(data, { merge: true });
        setPersonas(getPersonas());
        alert(`Imported ${result.personas} personas and ${result.journeyMaps} journey maps.`);
      } catch (error) {
        alert('Failed to import: ' + error.message);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Personas</h1>
          <p className="text-sm text-slate-500 mt-1">
            {personas.length === 0
              ? 'Create your first user persona'
              : `${personas.length} persona${personas.length !== 1 ? 's' : ''} in your library`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Export all data as JSON backup"
          >
            Export
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Import data from JSON backup"
          >
            Import
          </button>
          <button
            onClick={handleGenerateTest}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Generate a test persona with sample data"
          >
            Generate Test
          </button>
          <Link
            href="/add-persona"
            className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
          >
            + Add Persona
          </Link>
        </div>
      </div>
      <PersonaList
        personas={personas}
        onEditPersona={editPersona}
        onDeletePersona={deletePersona}
        onAddPersona={addPersona}
      />
    </div>
  );
}
