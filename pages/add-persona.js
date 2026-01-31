import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PersonaForm from '../components/PersonaForm';
import {
  getPersonaById,
  addPersona as storageAddPersona,
  updatePersona as storageUpdatePersona,
  getJourneyMapById,
  updateJourneyMap,
} from '../lib/storage';

const AddPersonaPage = () => {
  const [personaToEdit, setPersonaToEdit] = useState(null);
  const [fromSource, setFromSource] = useState(null);
  const [returnMapId, setReturnMapId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Capture the 'from' and 'mapId' query params when they become available
    const { id, from, mapId } = router.query;
    if (from) {
      setFromSource(from);
    }
    if (mapId) {
      setReturnMapId(mapId);
    }
    if (id) {
      const persona = getPersonaById(parseInt(id));
      setPersonaToEdit(persona);
    }
  }, [router.query]);

  const addPersona = (newPersona) => {
    const id = Date.now();
    storageAddPersona({ ...newPersona, id });

    // If coming from a specific journey map, add persona to it and return there
    if (fromSource === 'journey-map' && returnMapId) {
      const journeyMap = getJourneyMapById(parseInt(returnMapId));
      if (journeyMap) {
        const updatedPersonaIds = [...(journeyMap.personaIds || []), id];
        updateJourneyMap({ ...journeyMap, personaIds: updatedPersonaIds });
      }
      router.push(`/journey-map?id=${returnMapId}`);
    }
    // If coming from journey maps list/dialog, redirect back there with the new persona pre-selected
    else if (fromSource === 'journey-maps') {
      router.push(`/journey-maps?newPersona=${id}`);
    } else {
      // Redirect to index with the new persona ID to scroll to it
      router.push(`/?newPersona=${id}`);
    }
  };

  const editPersona = (updatedPersona) => {
    storageUpdatePersona(updatedPersona);
    router.push('/');
  };

  // Determine back URL based on where we came from
  const getBackUrl = () => {
    if (fromSource === 'journey-map' && returnMapId) {
      return `/journey-map?id=${returnMapId}`;
    }
    if (fromSource === 'journey-maps') {
      return '/journey-maps';
    }
    return '/';
  };

  const backUrl = getBackUrl();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={backUrl}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900">
          {personaToEdit ? 'Edit Persona' : 'Add Persona'}
        </h1>
      </div>
      <PersonaForm
        personaToEdit={personaToEdit}
        onAddPersona={addPersona}
        onEditPersona={editPersona}
      />
    </div>
  );
};

export default AddPersonaPage;
