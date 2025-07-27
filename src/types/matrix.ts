export interface MatrixRow {
  id: string;
  name: string;
  inverted: boolean; // true = higher values are worse (e.g., Price, Pain)
  weight: number; // 1-5 scale, how important this criterion is
}

export interface MatrixColumn {
  id: string;
  name: string; // e.g., "Greece", "Italy", "Honda Civic"
}

export interface DecisionMatrix {
  id: string;
  title: string;
  description?: string;
  icon: string; // Icon name as string (e.g., "Car", "Home", "Briefcase")
  rows: MatrixRow[];
  columns: MatrixColumn[];
  data: Record<string, Record<string, number>>; // data[columnName][rowName] = value
  isTemplate: boolean;
  createdAt: Date;
  lastAccessed: Date;
}

// Helper types for creating new matrices
export interface CreateMatrixInput {
  title: string;
  description?: string;
  icon: string;
  rows: Omit<MatrixRow, 'id'>[];
  columns: Omit<MatrixColumn, 'id'>[];
  isTemplate?: boolean;
}

export interface UpdateMatrixInput {
  id: string;
  title?: string;
  description?: string;
  icon?: string;
  rows?: MatrixRow[];
  columns?: MatrixColumn[];
  data?: Record<string, Record<string, number>>;
}