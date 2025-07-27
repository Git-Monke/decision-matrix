import { useSetAtom } from 'jotai';
import type { DecisionMatrix } from '@/types/matrix';
import { getMatrixValue, setMatrixValue, calculateScores, updateRowWeight, toggleRowInverted } from '@/store/matrix-utils';
import { updateMatrixAtom } from '@/store/matrices';
import { DraggableValue } from '@/components/DraggableValue';
import { CriteriaControls } from '@/components/CriteriaControls';
import { Crown } from 'lucide-react';

interface MatrixTableProps {
  matrix: DecisionMatrix;
}


export function MatrixTable({ matrix }: MatrixTableProps) {
  const { rows, columns } = matrix;
  const updateMatrix = useSetAtom(updateMatrixAtom);

  const handleValueChange = (columnName: string, rowName: string, newValue: number) => {
    const updatedMatrix = setMatrixValue(matrix, columnName, rowName, newValue);
    updateMatrix(updatedMatrix);
  };

  const handleWeightChange = (rowId: string, newWeight: number) => {
    const updatedMatrix = updateRowWeight(matrix, rowId, newWeight);
    updateMatrix(updatedMatrix);
  };

  const handleInvertedToggle = (rowId: string) => {
    const updatedMatrix = toggleRowInverted(matrix, rowId);
    updateMatrix(updatedMatrix);
  };

  // Calculate scores for columns (only if we have data)
  const scores = columns.length > 0 ? calculateScores(matrix) : {};
  const maxScore = Math.max(...Object.values(scores));
  const isWinner = (columnName: string) => scores[columnName] === maxScore;

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
                <td className="p-4 border-r">
                  <CriteriaControls
                    criteriaName={row.name}
                    weight={row.weight}
                    isInverted={row.inverted}
                    onWeightChange={(newWeight) => handleWeightChange(row.id, newWeight)}
                    onInvertedToggle={() => handleInvertedToggle(row.id)}
                  />
                </td>
                {columns.map((column) => {
                  const value = getMatrixValue(matrix, column.name, row.name);
                  return (
                    <td key={column.id} className="p-4 border-r last:border-r-0 text-center">
                      {value !== undefined ? (
                        <DraggableValue
                          value={value}
                          isInverted={row.inverted}
                          onValueChange={(newValue) => 
                            handleValueChange(column.name, row.name, newValue)
                          }
                        />
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          
          {/* Footer with averages */}
          {columns.length > 0 && (
            <tfoot className="bg-muted/30 border-t-2">
              <tr>
                <td className="p-4 font-semibold border-r">
                  Average
                </td>
                {columns.map((column) => {
                  const score = scores[column.name] || 0;
                  const winner = isWinner(column.name);
                  
                  return (
                    <td key={column.id} className="p-4 border-r last:border-r-0 text-center">
                      <div className="flex items-center justify-center">
                        {winner ? (
                          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
                            <Crown className="h-3 w-3" />
                            <span>{score.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
                            {score.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}