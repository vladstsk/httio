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

  test("should correctly clone the request object", () => {
    const originalRequest = request(mockUrl, mockOptions);
    const clonedRequest = originalRequest.clone();

    expect(clonedRequest).not.toBe(originalRequest);
    expect(clonedRequest.url.toString()).toBe(originalRequest.url.toString());
    expect(clonedRequest.headers.get("Content-Type")).toBe(originalRequest.headers.get("Content-Type"));
    expect(Array.from(clonedRequest.headers)).toEqual(Array.from(originalRequest.headers));
    expect(clonedRequest.method).toBe(originalRequest.method);
    expect(clonedRequest.body).toBe(originalRequest.body);
    expect(clonedRequest.credentials).toBe(originalRequest.credentials);
  });

  test("should transform an HttioRequest into a native Request object", async () => {
    mockOptions.body = JSON.stringify({ key: "value" });
    mockOptions.method = "POST";

    const result = request(mockUrl, mockOptions).toRequest();

    expect(result).toBeInstanceOf(Request);
    expect(result.url).toBe(mockUrl);
    expect(result.method).toBe("POST");
    expect(result.headers.get("Content-Type")).toBe("application/json");
    expect(result.headers.get("Authorization")).toBe("Bearer token");
    expect(result.credentials).toBe("include");

    return result.text().then((body) => {
      expect(body).toBe(JSON.stringify({ key: "value" }));
    });
  });

  test("should throw an error when headers are invalid", () => {
    mockOptions.headers = null as never; // Invalid type

    expect(() => request(mockUrl, mockOptions)).toThrow("Invalid headers");

    mockOptions.headers = 123 as never; // Invalid type

    expect(() => request(mockUrl, mockOptions)).toThrow("Invalid headers");

    mockOptions.headers = "test" as never; // Invalid type

    expect(() => request(mockUrl, mockOptions)).toThrow("Invalid headers");
  });

  test("should throw an error when method are invalid", () => {
    mockOptions.method = null as never; // Invalid type

    expect(() => request(mockUrl, mockOptions)).toThrow("Invalid method");
  });
});
