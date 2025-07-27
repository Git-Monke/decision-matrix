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
  
  // Initialize data for all existing columns with 0 values
  const updatedData = { ...matrix.data };
  for (const column of matrix.columns) {
    if (!updatedData[column.name]) {
      updatedData[column.name] = {};
    }
    updatedData[column.name][newRow.name] = 0;
  }
  
  return {
    ...matrix,
    rows: [...matrix.rows, newRow],
    data: updatedData,
    lastAccessed: new Date(),
  };
}

// Add a new column to a matrix
export function addColumn(matrix: DecisionMatrix, column: Omit<MatrixColumn, 'id'>): DecisionMatrix {
  const newColumn: MatrixColumn = {
    ...column,
    id: generateId(),
  };
  
  // Initialize data for all existing rows with 0 values
  const updatedData = { ...matrix.data };
  if (!updatedData[newColumn.name]) {
    updatedData[newColumn.name] = {};
  }
  for (const row of matrix.rows) {
    updatedData[newColumn.name][row.name] = 0;
  }
  
  return {
    ...matrix,
    columns: [...matrix.columns, newColumn],
    data: updatedData,
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
      if (value !== undefined && value !== 0) {
        const weight = row.weight; // Use the built-in row weight
        const adjustedValue = row.inverted ? (6 - value) : value; // Invert if needed (5 becomes 1, 4 becomes 2, etc.)
        
        totalScore += adjustedValue * weight;
        totalWeight += weight;
      }
    }
    
    scores[column.name] = totalScore;
  }
  
  return scores;
}

// Update the weight of a specific row
export function updateRowWeight(matrix: DecisionMatrix, rowId: string, newWeight: number): DecisionMatrix {
  return {
    ...matrix,
    rows: matrix.rows.map(row => 
      row.id === rowId ? { ...row, weight: newWeight } : row
    ),
    lastAccessed: new Date(),
  };
}

// Toggle the inverted status of a specific row
export function toggleRowInverted(matrix: DecisionMatrix, rowId: string): DecisionMatrix {
  return {
    ...matrix,
    rows: matrix.rows.map(row => 
      row.id === rowId ? { ...row, inverted: !row.inverted } : row
    ),
    lastAccessed: new Date(),
  };
}

// Update the name of a specific row
export function updateRowName(matrix: DecisionMatrix, rowId: string, newName: string): DecisionMatrix {
  const oldRow = matrix.rows.find(row => row.id === rowId);
  if (!oldRow) return matrix;

  const oldName = oldRow.name;
  
  // Check if new name already exists in other rows
  const nameExists = matrix.rows.some(row => row.id !== rowId && row.name === newName);
  if (nameExists) return matrix;
  
  // Update row name
  const updatedRows = matrix.rows.map(row => 
    row.id === rowId ? { ...row, name: newName } : row
  );

  // Update data keys to use new row name
  const updatedData: Record<string, Record<string, number>> = {};
  Object.entries(matrix.data).forEach(([columnName, rowData]) => {
    const updatedRowData: Record<string, number> = {};
    Object.entries(rowData).forEach(([rowName, value]) => {
      const newRowName = rowName === oldName ? newName : rowName;
      updatedRowData[newRowName] = value;
    });
    updatedData[columnName] = updatedRowData;
  });

  return {
    ...matrix,
    rows: updatedRows,
    data: updatedData,
    lastAccessed: new Date(),
  };
}

// Update the name of a specific column
export function updateColumnName(matrix: DecisionMatrix, columnId: string, newName: string): DecisionMatrix {
  const oldColumn = matrix.columns.find(col => col.id === columnId);
  if (!oldColumn) return matrix;

  const oldName = oldColumn.name;
  
  // Check if new name already exists in other columns
  const nameExists = matrix.columns.some(col => col.id !== columnId && col.name === newName);
  if (nameExists) return matrix;
  
  // Update column name
  const updatedColumns = matrix.columns.map(column => 
    column.id === columnId ? { ...column, name: newName } : column
  );

  // Update data keys to use new column name
  const updatedData: Record<string, Record<string, number>> = {};
  Object.entries(matrix.data).forEach(([columnName, rowData]) => {
    const newColumnName = columnName === oldName ? newName : columnName;
    updatedData[newColumnName] = rowData;
  });

  return {
    ...matrix,
    columns: updatedColumns,
    data: updatedData,
    lastAccessed: new Date(),
  };
}