import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PersonaForm from '../components/PersonaForm';
import {
  getPersonaById,
  addPersona as storageAddPersona,
  updatePersona as storageUpdatePersona,
} from '../lib/storage';

const AddPersonaPage = () => {
  const [personaToEdit, setPersonaToEdit] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // If editing, get the persona to edit from storage
    const { id } = router.query;
    if (id) {
      const persona = getPersonaById(parseInt(id));
      setPersonaToEdit(persona);
    }
  }, [router.query]);

  const addPersona = (newPersona) => {
    storageAddPersona({ ...newPersona, id: Date.now() });
    router.push('/'); // Redirect to home page after adding persona
  };

  const editPersona = (updatedPersona) => {
    storageUpdatePersona(updatedPersona);
    router.push('/'); // Redirect to home page after editing persona
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">
        {personaToEdit ? 'Edit Persona' : 'Add Persona'}
      </h1>
      <PersonaForm
        personaToEdit={personaToEdit}
        onAddPersona={addPersona}
        onEditPersona={editPersona}
      />
    </div>
  );
};

export default AddPersonaPage;
