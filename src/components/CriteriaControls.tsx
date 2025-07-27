import { useDrag } from '@/hooks/useDrag';
import { Check, X } from 'lucide-react';

interface CriteriaControlsProps {
  criteriaName: string;
  weight: number;
  isInverted: boolean;
  onWeightChange: (newWeight: number) => void;
  onInvertedToggle: () => void;
}

export function CriteriaControls({
  criteriaName,
  weight,
  isInverted,
  onWeightChange,
  onInvertedToggle,
}: CriteriaControlsProps) {
  const { isDragging, currentValue, dragHandlers } = useDrag({
    initialValue: weight,
    onValueChange: onWeightChange,
  });

  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium">{criteriaName}</span>
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
      </div>
    </div>
  );
}