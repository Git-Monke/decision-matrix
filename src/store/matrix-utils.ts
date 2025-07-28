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
  
  // Initialize data with 0 values for all criteria/option combinations
  const data: Record<string, Record<string, number>> = {};
  for (const column of columns) {
    data[column.name] = {};
    for (const row of rows) {
      data[column.name][row.name] = 0;
    }
  }
  
  return {
    id: generateId(),
    title: input.title,
    description: input.description,
    icon: input.icon,
    rows,
    columns,
    data,
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

// Delete a row from a matrix
export function deleteRow(matrix: DecisionMatrix, rowId: string): DecisionMatrix {
  const rowToDelete = matrix.rows.find(row => row.id === rowId);
  if (!rowToDelete) return matrix;

  // Remove the row
  const updatedRows = matrix.rows.filter(row => row.id !== rowId);

  // Remove data for this row from all columns
  const updatedData: Record<string, Record<string, number>> = {};
  Object.entries(matrix.data).forEach(([columnName, rowData]) => {
    const updatedRowData: Record<string, number> = {};
    Object.entries(rowData).forEach(([rowName, value]) => {
      if (rowName !== rowToDelete.name) {
        updatedRowData[rowName] = value;
      }
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

// Delete a column from a matrix
export function deleteColumn(matrix: DecisionMatrix, columnId: string): DecisionMatrix {
  const columnToDelete = matrix.columns.find(col => col.id === columnId);
  if (!columnToDelete) return matrix;

  // Remove the column
  const updatedColumns = matrix.columns.filter(col => col.id !== columnId);

  // Remove data for this column
  const updatedData: Record<string, Record<string, number>> = {};
  Object.entries(matrix.data).forEach(([columnName, rowData]) => {
    if (columnName !== columnToDelete.name) {
      updatedData[columnName] = rowData;
    }
  });

  return {
    ...matrix,
    columns: updatedColumns,
    data: updatedData,
    lastAccessed: new Date(),
  };
}

// Reset all matrix values to 0 while preserving structure
export function resetMatrixValues(matrix: DecisionMatrix): DecisionMatrix {
  const resetData: Record<string, Record<string, number>> = {};
  
  // Initialize all values to 0
  for (const column of matrix.columns) {
    resetData[column.name] = {};
    for (const row of matrix.rows) {
      resetData[column.name][row.name] = 0;
    }
  }
  
  return {
    ...matrix,
    data: resetData,
    lastAccessed: new Date(),
  };
}

// Advanced analysis of why the winner won
interface CriterionAnalysis {
  name: string;
  weight: number;
  winnerValue: number;
  runnerUpValue: number;
  winnerContribution: number;
  runnerUpContribution: number;
  advantage: number; // How much winner beats runner-up in this criterion
  isWinnerBest: boolean;
  isInverted: boolean;
}

interface WinnerAnalysis {
  winner: string;
  runnerUp: string;
  winnerScore: number;
  runnerUpScore: number;
  margin: number;
  marginPercentage: number;
  criteriaAnalysis: CriterionAnalysis[];
  strongCriteria: CriterionAnalysis[]; // Where winner significantly beats runner-up
  weakCriteria: CriterionAnalysis[]; // Where runner-up beats winner
  explanation: string;
  winType: 'dominant' | 'strategic' | 'balanced' | 'close' | 'upset';
}

export function analyzeWinnerReasons(matrix: DecisionMatrix): WinnerAnalysis | null {
  if (matrix.columns.length < 2) return null;

  const scores = calculateScores(matrix);
  const sortedColumns = matrix.columns
    .map(col => ({ name: col.name, score: scores[col.name] || 0 }))
    .sort((a, b) => b.score - a.score);

  if (sortedColumns.length < 2) return null;

  const winner = sortedColumns[0].name;
  const runnerUp = sortedColumns[1].name;
  const winnerScore = sortedColumns[0].score;
  const runnerUpScore = sortedColumns[1].score;
  const margin = winnerScore - runnerUpScore;
  const marginPercentage = runnerUpScore > 0 ? (margin / runnerUpScore) * 100 : 0;

  // Analyze each criterion in detail
  const criteriaAnalysis: CriterionAnalysis[] = matrix.rows.map(row => {
    const winnerValue = getMatrixValue(matrix, winner, row.name) || 0;
    const runnerUpValue = getMatrixValue(matrix, runnerUp, row.name) || 0;
    
    // Calculate adjusted values (accounting for inversion)
    const winnerAdjusted = row.inverted ? (6 - winnerValue) : winnerValue;
    const runnerUpAdjusted = row.inverted ? (6 - runnerUpValue) : runnerUpValue;
    
    // Calculate contributions to final score
    const winnerContribution = winnerAdjusted * row.weight;
    const runnerUpContribution = runnerUpAdjusted * row.weight;
    const advantage = winnerContribution - runnerUpContribution;
    
    // Determine if winner has best value for this criterion across all options
    const allValues = matrix.columns.map(col => getMatrixValue(matrix, col.name, row.name) || 0);
    let bestValue: number;
    if (row.inverted) {
      const nonZeroValues = allValues.filter(v => v > 0);
      bestValue = nonZeroValues.length > 0 ? Math.min(...nonZeroValues) : 0;
    } else {
      bestValue = Math.max(...allValues);
    }
    const isWinnerBest = winnerValue === bestValue && bestValue > 0;

    return {
      name: row.name,
      weight: row.weight,
      winnerValue,
      runnerUpValue,
      winnerContribution,
      runnerUpContribution,
      advantage,
      isWinnerBest,
      isInverted: row.inverted,
    };
  });

  // Categorize criteria by performance
  const strongCriteria = criteriaAnalysis.filter(c => c.advantage > 0);
  const weakCriteria = criteriaAnalysis.filter(c => c.advantage < 0);

  // Determine win type
  let winType: WinnerAnalysis['winType'] = 'balanced';
  
  if (weakCriteria.length === 0 && strongCriteria.length > 0) {
    winType = 'dominant';
  } else if (marginPercentage < 10) {
    winType = 'close';
  } else {
    // Check if winner excels in high-weight criteria
    const highWeightStrong = strongCriteria.filter(c => c.weight >= 4);
    const highWeightWeak = weakCriteria.filter(c => c.weight >= 4);
    
    if (highWeightStrong.length > highWeightWeak.length) {
      winType = 'strategic';
    } else if (highWeightWeak.length > highWeightStrong.length) {
      winType = 'upset';
    }
  }

  // Generate sophisticated explanation
  const explanation = generateAdvancedExplanation({
    winner,
    runnerUp,
    winnerScore,
    runnerUpScore,
    margin,
    marginPercentage,
    criteriaAnalysis,
    strongCriteria,
    weakCriteria,
    winType,
  });

  return {
    winner,
    runnerUp,
    winnerScore,
    runnerUpScore,
    margin,
    marginPercentage,
    criteriaAnalysis,
    strongCriteria,
    weakCriteria,
    explanation,
    winType,
  };
}

function generateAdvancedExplanation(analysis: Omit<WinnerAnalysis, 'explanation'>): string {
  const {
    winner,
    runnerUp,
    winnerScore,
    runnerUpScore,
    margin,
    marginPercentage,
    strongCriteria,
    weakCriteria,
    winType,
  } = analysis;

  // Filter out any undefined/null values and sort criteria by impact
  const topStrengths = strongCriteria
    .filter(c => c && c.name && typeof c.advantage === 'number')
    .sort((a, b) => b.advantage - a.advantage)
    .slice(0, 3);
  
  const topWeaknesses = weakCriteria
    .filter(c => c && c.name && typeof c.advantage === 'number')
    .sort((a, b) => a.advantage - b.advantage)
    .slice(0, 2);

  // Fallback if no valid criteria data
  if (topStrengths.length === 0 && topWeaknesses.length === 0) {
    return `${winner} wins with a score of ${winnerScore.toFixed(1)} compared to ${runnerUp}'s ${runnerUpScore.toFixed(1)}.`;
  }

  switch (winType) {
    case 'dominant':
      if (topStrengths.length === 1) {
        return `${winner} dominates by excelling in ${topStrengths[0].name} (contributing +${topStrengths[0].advantage.toFixed(1)} points) while maintaining superiority across all other criteria, winning ${winnerScore.toFixed(1)} to ${runnerUpScore.toFixed(1)}.`;
      } else if (topStrengths.length > 0) {
        const strengthList = topStrengths.map(c => `${c.name} (+${c.advantage.toFixed(1)})`).join(', ');
        return `${winner} achieves a dominant ${winnerScore.toFixed(1)}-${runnerUpScore.toFixed(1)} victory by outperforming ${runnerUp} in every area, with key advantages in ${strengthList} points.`;
      } else {
        return `${winner} achieves a dominant victory, winning ${winnerScore.toFixed(1)} to ${runnerUpScore.toFixed(1)}.`;
      }

    case 'strategic':
      const strategicAdvantages = topStrengths
        .filter(c => c && c.weight >= 4)
        .map(c => `${c.name} (weight ${c.weight}, +${c.advantage.toFixed(1)} points)`)
        .join(' and ');
      
      if (strategicAdvantages && topWeaknesses.length > 0) {
        const weaknessList = topWeaknesses.map(c => c.name).join(' and ');
        return `${winner} wins strategically (${winnerScore.toFixed(1)} vs ${runnerUpScore.toFixed(1)}) by excelling in the most critical areas: ${strategicAdvantages}. While ${runnerUp} leads in ${weaknessList}, these lower-priority criteria couldn't overcome ${winner}'s ${margin.toFixed(1)}-point advantage in high-weight areas.`;
      } else if (strategicAdvantages) {
        return `${winner} wins strategically by focusing on what matters most: ${strategicAdvantages}, securing a ${margin.toFixed(1)}-point victory (${winnerScore.toFixed(1)} to ${runnerUpScore.toFixed(1)}).`;
      } else {
        return `${winner} wins strategically with a ${margin.toFixed(1)}-point victory (${winnerScore.toFixed(1)} to ${runnerUpScore.toFixed(1)}).`;
      }

    case 'close':
      if (topStrengths.length > 0) {
        const decisiveFactor = topStrengths[0];
        return `${winner} narrowly beats ${runnerUp} ${winnerScore.toFixed(1)} to ${runnerUpScore.toFixed(1)} (${marginPercentage.toFixed(1)}% margin) with the decisive factor being ${decisiveFactor.name}, where ${winner} contributed ${decisiveFactor.advantage.toFixed(1)} more points than ${runnerUp}.`;
      } else {
        return `${winner} narrowly beats ${runnerUp} ${winnerScore.toFixed(1)} to ${runnerUpScore.toFixed(1)} (${marginPercentage.toFixed(1)}% margin).`;
      }

    case 'upset':
      if (topWeaknesses.length > 0 && topStrengths.length > 0) {
        const upsetWeakness = topWeaknesses.map(c => `${c.name} (${c.advantage.toFixed(1)} points behind)`).join(' and ');
        const compensatingStrength = topStrengths.map(c => `${c.name} (+${c.advantage.toFixed(1)})`).join(' and ');
        return `${winner} pulls off an upset victory (${winnerScore.toFixed(1)} vs ${runnerUpScore.toFixed(1)}) despite ${runnerUp} leading in important areas like ${upsetWeakness}. ${winner}'s strong performance in ${compensatingStrength} combined with favorable weighting secured the win.`;
      } else {
        return `${winner} pulls off an upset victory (${winnerScore.toFixed(1)} vs ${runnerUpScore.toFixed(1)}) through favorable weighting.`;
      }

    case 'balanced':
    default:
      if (topStrengths.length >= 2) {
        const balancedStrengths = topStrengths.slice(0, 2).map(c => c.name).join(' and ');
        return `${winner} wins through consistent performance across all criteria (${winnerScore.toFixed(1)} to ${runnerUpScore.toFixed(1)}), with particular strength in ${balancedStrengths}, accumulating enough small advantages to secure a ${margin.toFixed(1)}-point victory.`;
      } else if (topStrengths.length === 1) {
        return `${winner} wins through consistent performance across all criteria (${winnerScore.toFixed(1)} to ${runnerUpScore.toFixed(1)}), with particular strength in ${topStrengths[0].name}, securing a ${margin.toFixed(1)}-point victory.`;
      } else {
        return `${winner} wins through consistent performance across all criteria (${winnerScore.toFixed(1)} to ${runnerUpScore.toFixed(1)}), securing a ${margin.toFixed(1)}-point victory.`;
      }
  }
}