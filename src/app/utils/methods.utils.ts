import axios from "axios";
import { useState, useEffect } from "react";

export function handleError(error: unknown) {
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  } else if (error instanceof Error) throw new Error("Something went wrong");
}

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
