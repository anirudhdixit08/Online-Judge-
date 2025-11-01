import { useState, useEffect } from 'react';

// This hook takes a value (like search text) and a delay
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update the value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay); // Wait 500ms after user stops typing

    // Clean up the timer if the value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};