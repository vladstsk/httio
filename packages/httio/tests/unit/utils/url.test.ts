import type { QueryParams } from "~/types/fetch";
import url from "~/utils/url";

describe("url", () => {
  test("should create a URL from string", () => {
    const result = url("https://example.com", "");

    expect(result.toString()).toBe("https://example.com/");
  });

  test("should create a URL from URL instance", () => {
    const baseUrl = new URL("https://example.com");
    const result = url(baseUrl, "");

    expect(result.toString()).toBe("https://example.com/");
  });

  test("should handle path parameter correctly", () => {
    const result = url("https://example.com", "/api/users");

    expect(result.toString()).toBe("https://example.com/api/users");
  });

  test("should handle relative path", () => {
    const result = url("https://example.com/base", "users");

    expect(result.toString()).toBe("https://example.com/base/users");
  });

  test("should handle path with double slashes", () => {
    const result = url("https://example.com/base/", "/users");

    expect(result.toString()).toBe("https://example.com/base/users");
  });

  test("should remove trailing slash from path", () => {
    const result = url("https://example.com", "/api/users/");

    expect(result.toString()).toBe("https://example.com/api/users");
  });

  test("should override base URL if path contains protocol", () => {
    const result = url("https://example.com/base", "https://api.example.com/users");

    expect(result.toString()).toBe("https://api.example.com/users");
  });

  test("should merge search parameters from base and path", () => {
    const result = url("https://example.com?sort=asc", "/api/users?page=1");
    expect(result.toString()).toBe("https://example.com/api/users?sort=asc&page=1");
  });

  test("should add simple query parameters", () => {
    const params: QueryParams = {
      active: true,
      limit: 10,
      page: 1,
      search: "test",
    };

    const result = url("https://example.com", "/api/users", params);

    expect(result.searchParams.get("page")).toBe("1");
    expect(result.searchParams.get("limit")).toBe("10");
    expect(result.searchParams.get("search")).toBe("test");
    expect(result.searchParams.get("active")).toBe("true");
  });

  test("should handle nested object query parameters", () => {
    const params: QueryParams = {
      filter: {
        role: "admin",
        status: "active",
      },
    };

    const result = url("https://example.com", "/api/users", params);

    expect(result.searchParams.get("filter[status]")).toBe("active");
    expect(result.searchParams.get("filter[role]")).toBe("admin");
  });

  test("should handle array query parameters", () => {
    const params: QueryParams = {
      ids: [1, 2, 3],
    };

    const result = url("https://example.com", "/api/users", params);

    expect(result.searchParams.get("ids[1]")).toBe("1");
    expect(result.searchParams.get("ids[2]")).toBe("2");
    expect(result.searchParams.get("ids[3]")).toBe("3");
  });

  test("should handle complex nested array and object query parameters", () => {
    const params: QueryParams = {
      filters: [
        { name: "status", value: "active" },
        { name: "role", value: "admin" },
      ],
    };

    const result = url("https://example.com", "/api/users", params);

    expect(result.searchParams.get("filters[1][name]")).toBe("status");
    expect(result.searchParams.get("filters[1][value]")).toBe("active");
    expect(result.searchParams.get("filters[2][name]")).toBe("role");
    expect(result.searchParams.get("filters[2][value]")).toBe("admin");
  });

  test("should handle null and undefined values", () => {
    const params: QueryParams = {
      filter: null,
      page: 1,
      sort: undefined,
    };

    const result = url("https://example.com", "/api/users", params);

    expect(result.searchParams.get("page")).toBe("1");
    expect(result.searchParams.has("sort")).toBe(false);
    expect(result.searchParams.has("filter")).toBe(false);
  });

  test("should handle arrays with mixed types", () => {
    const params: QueryParams = {
      items: ["string", 123, true, { name: "object" }],
    };

    const result = url("https://example.com", "/api/users", params);

    expect(result.searchParams.get("items[1]")).toBe("string");
    expect(result.searchParams.get("items[2]")).toBe("123");
    expect(result.searchParams.get("items[3]")).toBe("true");
    expect(result.searchParams.get("items[4][name]")).toBe("object");
  });
});
