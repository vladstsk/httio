import type { QueryParams } from "~/types/fetch";
import { join, search } from "~/utils/url";

describe("URL utilities", () => {
  describe("join() function", () => {
    test("should join paths with a domain and handle slashes correctly", () => {
      expect(join("http://example.com", "path/to/resource")).toBe("http://example.com/path/to/resource");
      expect(join("http://example.com/path", "/to/resource")).toBe("http://example.com/path/to/resource");
    });

    test("should join multiple paths", () => {
      expect(join("path/", "/to/", "/resource")).toBe("path/to/resource");
      expect(join("path", "to", "resource")).toBe("path/to/resource");
    });

    test("should handle empty paths gracefully", () => {
      expect(join("path", "", "to/resource")).toBe("path/to/resource");
    });

    test("should handle paths with multiple consecutive slashes", () => {
      expect(join("path//", "//to/", "///resource")).toBe("path/to/resource");
    });
  });

  describe("search() function", () => {
    test("should return an empty string if no parameters are provided", () => {
      expect(search()).toBe("");
    });

    test("should return a query string for simple key-value pairs", () => {
      const params: QueryParams = { anotherKey: "anotherValue", key: "value" };

      expect(search(params)).toBe("?anotherKey=anotherValue&key=value");
    });

    test("should handle nested object parameters", () => {
      const params: QueryParams = {
        key: {
          nestedKey: {
            deepNestedKey: "deepNestedValue",
          },
        },
      };

      expect(search(params)).toBe(`?${encodeURI("key[nestedKey][deepNestedKey]")}=deepNestedValue`);
    });

    test("should handle array parameters", () => {
      const params: QueryParams = { key: ["value1", "value2"] };

      expect(search(params)).toBe(`?${encodeURI("key[0]")}=value1&${encodeURI("key[1]")}=value2`);
    });
  });
});
