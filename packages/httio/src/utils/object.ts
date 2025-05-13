import type { PlaneObject } from "~/types/data";
import { isPlaneObject } from "~/utils/validate";

type DeepMergeResult<T, U> = T extends PlaneObject ? (U extends PlaneObject ? MergeObjects<T, U> : U) : U;

type MergeObjects<T extends PlaneObject, U extends PlaneObject> = {
  [K in keyof T & keyof U]: K extends keyof U ? (K extends keyof T ? DeepMergeResult<T[K], U[K]> : U[K]) : T[K];
};

export function assign<T, U>(target: T, source: U): T & U;
export function assign<T, U1, U2>(target: T, source1: U1, source2: U2): T & U1 & U2;
export function assign<T, U1, U2, U3>(target: T, source1: U1, source2: U2, source3: U3): T & U1 & U2 & U3;
// eslint-disable-next-line prettier/prettier
export function assign<T, U1, U2, U3, U4>(target: T, source1: U1, source2: U2, source3: U3, source4: U4): T & U1 & U2 & U3 & U4;
export function assign(target: object, ...source: object[]): object {
  return Object.assign(target, ...source);
}

export function clone<T extends object, K extends keyof T = keyof T>(source: T, ...keys: K[]): Pick<T, K> {
  if (keys.length === 0) {
    return { ...source } as Pick<T, K>;
  }

  const result = {} as Pick<T, K>;

  for (const key of keys) {
    result[key] = source[key];
  }

  return result;
}

// eslint-disable-next-line prettier/prettier
export function define<T, K extends PropertyKey, U>(target: T, key: K, get: () => U, set?: (value: U) => void): T & { [P in K]: U } {
  return Object.defineProperty(target as never, key, {
    configurable: true,
    enumerable: true,

    get,
    set,
  });
}

export function merge<T, U>(target: T, source: U): DeepMergeResult<T, U> {
  const references = new Set();

  function combine<V, W>(a: V, b: W): DeepMergeResult<V, W> {
    if (references.has(b) || !isPlaneObject(a) || !isPlaneObject(b)) {
      return b as DeepMergeResult<V, W>;
    }

    references.add(b);

    const result = clone(a) as PlaneObject;

    for (const key of Object.getOwnPropertyNames(b)) {
      result[key] = combine(a[key], b[key]);
    }

    for (const key of Object.getOwnPropertySymbols(b)) {
      result[key as never] = combine(a[key as never], b[key as never]);
    }

    return result as DeepMergeResult<V, W>;
  }

  return combine(target, source);
}

export function references<T, K extends keyof T>(target: T, ...properties: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const property of properties) {
    define(
      result,
      property,
      () => target[property],
      (value) => {
        target[property] = value;
      }
    );
  }

  return result;
}
