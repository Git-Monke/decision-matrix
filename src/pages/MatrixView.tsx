import { useState } from 'react';
import { useParams } from 'react-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { getMatrixByIdAtom, updateMatrixAtom } from '@/store/matrices';
import { resetMatrixValues } from '@/store/matrix-utils';
import { getIcon } from '@/lib/icons';
import { MatrixTable } from '@/components/MatrixTable';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RotateCcw } from 'lucide-react';

export default function MatrixView() {
  const { matrixId } = useParams();
  const getMatrixById = useAtomValue(getMatrixByIdAtom);
  const updateMatrix = useSetAtom(updateMatrixAtom);
  const matrix = matrixId ? getMatrixById(matrixId) : null;
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleResetValues = () => {
    if (matrix) {
      const resetMatrix = resetMatrixValues(matrix);
      updateMatrix(resetMatrix);
      setShowResetDialog(false);
    }
  };

  if (!matrix) {
    return (
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold mb-4">Matrix Not Found</h1>
        <p className="text-muted-foreground">
          Could not find matrix with ID: <span className="font-mono bg-muted px-1 rounded">{matrixId}</span>
        </p>
      </div>
    );
  }

  const Icon = getIcon(matrix.icon);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6" />
            <h1 className="text-2xl font-bold">{matrix.title}</h1>
            {matrix.isTemplate && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Template
              </span>
            )}
          </div>
          {!matrix.isTemplate && matrix.columns.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResetDialog(true)}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Values
            </Button>
          )}
        </div>
        {matrix.description && (
          <p className="text-muted-foreground">{matrix.description}</p>
        )}
      </div>

      <MatrixTable matrix={matrix} />

      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Matrix Values</DialogTitle>
            <DialogDescription>
              This will reset all values in the matrix to 0. The structure (criteria, options, weights) will remain unchanged. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleResetValues}>
              Reset All Values
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}