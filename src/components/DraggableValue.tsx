import { useDrag } from '@/hooks/useDrag';

interface DraggableValueProps {
  value: number;
  isInverted: boolean;
  onValueChange: (newValue: number) => void;
}

// Helper function to get score color based on value and whether criteria is inverted
function getScoreColor(value: number, isInverted: boolean): string {
  // Handle 0 values with gray styling
  if (value === 0) {
    return 'bg-gray-100 text-gray-500';
  }
  
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

export function DraggableValue({ value, isInverted, onValueChange }: DraggableValueProps) {
  const { isDragging, currentValue, dragHandlers } = useDrag({
    initialValue: value,
    onValueChange,
  });

  return (
    <div className="flex items-center justify-center">
      <span
        className={`
          inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
          cursor-grab active:cursor-grabbing select-none
          transition-colors duration-200 ease-out
          ${isDragging ? 'scale-105' : ''}
          ${getScoreColor(currentValue, isInverted)}
        `}
        {...dragHandlers}
      >
        {currentValue}
      </span>
    </div>
  );
}