import { useState, useCallback, useRef, useEffect } from 'react';

interface UseDragOptions {
  initialValue: number;
  min?: number;
  max?: number;
  sensitivity?: number;
  onValueChange?: (value: number) => void;
}

export function useDrag({
  initialValue,
  min = 1,
  max = 5,
  sensitivity = 25,
  onValueChange,
}: UseDragOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewValue, setPreviewValue] = useState(initialValue);
  const dragStartX = useRef<number>(0);
  const startValue = useRef<number>(initialValue);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setIsDragging(true);
    dragStartX.current = event.clientX;
    startValue.current = initialValue;
    setPreviewValue(initialValue);
  }, [initialValue]);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    setIsDragging(true);
    dragStartX.current = event.touches[0].clientX;
    startValue.current = initialValue;
    setPreviewValue(initialValue);
  }, [initialValue]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = event.clientX - dragStartX.current;
    const valueChange = Math.floor(deltaX / sensitivity);
    const newValue = Math.max(min, Math.min(max, startValue.current + valueChange));
    
    setPreviewValue(newValue);
  }, [isDragging, min, max, sensitivity]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = event.touches[0].clientX - dragStartX.current;
    const valueChange = Math.floor(deltaX / sensitivity);
    const newValue = Math.max(min, Math.min(max, startValue.current + valueChange));
    
    setPreviewValue(newValue);
  }, [isDragging, min, max, sensitivity]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    if (previewValue !== initialValue && onValueChange) {
      onValueChange(previewValue);
    }
  }, [isDragging, previewValue, initialValue, onValueChange]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Add document event listeners when dragging starts
  useEffect(() => {
    if (isDragging) {
      // Set cursor to grabbing for entire document during drag
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none'; // Prevent text selection during drag
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        // Reset cursor and user select
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return {
    isDragging,
    currentValue: isDragging ? previewValue : initialValue,
    dragHandlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
    },
  };
}