import type { 
  DecisionMatrix, 
  CreateMatrixInput, 
  MatrixRow, 
  MatrixColumn 
} from '@/types/matrix';

// Generate a unique ID for matrices, rows, and columns
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Create a new matrix from input data
export function createMatrix(input: CreateMatrixInput): DecisionMatrix {
  const now = new Date();
  
  // Generate IDs for rows and columns
  const rows: MatrixRow[] = input.rows.map(row => ({
    ...row,
    id: generateId(),
  }));
  
  const columns: MatrixColumn[] = input.columns.map(column => ({
    ...column,
    id: generateId(),
  }));
  
  return {
    id: generateId(),
    title: input.title,
    description: input.description,
    icon: input.icon,
    rows,
    columns,
    data: {}, // Empty data for new matrices
    isTemplate: input.isTemplate ?? false,
    createdAt: now,
    lastAccessed: now,
  };
}

// Create a matrix from a template (copy structure, empty data)
export function createFromTemplate(template: DecisionMatrix, title: string): DecisionMatrix {
  const now = new Date();
  
  return {
    id: generateId(),
    title,
    description: template.description,
    icon: template.icon, // Keep same icon
    rows: template.rows, // Keep same row structure
    columns: [], // Start with no columns
    data: {},
    isTemplate: false,
    createdAt: now,
    lastAccessed: now,
  };
}

// Update the lastAccessed timestamp
export function updateLastAccessed(matrix: DecisionMatrix): DecisionMatrix {
  return {
    ...matrix,
    lastAccessed: new Date(),
  };
}

// Set a value in the matrix data
export function setMatrixValue(
  matrix: DecisionMatrix,
  columnName: string,
  rowName: string,
  value: number
): DecisionMatrix {
  const newData = { ...matrix.data };
  
  if (!newData[columnName]) {
    newData[columnName] = {};
  }
  
  newData[columnName][rowName] = value;
  
  return {
    ...matrix,
    data: newData,
    lastAccessed: new Date(),
  };
}

// Get a value from the matrix data (with fallback)
export function getMatrixValue(
  matrix: DecisionMatrix,
  columnName: string,
  rowName: string
): number | undefined {
  return matrix.data[columnName]?.[rowName];
}

// Add a new row to a matrix
export function addRow(matrix: DecisionMatrix, row: Omit<MatrixRow, 'id'>): DecisionMatrix {
  const newRow: MatrixRow = {
    ...row,
    id: generateId(),
  };
  
  return {
    ...matrix,
    rows: [...matrix.rows, newRow],
    lastAccessed: new Date(),
  };
}

// Add a new column to a matrix
export function addColumn(matrix: DecisionMatrix, column: Omit<MatrixColumn, 'id'>): DecisionMatrix {
  const newColumn: MatrixColumn = {
    ...column,
    id: generateId(),
  };
  
  return {
    ...matrix,
    columns: [...matrix.columns, newColumn],
    lastAccessed: new Date(),
  };
}

// Calculate weighted scores for each column (for decision making)
export function calculateScores(matrix: DecisionMatrix): Record<string, number> {
  const scores: Record<string, number> = {};
  
  for (const column of matrix.columns) {
    let totalScore = 0;
    let totalWeight = 0;
    
    for (const row of matrix.rows) {
      const value = getMatrixValue(matrix, column.name, row.name);
      if (value !== undefined) {
        const weight = row.weight; // Use the built-in row weight
        const adjustedValue = row.inverted ? (5 - value) : value; // Invert if needed (5 becomes 1, 4 becomes 2, etc.)
        
        totalScore += adjustedValue * weight;
        totalWeight += weight;
      }
    }
    
    scores[column.name] = totalWeight > 0 ? totalScore / totalWeight : 0;
  }
  
  return scores;
}