import { useState, useEffect } from 'react';

/* Debounce any fast changing value. 
The debounced value will only reflect the latest value when ...
... the useDebounce hook has not been called for the specified time period. 
When used in conjunction with useEffect, you can ensure that expensive operations like...
... API calls are not executed too frequently.  */
function useDebounce(value, delay, callback) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // stop timer when value or delay changes
      const handler = setTimeout(() => {
        setDebouncedValue(value); // catch up when timer stops
        callback(); // callback when timer stops too
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This prevents the debounced value from updating if ...
      // ... value is changed within the delay period.
      // Timeout gets cleared and restarted when it does change within delay period.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay, callback] // Only re-call effect if value or delay changes
  );
  return [debouncedValue];
}
export default useDebounce;
