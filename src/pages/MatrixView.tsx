import { useParams } from 'react-router';

export default function MatrixView() {
  const { matrixId } = useParams();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Matrix View</h1>
      <p className="text-muted-foreground mb-4">
        Hello world! This is the matrix view for matrix ID: <span className="font-mono bg-muted px-1 rounded">{matrixId}</span>
      </p>
      <p className="text-sm text-muted-foreground">
        This is a placeholder component that will eventually show the full matrix interface.
      </p>
    </div>
  );
}