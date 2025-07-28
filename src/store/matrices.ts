import { atom } from 'jotai';
import type { DecisionMatrix } from '@/types/matrix';
import { saveMatricesToStorage, loadMatricesFromStorage } from './storage';

// Main atom that stores all matrices (both templates and filled matrices)
// This atom automatically persists to localStorage on any change
export const matricesAtom = atom<DecisionMatrix[]>(
  // Read function: try to load from localStorage first
  loadMatricesFromStorage() || []
);

// Effect atom that automatically saves to localStorage when matrices change
export const matricesPersistenceAtom = atom(
  null,
  (get, _set, _update) => {
    const matrices = get(matricesAtom);
    saveMatricesToStorage(matrices);
  }
);

// Derived atom that filters only template matrices
export const templateMatricesAtom = atom((get) =>
  get(matricesAtom).filter((matrix) => matrix.isTemplate)
);

// Derived atom that filters only filled matrices
export const filledMatricesAtom = atom((get) =>
  get(matricesAtom).filter((matrix) => !matrix.isTemplate)
);

// Derived atom that gets recent matrices (last 10, sorted by lastAccessed)
export const recentMatricesAtom = atom((get) =>
  get(filledMatricesAtom)
    .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
    .slice(0, 10)
);

// Write-only atom for adding a new matrix
export const addMatrixAtom = atom(
  null,
  (get, set, newMatrix: DecisionMatrix) => {
    const currentMatrices = get(matricesAtom);
    set(matricesAtom, [...currentMatrices, newMatrix]);
    // Trigger persistence
    set(matricesPersistenceAtom, null);
  }
);

// Write-only atom for updating an existing matrix
export const updateMatrixAtom = atom(
  null,
  (get, set, updatedMatrix: DecisionMatrix) => {
    const currentMatrices = get(matricesAtom);
    const updatedMatrices = currentMatrices.map((matrix) =>
      matrix.id === updatedMatrix.id ? updatedMatrix : matrix
    );
    set(matricesAtom, updatedMatrices);
    // Trigger persistence
    set(matricesPersistenceAtom, null);
  }
);

// Write-only atom for deleting a matrix
export const deleteMatrixAtom = atom(
  null,
  (get, set, matrixId: string) => {
    const currentMatrices = get(matricesAtom);
    const filteredMatrices = currentMatrices.filter((matrix) => matrix.id !== matrixId);
    set(matricesAtom, filteredMatrices);
    // Trigger persistence
    set(matricesPersistenceAtom, null);
  }
);

// Read-only atom for getting a specific matrix by ID
export const getMatrixByIdAtom = atom((get) => (id: string) =>
  get(matricesAtom).find((matrix) => matrix.id === id)
);