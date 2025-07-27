import type { DecisionMatrix } from '@/types/matrix';

const STORAGE_KEY = 'decision-matrices';
const STORAGE_VERSION = 1;

interface StorageData {
  version: number;
  matrices: DecisionMatrix[];
  timestamp: string;
}

/**
 * Save matrices to localStorage with proper Date serialization
 */
export function saveMatricesToStorage(matrices: DecisionMatrix[]): void {
  try {
    const data: StorageData = {
      version: STORAGE_VERSION,
      matrices,
      timestamp: new Date().toISOString(),
    };
    
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.warn('Failed to save matrices to localStorage:', error);
    // Could implement fallback storage or user notification here
  }
}

/**
 * Load matrices from localStorage with proper Date deserialization
 */
export function loadMatricesFromStorage(): DecisionMatrix[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const data: StorageData = JSON.parse(stored);
    
    // Check version compatibility
    if (data.version !== STORAGE_VERSION) {
      console.warn('Storage version mismatch, ignoring stored data');
      return null;
    }

    // Deserialize dates
    const matrices = data.matrices.map((matrix) => ({
      ...matrix,
      createdAt: new Date(matrix.createdAt),
      lastAccessed: new Date(matrix.lastAccessed),
    }));

    return matrices;
  } catch (error) {
    console.warn('Failed to load matrices from localStorage:', error);
    return null;
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear all stored matrices
 */
export function clearStoredMatrices(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear stored matrices:', error);
  }
}

/**
 * Get storage usage info (for debugging/monitoring)
 */
export function getStorageInfo(): { used: number; available: boolean } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return {
      used: stored ? new Blob([stored]).size : 0,
      available: isStorageAvailable(),
    };
  } catch {
    return {
      used: 0,
      available: false,
    };
  }
}