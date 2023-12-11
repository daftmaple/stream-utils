/**
 * Interface for class which can be transformed to T on transform() call
 */
export abstract class Transformable<T> {
  abstract transform(): T | null;
}
