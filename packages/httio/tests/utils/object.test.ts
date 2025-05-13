import { clone, merge } from "~/utils/object";

describe("Object utilities", () => {
  describe("merge() function", () => {
    test("should merge two plain objects deeply", () => {
      const target = { a: 1, b: { c: 2 } };
      const source = { b: { d: 3 }, e: 4 };

      const result = merge(target, source);

      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
    });

    test("should merge objects containing symbols as keys", () => {
      const sym = Symbol("sym");
      const target = { a: 1, [sym]: { x: 1 } };
      const source = { b: 2, [sym]: { y: 2 } };

      const result = merge(target, source);

      expect(result).toEqual({ a: 1, b: 2, [sym]: { x: 1, y: 2 } });
    });

    test("should replace arrays instead of merging them", () => {
      const target = { a: [1, 2] };
      const source = { a: [3, 4] };

      const result = merge(target, source);

      expect(result).toEqual({ a: [3, 4] });
    });

    test("should return the source if target is not a plain object", () => {
      const target = null;
      const source = { a: 1 };

      const result = merge(target, source);

      expect(result).toEqual({ a: 1 });
    });

    test("should merge objects with overlapping but non-conflicting keys", () => {
      const target = { a: 1, b: 2 };
      const source = { c: 3, d: 4 };

      const result = merge(target, source);

      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });
  });

  describe("clone() function", () => {
    test("should clone object with specified keys", () => {
      const source = { a: 1, b: 2, c: 3 };
      const result = clone(source, "a", "c");

      expect(result).toEqual({ a: 1, c: 3 });
    });

    // test("should return an empty object if no keys are specified", () => {
    //   const source = { a: 1, b: 2, c: 3 };
    //   const result = clone(source);
    //
    //   expect(result).toEqual({});
    // });

    test("should handle cloning all keys if no keys are specified", () => {
      const source = { a: 1, b: 2, c: 3 };
      const result = clone(source);

      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    test("should return an empty object for invalid keys", () => {
      const source = { a: 1, b: 2, c: 3 };
      const result = clone(source, "x" as keyof typeof source);

      expect(result).toEqual({});
    });

    test("should support cloning complex objects with nested arrays", () => {
      const source = { a: { b: [1, 2] }, c: 3 };
      const result = clone(source, "a");

      expect(result).toEqual({ a: { b: [1, 2] } });
    });
  });
});
