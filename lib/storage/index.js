// lib/storage/index.js
// Storage abstraction layer - uses localStorage with JSON export/import support

const STORAGE_KEY = 'personas';
const JOURNEY_MAPS_KEY = 'journeyMaps';
const IMPACT_MAPS_KEY = 'impactMaps';
const BOARDS_KEY = 'sprintBoards';

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
 * Duplicate a persona by ID
 * @param {number} id - Persona ID to duplicate
 * @returns {Object|null} The duplicated persona or null if not found
 */
export function duplicatePersona(id) {
  const persona = getPersonaById(id);
  if (!persona) return null;

  const newPersona = {
    ...JSON.parse(JSON.stringify(persona)), // Deep copy
    id: Date.now(),
    name: `${persona.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const personas = getPersonas();
  personas.push(newPersona);
  savePersonas(personas);
  return newPersona;
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
 * Duplicate a journey map by ID
 * @param {number} id - Journey map ID to duplicate
 * @returns {Object|null} The duplicated journey map or null if not found
 */
export function duplicateJourneyMap(id) {
  const journeyMap = getJourneyMapById(id);
  if (!journeyMap) return null;

  const now = Date.now();
  // Deep copy and regenerate IDs for stages
  const copiedStages = (journeyMap.stages || []).map((stage, index) => ({
    ...JSON.parse(JSON.stringify(stage)),
    id: now + index + 1,
  }));

  const newJourneyMap = {
    ...JSON.parse(JSON.stringify(journeyMap)),
    id: now,
    name: `${journeyMap.name} (Copy)`,
    stages: copiedStages,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const journeyMaps = getJourneyMaps();
  journeyMaps.push(newJourneyMap);
  saveJourneyMaps(journeyMaps);
  return newJourneyMap;
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

// --- Impact Maps Storage ---

/**
 * Get all impact maps from localStorage
 * @returns {Array} Array of impact map objects
 */
export function getImpactMaps() {
  if (!isBrowser) return [];
  try {
    const data = localStorage.getItem(IMPACT_MAPS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading impact maps from storage:', error);
    return [];
  }
}

/**
 * Save all impact maps to localStorage
 * @param {Array} impactMaps - Array of impact map objects
 */
export function saveImpactMaps(impactMaps) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(IMPACT_MAPS_KEY, JSON.stringify(impactMaps));
  } catch (error) {
    console.error('Error saving impact maps to storage:', error);
    throw error;
  }
}

/**
 * Get a single impact map by ID
 * @param {number} id - Impact map ID
 * @returns {Object|null} Impact map object or null if not found
 */
export function getImpactMapById(id) {
  const impactMaps = getImpactMaps();
  return impactMaps.find((m) => m.id === id) || null;
}

/**
 * Add a new impact map
 * @param {Object} impactMap - Impact map object
 * @returns {Object} The saved impact map with ID
 */
export function addImpactMap(impactMap) {
  const impactMaps = getImpactMaps();
  const newImpactMap = {
    ...impactMap,
    id: impactMap.id || Date.now(),
    nodes: impactMap.nodes || [],
    createdAt: impactMap.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  impactMaps.push(newImpactMap);
  saveImpactMaps(impactMaps);
  return newImpactMap;
}

/**
 * Update an existing impact map
 * @param {Object} updatedImpactMap - Impact map object with id
 * @returns {Object|null} Updated impact map or null if not found
 */
export function updateImpactMap(updatedImpactMap) {
  const impactMaps = getImpactMaps();
  const index = impactMaps.findIndex((m) => m.id === updatedImpactMap.id);
  if (index === -1) return null;

  impactMaps[index] = {
    ...impactMaps[index],
    ...updatedImpactMap,
    updatedAt: new Date().toISOString(),
  };
  saveImpactMaps(impactMaps);
  return impactMaps[index];
}

/**
 * Delete an impact map by ID
 * @param {number} id - Impact map ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteImpactMap(id) {
  const impactMaps = getImpactMaps();
  const filtered = impactMaps.filter((m) => m.id !== id);
  if (filtered.length === impactMaps.length) return false;
  saveImpactMaps(filtered);
  return true;
}

/**
 * Duplicate an impact map by ID
 * @param {number} id - Impact map ID to duplicate
 * @returns {Object|null} The duplicated impact map or null if not found
 */
export function duplicateImpactMap(id) {
  const impactMap = getImpactMapById(id);
  if (!impactMap) return null;

  const now = Date.now();
  // Deep copy and regenerate IDs for nodes while preserving parent references
  const idMapping = {};
  const copiedNodes = (impactMap.nodes || []).map((node) => {
    const newId = `${node.type}-${now}-${Math.random().toString(36).substring(2, 11)}`;
    idMapping[node.id] = newId;
    return {
      ...JSON.parse(JSON.stringify(node)),
      id: newId,
    };
  });

  // Update parent references with new IDs
  copiedNodes.forEach((node) => {
    if (node.parentId && idMapping[node.parentId]) {
      node.parentId = idMapping[node.parentId];
    }
  });

  const newImpactMap = {
    ...JSON.parse(JSON.stringify(impactMap)),
    id: now,
    name: `${impactMap.name} (Copy)`,
    nodes: copiedNodes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const impactMaps = getImpactMaps();
  impactMaps.push(newImpactMap);
  saveImpactMaps(impactMaps);
  return newImpactMap;
}

/**
 * Create a new impact map node
 * @param {string} type - Node type (actor, impact, deliverable)
 * @param {string} label - Node label
 * @param {string|null} parentId - Parent node ID (null for actors)
 * @param {number} order - Display order
 * @returns {Object} Node object
 */
export function createImpactNode(type, label, parentId = null, order = 0) {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    type,
    label,
    parentId,
    order,
    ...(type === 'actor' ? { personaId: null } : {}),
    ...(type === 'deliverable' ? { status: 'planned' } : {}),
  };
}

// --- Sprint Boards Storage ---

/**
 * Get all sprint boards from localStorage
 * @returns {Array} Array of board objects
 */
export function getBoards() {
  if (!isBrowser) return [];
  try {
    const data = localStorage.getItem(BOARDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading boards from storage:', error);
    return [];
  }
}

/**
 * Save all sprint boards to localStorage
 * @param {Array} boards - Array of board objects
 */
export function saveBoards(boards) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(BOARDS_KEY, JSON.stringify(boards));
  } catch (error) {
    console.error('Error saving boards to storage:', error);
    throw error;
  }
}

/**
 * Get a single board by ID
 * @param {number} id - Board ID
 * @returns {Object|null} Board object or null if not found
 */
export function getBoardById(id) {
  const boards = getBoards();
  return boards.find((b) => b.id === id) || null;
}

/**
 * Add a new sprint board
 * @param {Object} board - Board object
 * @returns {Object} The saved board with ID
 */
export function addBoard(board) {
  const boards = getBoards();
  const newBoard = {
    ...board,
    id: board.id || Date.now(),
    name: board.name || 'Untitled Board',
    template: board.template || null,
    viewport: board.viewport || { x: 0, y: 0, zoom: 1 },
    elements: board.elements || [],
    createdAt: board.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  boards.push(newBoard);
  saveBoards(boards);
  return newBoard;
}

/**
 * Update an existing sprint board
 * @param {Object} updatedBoard - Board object with id
 * @returns {Object|null} Updated board or null if not found
 */
export function updateBoard(updatedBoard) {
  const boards = getBoards();
  const index = boards.findIndex((b) => b.id === updatedBoard.id);
  if (index === -1) return null;

  boards[index] = {
    ...boards[index],
    ...updatedBoard,
    updatedAt: new Date().toISOString(),
  };
  saveBoards(boards);
  return boards[index];
}

/**
 * Delete a sprint board by ID
 * @param {number} id - Board ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteBoard(id) {
  const boards = getBoards();
  const filtered = boards.filter((b) => b.id !== id);
  if (filtered.length === boards.length) return false;
  saveBoards(filtered);
  return true;
}

/**
 * Duplicate a sprint board by ID
 * @param {number} id - Board ID to duplicate
 * @returns {Object|null} The duplicated board or null if not found
 */
export function duplicateBoard(id) {
  const board = getBoardById(id);
  if (!board) return null;

  const now = Date.now();
  // Deep copy and regenerate IDs for elements
  const copiedElements = (board.elements || []).map((element) => ({
    ...JSON.parse(JSON.stringify(element)),
    id: `${element.type}-${now}-${Math.random().toString(36).substring(2, 9)}`,
  }));

  const newBoard = {
    ...JSON.parse(JSON.stringify(board)),
    id: now,
    name: `${board.name} (Copy)`,
    elements: copiedElements,
    viewport: { x: 0, y: 0, zoom: 1 }, // Reset viewport for fresh start
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const boards = getBoards();
  boards.push(newBoard);
  saveBoards(boards);
  return newBoard;
}

/**
 * Create a new board element (note, group, or connector)
 * @param {string} type - Element type ('note', 'group', 'connector')
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {Object} options - Additional options
 * @returns {Object} Element object
 */
export function createBoardElement(type, x, y, options = {}) {
  const baseId = `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const baseElement = {
    id: baseId,
    type,
    x,
    y,
  };

  if (type === 'note') {
    return {
      ...baseElement,
      width: options.width || 150,
      height: options.height || 100,
      content: options.content || '',
      color: options.color || 'yellow',
      zIndex: options.zIndex || 1,
    };
  }

  if (type === 'group') {
    return {
      ...baseElement,
      width: options.width || 400,
      height: options.height || 300,
      label: options.label || 'New Group',
      color: options.color || 'slate',
    };
  }

  if (type === 'connector') {
    return {
      id: baseId,
      type: 'connector',
      fromId: options.fromId || null,
      toId: options.toId || null,
      label: options.label || '',
    };
  }

  return baseElement;
}

// --- Export/Import Functions ---

/**
 * Export all data as a JSON blob for download
 * @returns {Blob} JSON blob containing all data
 */
export function exportAllData() {
  const data = {
    version: 3,
    exportedAt: new Date().toISOString(),
    personas: getPersonas(),
    journeyMaps: getJourneyMaps(),
    impactMaps: getImpactMaps(),
    boards: getBoards(),
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

  const result = { personas: 0, journeyMaps: 0, impactMaps: 0, boards: 0 };

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

  // Handle impact maps
  if (Array.isArray(data.impactMaps)) {
    if (options.merge) {
      const existing = getImpactMaps();
      const existingIds = new Set(existing.map((m) => m.id));
      const newMaps = data.impactMaps.filter((m) => !existingIds.has(m.id));
      saveImpactMaps([...existing, ...newMaps]);
      result.impactMaps = newMaps.length;
    } else {
      saveImpactMaps(data.impactMaps);
      result.impactMaps = data.impactMaps.length;
    }
  }

  // Handle boards
  if (Array.isArray(data.boards)) {
    if (options.merge) {
      const existing = getBoards();
      const existingIds = new Set(existing.map((b) => b.id));
      const newBoards = data.boards.filter((b) => !existingIds.has(b.id));
      saveBoards([...existing, ...newBoards]);
      result.boards = newBoards.length;
    } else {
      saveBoards(data.boards);
      result.boards = data.boards.length;
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
  localStorage.removeItem(IMPACT_MAPS_KEY);
  localStorage.removeItem(BOARDS_KEY);
}

/**
 * Get storage usage info
 * @returns {Object} Storage usage statistics
 */
export function getStorageInfo() {
  if (!isBrowser) return { used: 0, personas: 0, journeyMaps: 0, impactMaps: 0, boards: 0 };

  const personasData = localStorage.getItem(STORAGE_KEY) || '';
  const journeyMapsData = localStorage.getItem(JOURNEY_MAPS_KEY) || '';
  const impactMapsData = localStorage.getItem(IMPACT_MAPS_KEY) || '';
  const boardsData = localStorage.getItem(BOARDS_KEY) || '';

  return {
    used: personasData.length + journeyMapsData.length + impactMapsData.length + boardsData.length,
    personas: getPersonas().length,
    journeyMaps: getJourneyMaps().length,
    impactMaps: getImpactMaps().length,
    boards: getBoards().length,
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
