// pages/index.js or App.js (depending on your setup)
import { useState } from 'react';
import '../styles/globals.css';
import PersonaForm from '../components/PersonaForm';
import PersonaList from '../components/PersonaList';

export default function Home() {
  const [personas, setPersonas] = useState([]);
  const [personaToEdit, setPersonaToEdit] = useState(null);

  const addPersona = (newPersona) => {
    setPersonas((prevPersonas) => [...prevPersonas, newPersona]);
  };

  const editPersona = (updatedPersona) => {
    setPersonas((prevPersonas) =>
      prevPersonas.map((persona) =>
        persona.id === updatedPersona.id ? updatedPersona : persona
      )
    );
    setPersonaToEdit(null); // Clear the edit form after saving changes
  };

  const deletePersona = (id) => {
    setPersonas(personas.filter((persona) => persona.id !== id));
  };

  return (
    <div>
      <PersonaForm
        onAddPersona={addPersona}
        personaToEdit={personaToEdit}
        onEditPersona={editPersona}
      />
      <PersonaList
        personas={personas}
        onEditPersona={setPersonaToEdit}
        onDeletePersona={deletePersona}
      />
    </div>
  );
}
