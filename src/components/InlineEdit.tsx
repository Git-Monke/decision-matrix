import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface InlineEditProps {
  value: string;
  onSave: (newValue: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
  maxLength?: number;
}

export function InlineEdit({
  value,
  onSave,
  placeholder = 'Enter text...',
  className = '',
  inputClassName = '',
  multiline = false,
  maxLength,
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Update current value when prop changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // Focus and select text when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    const trimmedValue = currentValue.trim();
    if (trimmedValue && trimmedValue !== value) {
      onSave(trimmedValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Enter' && multiline && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleBlur = () => {
    // Small delay to allow for potential clicks on save button
    setTimeout(() => {
      handleCancel();
    }, 100);
  };

  if (isEditing) {
    const InputComponent = multiline ? 'textarea' : 'input';
    
    return (
      <InputComponent
        ref={inputRef as any}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        className={cn(
          'w-full bg-background border border-input rounded px-2 py-1',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'text-sm font-medium resize-none',
          inputClassName
        )}
        rows={multiline ? 2 : undefined}
      />
    );
  }

  return (
    <span
      onClick={handleClick}
      className={cn(
        'cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded transition-colors',
        'text-sm font-medium select-none',
        !value && 'text-muted-foreground italic',
        className
      )}
      title="Click to edit"
    >
      {value || placeholder}
    </span>
  );
}