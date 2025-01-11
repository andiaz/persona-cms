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

  const addPersona = (newPersona) => {
    const updatedPersonas = [...personas, newPersona];
    setPersonas(updatedPersonas);
    sessionStorage.setItem('personas', JSON.stringify(updatedPersonas)); // Save to sessionStorage
  };

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

  return (
    <div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Personas</h1>
        <div>
          <Link
            href="/add-persona"
            className="inline-block px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add New Persona
          </Link>
        </div>
      </div>
      <PersonaList
        personas={personas}
        onEditPersona={editPersona}
        onDeletePersona={deletePersona}
      />
    </div>
  );
}
