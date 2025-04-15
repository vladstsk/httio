import { isPlaneObject } from "~/utils/validate";

type MergeResult<T, U> = T extends PlaneObject
  ? U extends PlaneObject
    ? {
        [K in keyof (T & U)]: K extends keyof T & keyof U
          ? MergeResult<T[K], U[K]>
          : K extends keyof U
            ? U[K]
            : K extends keyof T
              ? T[K]
              : never;
      }
    : U
  : U;

type PlaneObject = Record<string, unknown>;

export default function merge<T, U>(target: T, source: U): MergeResult<T, U> {
  const references = new Set();

  function combine<V, W>(a: V, b: W): MergeResult<V, W> {
    if (references.has(b)) {
      return b as MergeResult<V, W>;
    }

    if (isPlaneObject(a) && isPlaneObject(b)) {
      references.add(b);

      const result = { ...a } as PlaneObject;

      for (const key of Object.getOwnPropertyNames(b)) {
        result[key] = combine(a[key], b[key]);
      }

      for (const key of Object.getOwnPropertySymbols(b)) {
        result[key as never] = combine(a[key as never], b[key as never]);
      }

      return result as MergeResult<V, W>;
    }

    return b as MergeResult<V, W>;
  }

  return combine(target, source);
}
