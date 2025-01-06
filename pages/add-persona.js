// pages/add-persona.js
import { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter
import PersonaForm from '../components/PersonaForm';

const AddPersonaPage = () => {
  const [personaToEdit, setPersonaToEdit] = useState(null);
  const router = useRouter(); // Initialize the router

  const addPersona = (newPersona) => {
    // Handle the logic for adding a new persona
    console.log('Adding persona:', newPersona);
    // Redirect to the homepage after editing
    router.push('/');
  };

  const editPersona = (updatedPersona) => {
    // Handle the logic for editing an existing persona
    console.log('Editing persona:', updatedPersona);
    // Redirect to the homepage after editing
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Add or Edit Persona</h1>
      <PersonaForm
        personaToEdit={personaToEdit}
        onAddPersona={addPersona}
        onEditPersona={editPersona}
      />
    </div>
  );
};

export default AddPersonaPage;
