import { useCallback, useState } from "react";

interface UseQueueProps<T> {
  initialData?: T[];
  maxSize?: number;
}

export function useQueue<T>(props?: UseQueueProps<T>) {
  const { initialData = [], maxSize = 20 } = props ?? {};

  const [queue, setQueue] = useState<T[]>(initialData);

  const add = useCallback(
    (element: T) => {
      setQueue((q) => [...q, element].slice(-1 * maxSize));
    },
    [maxSize]
  );

  const remove = useCallback(() => {
    let removedElement;

    setQueue(([first, ...q]) => {
      removedElement = first;
      return q;
    });

    return removedElement;
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
