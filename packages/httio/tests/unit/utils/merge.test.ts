/* eslint-disable @typescript-eslint/no-explicit-any */

import merge from "~/utils/merge";

describe("merge", () => {
  test("should merge two plain objects with primitive properties", () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };

    const result = merge(target, source);

    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  test("should handle objects with symbol keys", () => {
    const target = { [Symbol("key")]: "value1" };
    const source = { [Symbol("key")]: "value2" };

    const result = merge(target, source);

    expect(Object.getOwnPropertySymbols(result).length).toBe(2);
  });

  test("should handle objects with circular references in source", () => {
    const target = {};
    const source: any = { key: "value" };
    source.self = source; // Create circular reference

    const result = merge(target, source);

    expect(result.key).toBe("value");
    expect(result.self).toStrictEqual(result); // Result should also have the circular reference
  });
});
