import { useSetAtom } from 'jotai';
import type { DecisionMatrix } from '@/types/matrix';
import { getMatrixValue, setMatrixValue, calculateScores, updateRowWeight, toggleRowInverted, updateRowName, updateColumnName, addRow, addColumn, deleteRow, deleteColumn } from '@/store/matrix-utils';
import { updateMatrixAtom } from '@/store/matrices';
import { DraggableValue } from '@/components/DraggableValue';
import { CriteriaControls } from '@/components/CriteriaControls';
import { InlineEdit } from '@/components/InlineEdit';
import { Crown, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const handleRowNameChange = (rowId: string, newName: string) => {
    const updatedMatrix = updateRowName(matrix, rowId, newName);
    updateMatrix(updatedMatrix);
  };

  const handleColumnNameChange = (columnId: string, newName: string) => {
    const updatedMatrix = updateColumnName(matrix, columnId, newName);
    updateMatrix(updatedMatrix);
  };

  const handleAddCriteria = () => {
    const updatedMatrix = addRow(matrix, {
      name: 'New Criteria',
      weight: 1,
      inverted: false,
    });
    updateMatrix(updatedMatrix);
  };

  const handleAddColumn = () => {
    const updatedMatrix = addColumn(matrix, {
      name: 'New Option',
    });
    updateMatrix(updatedMatrix);
  };

  const handleDeleteCriteria = (rowId: string) => {
    const updatedMatrix = deleteRow(matrix, rowId);
    updateMatrix(updatedMatrix);
  };

  const handleDeleteColumn = (columnId: string) => {
    const updatedMatrix = deleteColumn(matrix, columnId);
    updateMatrix(updatedMatrix);
  };

  // Calculate scores for columns (only if we have data)
  const scores = columns.length > 0 ? calculateScores(matrix) : {};
  const maxScore = Math.max(...Object.values(scores));
  const isWinner = (columnName: string) => scores[columnName] === maxScore;



  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-semibold border-r w-80">
                <div className="flex items-center justify-between">
                  <span>Criteria</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddCriteria}
                    className="h-6 px-2"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </th>
              {columns.map((column) => (
                <th key={column.id} className="text-center p-4 font-semibold border-r last:border-r-0 w-48">
                  <div className="flex flex-col items-center gap-2">
                    <InlineEdit
                      value={column.name}
                      onSave={(newName) => handleColumnNameChange(column.id, newName)}
                      placeholder="Column name"
                      className="font-semibold"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteColumn(column.id)}
                      className="h-5 w-5 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </th>
              ))}
              <th className="text-center p-4 font-semibold">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddColumn}
                  className="h-6 px-2"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  <span className="text-xs">Add Column</span>
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id} className={rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                <td className="p-4 border-r w-80">
                  <CriteriaControls
                    criteriaName={row.name}
                    weight={row.weight}
                    isInverted={row.inverted}
                    canDelete={true}
                    onWeightChange={(newWeight) => handleWeightChange(row.id, newWeight)}
                    onInvertedToggle={() => handleInvertedToggle(row.id)}
                    onNameChange={(newName) => handleRowNameChange(row.id, newName)}
                    onDelete={() => handleDeleteCriteria(row.id)}
                  />
                </td>
                {columns.map((column) => {
                  const value = getMatrixValue(matrix, column.name, row.name);
                  return (
                    <td key={column.id} className="p-4 border-r text-center w-48">
                      {matrix.isTemplate ? (
                        <span className="text-muted-foreground text-sm">-</span>
                      ) : value !== undefined ? (
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
                <td className="p-4"></td>
              </tr>
            ))}
          </tbody>
          
          {/* Footer with averages */}
          {columns.length > 0 && (
            <tfoot className="bg-muted/30 border-t-2">
              <tr>
                <td className="p-4 font-semibold border-r w-80">
                  Average
                </td>
                {columns.map((column) => {
                  const score = scores[column.name] || 0;
                  const winner = isWinner(column.name);
                  
                  return (
                    <td key={column.id} className="p-4 border-r text-center w-48">
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
                <td className="p-4"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}