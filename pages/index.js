import { useState, useEffect } from 'react';
import Link from 'next/link';
import PersonaList from '../components/PersonaList';

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Personas</h1>
        <Link
          href="/add-persona"
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Add New Persona
        </Link>
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
