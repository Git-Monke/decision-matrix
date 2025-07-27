import { useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { getMatrixByIdAtom } from '@/store/matrices';
import { getIcon } from '@/lib/icons';
import { MatrixTable } from '@/components/MatrixTable';

export default function MatrixView() {
  const { matrixId } = useParams();
  const getMatrixById = useAtomValue(getMatrixByIdAtom);
  const matrix = matrixId ? getMatrixById(matrixId) : null;

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
        <div className="flex items-center gap-3 mb-2">
          <Icon className="h-6 w-6" />
          <h1 className="text-2xl font-bold">{matrix.title}</h1>
          {matrix.isTemplate && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Template
            </span>
          )}
        </div>
        {matrix.description && (
          <p className="text-muted-foreground">{matrix.description}</p>
        )}
      </div>

      <MatrixTable matrix={matrix} />
    </div>
  );
}