import request from "~/http/request";
import type { HttioRequestInit } from "~/types/request";

describe("request function", () => {
  const mockUrl = "https://example.com/api";
  let mockOptions: HttioRequestInit;

  beforeEach(() => {
    mockOptions = {
      body: JSON.stringify({ key: "value" }),
      credentials: "include",
      headers: {
        Authorization: "Bearer token",
        "Content-Type": "application/json",
      },
      method: "GET",
    };
  });

  test("should create an HttioRequest with proper fields", () => {
    const result = request(mockUrl, mockOptions);

    expect(result.url).toBeInstanceOf(URL);
    expect(result.url.toString()).toBe(mockUrl);
    expect(result.headers).toBeInstanceOf(Headers);
    expect(result.headers.get("Content-Type")).toBe("application/json");
    expect(result.headers.get("Authorization")).toBe("Bearer token");
    expect(result.method).toBe("GET");
    expect(result.body).toBe(mockOptions.body);
    expect(result.credentials).toBe(mockOptions.credentials);
  });

  test("should accept a URL object as the 'url' parameter", () => {
    const urlObj = new URL(mockUrl);
    const result = request(urlObj, mockOptions);

    expect(result.url).toBeInstanceOf(URL);
    expect(result.url.toString()).toBe(mockUrl);
  });

  test("should correctly implement the 'toString' method", () => {
    const result = request(mockUrl, mockOptions);
    expect(result.toString()).toBe("[GET] https://example.com/api");
  });
});
