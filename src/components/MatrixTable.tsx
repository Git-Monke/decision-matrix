import type { DecisionMatrix } from '@/types/matrix';
import { getMatrixValue } from '@/store/matrix-utils';

interface MatrixTableProps {
  matrix: DecisionMatrix;
}

// Helper function to get score color based on value and whether criteria is inverted
function getScoreColor(value: number, isInverted: boolean): string {
  // For inverted criteria (like price), higher values are worse
  const effectiveValue = isInverted ? (6 - value) : value;
  
  if (effectiveValue >= 4) {
    return 'bg-green-100 text-green-800';
  } else if (effectiveValue >= 3) {
    return 'bg-yellow-100 text-yellow-800';
  } else {
    return 'bg-red-100 text-red-800';
  }
}

export function MatrixTable({ matrix }: MatrixTableProps) {
  const { rows, columns } = matrix;

  // For templates, show empty state
  if (matrix.isTemplate && columns.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center bg-muted/20">
        <h3 className="text-lg font-semibold mb-2">Template Structure</h3>
        <p className="text-muted-foreground mb-4">
          This is a template with {rows.length} criteria defined. Add columns to start comparing options.
        </p>
        <div className="space-y-2">
          <h4 className="font-medium">Criteria:</h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {rows.map((row) => (
              <span
                key={row.id}
                className="bg-background border px-2 py-1 rounded text-sm"
              >
                {row.name} (Weight: {row.weight})
                {row.inverted && " - Inverted"}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // For matrices with no columns
  if (columns.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center bg-muted/20">
        <h3 className="text-lg font-semibold mb-2">No Options to Compare</h3>
        <p className="text-muted-foreground">
          Add some options (columns) to start building your decision matrix.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-semibold border-r">
                Criteria
              </th>
              {columns.map((column) => (
                <th key={column.id} className="text-center p-4 font-semibold border-r last:border-r-0">
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id} className={rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                <td className="p-4 border-r font-medium">
                  <div className="flex items-center justify-between">
                    <span>{row.name}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Weight: {row.weight}</span>
                      {row.inverted && (
                        <span className="bg-orange-100 text-orange-800 px-1 rounded">
                          Inverted
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                {columns.map((column) => {
                  const value = getMatrixValue(matrix, column.name, row.name);
                  return (
                    <td key={column.id} className="p-4 border-r last:border-r-0 text-center">
                      {value !== undefined ? (
                        <div className="flex items-center justify-center">
                          <span className={`
                            inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                            ${getScoreColor(value, row.inverted)}
                          `}>
                            {value}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}