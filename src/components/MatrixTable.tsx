import { useState } from "react";
import { useSetAtom } from "jotai";
import type { DecisionMatrix } from "@/types/matrix";
import {
  getMatrixValue,
  setMatrixValue,
  calculateScores,
  updateRowWeight,
  toggleRowInverted,
  updateRowName,
  updateColumnName,
  addRow,
  addColumn,
  deleteRow,
  deleteColumn,
  analyzeWinnerReasons,
} from "@/store/matrix-utils";
import { updateMatrixAtom } from "@/store/matrices";
import { DraggableValue } from "@/components/DraggableValue";
import { CriteriaControls } from "@/components/CriteriaControls";
import { InlineEdit } from "@/components/InlineEdit";
import { Crown, Plus, X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MatrixTableProps {
  matrix: DecisionMatrix;
}

export function MatrixTable({ matrix }: MatrixTableProps) {
  const { rows, columns } = matrix;
  const updateMatrix = useSetAtom(updateMatrixAtom);
  const [showResults, setShowResults] = useState(true);

  const handleValueChange = (
    columnName: string,
    rowName: string,
    newValue: number
  ) => {
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
    // Generate a unique name for the new criteria
    const existingNumbers = matrix.rows
      .map((row) => row.name.match(/^New Criteria (\d+)$/)?.[1])
      .filter(Boolean)
      .map(Number);

    const nextNumber =
      existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    const newCriteriaName = `New Criteria ${nextNumber}`;

    const updatedMatrix = addRow(matrix, {
      name: newCriteriaName,
      weight: 1,
      inverted: false,
    });
    updateMatrix(updatedMatrix);
  };

  const handleAddColumn = () => {
    // Generate a unique name for the new column
    const existingNumbers = matrix.columns
      .map((col) => col.name.match(/^New Option (\d+)$/)?.[1])
      .filter(Boolean)
      .map(Number);

    const nextNumber =
      existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    const newColumnName = `New Option ${nextNumber}`;

    const updatedMatrix = addColumn(matrix, {
      name: newColumnName,
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
  
  // Analyze winner reasons for explanation
  const winnerAnalysis = columns.length >= 2 ? analyzeWinnerReasons(matrix) : null;

  return (
    <div className="space-y-4">
      {columns.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {showResults ? "Results are visible" : "Results are hidden to avoid bias"}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResults(!showResults)}
            className="flex items-center gap-2"
          >
            {showResults ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide Results
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show Results
              </>
            )}
          </Button>
        </div>
      )}
      
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full">
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
                <th
                  key={column.id}
                  className="text-center p-4 group font-semibold border-r last:border-r-0"
                >
                  <div className="flex flex-row w-full items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteColumn(column.id)}
                      className="h-5 w-5 p-0 hidden group-hover:flex"
                    >
                      <X className="h-3 w-3" />
                    </Button>

                    <InlineEdit
                      value={column.name}
                      onSave={(newName) =>
                        handleColumnNameChange(column.id, newName)
                      }
                      placeholder="Column name"
                      className="font-semibold"
                    />
                    
                    <div className="h-5 w-5 hidden group-hover:flex" />
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
              <tr
                key={row.id}
                className={rowIndex % 2 === 0 ? "bg-background" : "bg-muted/20"}
              >
                <td className="p-4 border-r w-80">
                  <CriteriaControls
                    criteriaName={row.name}
                    weight={row.weight}
                    isInverted={row.inverted}
                    canDelete={true}
                    onWeightChange={(newWeight) =>
                      handleWeightChange(row.id, newWeight)
                    }
                    onInvertedToggle={() => handleInvertedToggle(row.id)}
                    onNameChange={(newName) =>
                      handleRowNameChange(row.id, newName)
                    }
                    onDelete={() => handleDeleteCriteria(row.id)}
                  />
                </td>
                {columns.map((column) => {
                  const value = getMatrixValue(matrix, column.name, row.name);
                  return (
                    <td
                      key={column.id}
                      className="p-4 border-r text-center"
                    >
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
            <tfoot className={`border-t-2 ${showResults ? 'bg-muted/30' : 'bg-muted/10'}`}>
              <tr>
                <td className="p-4 font-semibold border-r w-80">
                  {showResults ? 'Average' : 'Results'}
                </td>
                {showResults ? (
                  <>
                    {columns.map((column) => {
                      const score = scores[column.name] || 0;
                      const winner = isWinner(column.name);

                      return (
                        <td
                          key={column.id}
                          className="p-4 border-r text-center"
                        >
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
                  </>
                ) : (
                  <td className="p-4 text-center text-muted-foreground" colSpan={columns.length + 1}>
                    <div className="flex items-center justify-center gap-3">
                      <span className="italic">Results are toggled off</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowResults(true)}
                        className="flex items-center gap-1 h-6 px-2 text-xs"
                      >
                        <Eye className="h-3 w-3" />
                        Show
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            </tfoot>
          )}
        </table>
        </div>
      </div>
      
      {/* Winner explanation */}
      {showResults && winnerAnalysis && winnerAnalysis.winner && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Why {winnerAnalysis.winner} wins:</h3>
          <p className="text-blue-800">{winnerAnalysis.explanation}</p>
        </div>
      )}
    </div>
  );
}
