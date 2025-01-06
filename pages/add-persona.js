import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PersonaForm from '../components/PersonaForm';

const AddPersonaPage = () => {
  const [personaToEdit, setPersonaToEdit] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // If editing, get the persona to edit from the URL (or from sessionStorage)
    const { id } = router.query;
    if (id) {
      const personas = JSON.parse(sessionStorage.getItem('personas') || '[]');
      const persona = personas.find((p) => p.id === parseInt(id));
      setPersonaToEdit(persona);
    }
  }, [router.query]);

  const addPersona = (newPersona) => {
    const personas = JSON.parse(sessionStorage.getItem('personas') || '[]');
    const updatedPersonas = [...personas, newPersona];
    sessionStorage.setItem('personas', JSON.stringify(updatedPersonas));
    router.push('/'); // Redirect to home page after adding persona
  };

  const editPersona = (updatedPersona) => {
    const personas = JSON.parse(sessionStorage.getItem('personas') || '[]');
    const updatedPersonas = personas.map((persona) =>
      persona.id === updatedPersona.id ? updatedPersona : persona
    );
    sessionStorage.setItem('personas', JSON.stringify(updatedPersonas));
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
