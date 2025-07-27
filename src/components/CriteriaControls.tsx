import { useDrag } from '@/hooks/useDrag';
import { InlineEdit } from '@/components/InlineEdit';
import { Check, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CriteriaControlsProps {
  criteriaName: string;
  weight: number;
  isInverted: boolean;
  canDelete?: boolean;
  onWeightChange: (newWeight: number) => void;
  onInvertedToggle: () => void;
  onNameChange: (newName: string) => void;
  onDelete?: () => void;
}

export function CriteriaControls({
  criteriaName,
  weight,
  isInverted,
  canDelete = false,
  onWeightChange,
  onInvertedToggle,
  onNameChange,
  onDelete,
}: CriteriaControlsProps) {
  const { isDragging, currentValue, dragHandlers } = useDrag({
    initialValue: weight,
    onValueChange: onWeightChange,
  });

  return (
    <div className="flex flex-col gap-1">
      <InlineEdit
        value={criteriaName}
        onSave={onNameChange}
        placeholder="Criteria name"
        className="font-medium"
      />
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Weight:</span>
          <span
            className={`
              inline-flex items-center justify-center w-5 h-5 rounded text-xs font-medium
              cursor-grab active:cursor-grabbing select-none
              transition-colors duration-200 ease-out
              ${isDragging ? 'scale-105' : ''}
              bg-blue-100 text-blue-800
            `}
            {...dragHandlers}
          >
            {currentValue}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onInvertedToggle}
            className={`
              inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium
              transition-colors duration-200 ease-out
              ${isInverted 
                ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' 
                : 'bg-green-100 text-green-800 hover:bg-green-200'
              }
            `}
          >
            {isInverted ? (
              <>
                <X className="h-2.5 w-2.5" />
                <span>Inverted</span>
              </>
            ) : (
              <>
                <Check className="h-2.5 w-2.5" />
                <span>Normal</span>
              </>
            )}
          </button>
        </div>
        {canDelete && onDelete && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="h-5 w-5 p-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}