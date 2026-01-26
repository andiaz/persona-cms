// lib/storage/index.js
// Storage abstraction layer - uses localStorage with JSON export/import support

const STORAGE_KEY = 'personas';
const JOURNEY_MAPS_KEY = 'journeyMaps';

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Get all personas from localStorage
 * @returns {Array} Array of persona objects
 */
export function getPersonas() {
  if (!isBrowser) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading personas from storage:', error);
    return [];
  }
}

/**
 * Save all personas to localStorage
 * @param {Array} personas - Array of persona objects
 */
export function savePersonas(personas) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(personas));
  } catch (error) {
    console.error('Error saving personas to storage:', error);
    // Handle quota exceeded
    if (error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Consider exporting and clearing old data.');
    }
    throw error;
  }
}

/**
 * Get a single persona by ID
 * @param {number} id - Persona ID
 * @returns {Object|null} Persona object or null if not found
 */
export function getPersonaById(id) {
  const personas = getPersonas();
  return personas.find((p) => p.id === id) || null;
}

/**
 * Add a new persona
 * @param {Object} persona - Persona object (id will be generated if not provided)
 * @returns {Object} The saved persona with ID
 */
export function addPersona(persona) {
  const personas = getPersonas();
  const newPersona = {
    ...persona,
    id: persona.id || Date.now(),
    createdAt: persona.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  personas.push(newPersona);
  savePersonas(personas);
  return newPersona;
}

/**
 * Update an existing persona
 * @param {Object} updatedPersona - Persona object with id
 * @returns {Object|null} Updated persona or null if not found
 */
export function updatePersona(updatedPersona) {
  const personas = getPersonas();
  const index = personas.findIndex((p) => p.id === updatedPersona.id);
  if (index === -1) return null;

  personas[index] = {
    ...personas[index],
    ...updatedPersona,
    updatedAt: new Date().toISOString(),
  };
  savePersonas(personas);
  return personas[index];
}

/**
 * Delete a persona by ID
 * @param {number} id - Persona ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deletePersona(id) {
  const personas = getPersonas();
  const filtered = personas.filter((p) => p.id !== id);
  if (filtered.length === personas.length) return false;
  savePersonas(filtered);
  return true;
}

/**
 * Get all unique tags from all personas
 * @returns {Array} Array of unique tag strings
 */
export function getAllTags() {
  const personas = getPersonas();
  const tags = new Set();
  personas.forEach((p) => {
    if (p.tags && Array.isArray(p.tags)) {
      p.tags.forEach((tag) => tags.add(tag));
    }
  });
  return Array.from(tags);
}

// --- Journey Maps Storage ---

/**
 * Get all journey maps from localStorage
 * @returns {Array} Array of journey map objects
 */
export function getJourneyMaps() {
  if (!isBrowser) return [];
  try {
    const data = localStorage.getItem(JOURNEY_MAPS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading journey maps from storage:', error);
    return [];
  }
}

/**
 * Save all journey maps to localStorage
 * @param {Array} journeyMaps - Array of journey map objects
 */
export function saveJourneyMaps(journeyMaps) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(JOURNEY_MAPS_KEY, JSON.stringify(journeyMaps));
  } catch (error) {
    console.error('Error saving journey maps to storage:', error);
    throw error;
  }
}

/**
 * Get a single journey map by ID
 * @param {number} id - Journey map ID
 * @returns {Object|null} Journey map object or null if not found
 */
export function getJourneyMapById(id) {
  const journeyMaps = getJourneyMaps();
  return journeyMaps.find((j) => j.id === id) || null;
}

/**
 * Add a new journey map
 * @param {Object} journeyMap - Journey map object
 * @returns {Object} The saved journey map with ID
 */
export function addJourneyMap(journeyMap) {
  const journeyMaps = getJourneyMaps();
  const newJourneyMap = {
    ...journeyMap,
    id: journeyMap.id || Date.now(),
    stages: journeyMap.stages || [],
    personaIds: journeyMap.personaIds || [],
    createdAt: journeyMap.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  journeyMaps.push(newJourneyMap);
  saveJourneyMaps(journeyMaps);
  return newJourneyMap;
}

/**
 * Update an existing journey map
 * @param {Object} updatedJourneyMap - Journey map object with id
 * @returns {Object|null} Updated journey map or null if not found
 */
export function updateJourneyMap(updatedJourneyMap) {
  const journeyMaps = getJourneyMaps();
  const index = journeyMaps.findIndex((j) => j.id === updatedJourneyMap.id);
  if (index === -1) return null;

  journeyMaps[index] = {
    ...journeyMaps[index],
    ...updatedJourneyMap,
    updatedAt: new Date().toISOString(),
  };
  saveJourneyMaps(journeyMaps);
  return journeyMaps[index];
}

/**
 * Delete a journey map by ID
 * @param {number} id - Journey map ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteJourneyMap(id) {
  const journeyMaps = getJourneyMaps();
  const filtered = journeyMaps.filter((j) => j.id !== id);
  if (filtered.length === journeyMaps.length) return false;
  saveJourneyMaps(filtered);
  return true;
}

/**
 * Create a default stage template
 * @param {string} name - Stage name
 * @param {number} order - Stage order
 * @returns {Object} Stage object
 */
export function createStage(name, order = 0) {
  return {
    id: Date.now() + order,
    name,
    order,
    touchpoints: [],
    emotions: [],
    painPoints: [],
    opportunities: [],
  };
}

/**
 * Get default journey stages template
 * @returns {Array} Array of default stages
 */
export function getDefaultStages() {
  return [
    createStage('Awareness', 0),
    createStage('Consideration', 1),
    createStage('Decision', 2),
    createStage('Purchase', 3),
    createStage('Retention', 4),
  ];
}

// --- Export/Import Functions ---

/**
 * Export all data as a JSON blob for download
 * @returns {Blob} JSON blob containing all data
 */
export function exportAllData() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    personas: getPersonas(),
    journeyMaps: getJourneyMaps(),
  };
  return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
}

/**
 * Import data from a JSON file
 * @param {Object} data - Parsed JSON data
 * @param {Object} options - Import options
 * @param {boolean} options.merge - If true, merge with existing data; if false, replace
 * @returns {Object} Summary of imported items
 */
export function importData(data, options = { merge: false }) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid import data format');
  }

  const result = { personas: 0, journeyMaps: 0 };

  // Handle personas
  if (Array.isArray(data.personas)) {
    if (options.merge) {
      const existing = getPersonas();
      const existingIds = new Set(existing.map((p) => p.id));
      const newPersonas = data.personas.filter((p) => !existingIds.has(p.id));
      savePersonas([...existing, ...newPersonas]);
      result.personas = newPersonas.length;
    } else {
      savePersonas(data.personas);
      result.personas = data.personas.length;
    }
  }

  // Handle journey maps
  if (Array.isArray(data.journeyMaps)) {
    if (options.merge) {
      const existing = getJourneyMaps();
      const existingIds = new Set(existing.map((j) => j.id));
      const newMaps = data.journeyMaps.filter((j) => !existingIds.has(j.id));
      saveJourneyMaps([...existing, ...newMaps]);
      result.journeyMaps = newMaps.length;
    } else {
      saveJourneyMaps(data.journeyMaps);
      result.journeyMaps = data.journeyMaps.length;
    }
  }

  return result;
}

/**
 * Clear all stored data
 */
export function clearAllData() {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(JOURNEY_MAPS_KEY);
}

/**
 * Get storage usage info
 * @returns {Object} Storage usage statistics
 */
export function getStorageInfo() {
  if (!isBrowser) return { used: 0, personas: 0, journeyMaps: 0 };

  const personasData = localStorage.getItem(STORAGE_KEY) || '';
  const journeyMapsData = localStorage.getItem(JOURNEY_MAPS_KEY) || '';

  return {
    used: personasData.length + journeyMapsData.length,
    personas: getPersonas().length,
    journeyMaps: getJourneyMaps().length,
  };
}

// --- Migration helper ---

/**
 * Migrate data from sessionStorage to localStorage (one-time migration)
 */
export function migrateFromSessionStorage() {
  if (!isBrowser) return false;

  const sessionData = sessionStorage.getItem('personas');
  if (sessionData && !localStorage.getItem(STORAGE_KEY)) {
    try {
      const personas = JSON.parse(sessionData);
      savePersonas(personas);
      sessionStorage.removeItem('personas');
      return true;
    } catch (error) {
      console.error('Migration failed:', error);
      return false;
    }
  }
  return false;
}
