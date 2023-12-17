import { useCallback, useState } from "react";

interface UseQueueProps<T> {
  initialData?: T[];
  maxSize?: number;
}

/**
 * Filter function, gets original array and returns the desired array
 */
type Filter<T> = (originalArray: T[]) => T[];

export function useQueue<T>(props?: UseQueueProps<T>) {
  const { initialData = [], maxSize = 20 } = props ?? {};

  const [queue, setQueue] = useState<T[]>(initialData);

  const add = useCallback(
    (element: T) => {
      setQueue((q) => [...q, element].slice(-1 * maxSize));
    },
    [maxSize]
  );

  const remove = useCallback((callback: Filter<T>) => {
    setQueue((elements) => {
      return callback(elements);
    });
  }, []);

  const clear = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    add,
    remove,
    clear,
    queue,
  };
}
