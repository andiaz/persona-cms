import { useState, useEffect } from 'react';
import Link from 'next/link';
import PersonaList from '../components/PersonaList';

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

  useEffect(() => {
    // Load personas from sessionStorage when the app is loaded
    const savedPersonas = sessionStorage.getItem('personas');
    if (savedPersonas) {
      setPersonas(JSON.parse(savedPersonas));
    }
  }, []);

  const editPersona = (updatedPersona) => {
    const updatedPersonas = personas.map((persona) =>
      persona.id === updatedPersona.id ? updatedPersona : persona
    );
    setPersonas(updatedPersonas);
    sessionStorage.setItem('personas', JSON.stringify(updatedPersonas)); // Save to sessionStorage
  };

  const deletePersona = (id) => {
    const updatedPersonas = personas.filter((persona) => persona.id !== id);
    setPersonas(updatedPersonas);
    sessionStorage.setItem('personas', JSON.stringify(updatedPersonas)); // Save to sessionStorage
  };

  const addPersona = (newPersona) => {
    const personas = JSON.parse(sessionStorage.getItem('personas') || '[]');
    sessionStorage.setItem(
      'personas',
      JSON.stringify([...personas, newPersona])
    );
  };

  const handleGenerateTest = () => {
    const newPersona = generateTestPersona();
    const updatedPersonas = [...personas, newPersona];
    setPersonas(updatedPersonas);
    sessionStorage.setItem('personas', JSON.stringify(updatedPersonas));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Personas</h1>
        <div className="flex gap-4">
          <button
            onClick={handleGenerateTest}
            className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
            title="Generate a test persona with sample data"
          >
            Generate Test
          </button>
          <Link
            href="/add-persona"
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add New Persona
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
