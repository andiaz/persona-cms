import { useState } from 'react';
import Link from 'next/link';
import PersonaForm from '../components/PersonaForm';
import PersonaList from '../components/PersonaList';

export default function Home() {
  const [personas, setPersonas] = useState([]);

  const addPersona = (newPersona) => {
    setPersonas((prevPersonas) => [...prevPersonas, newPersona]);
  };

  const editPersona = (updatedPersona) => {
    setPersonas((prevPersonas) =>
      prevPersonas.map((persona) =>
        persona.id === updatedPersona.id ? updatedPersona : persona
      )
    );
  };

  const deletePersona = (id) => {
    setPersonas(personas.filter((persona) => persona.id !== id));
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Personas</h1>
      <Link
        href="/add-persona"
        className="px-6 py-2 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Add New Persona
      </Link>
      <PersonaList
        personas={personas}
        onEditPersona={editPersona}
        onDeletePersona={deletePersona}
      />
    </div>
  );
}
