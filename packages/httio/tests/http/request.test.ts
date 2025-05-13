import { request } from "~/http/request";
import { isHttioRequest } from "~/utils/validate";

describe("Http Request", () => {
  describe("creating HttioRequest instances", () => {
    test("should create an HttioRequest from a Request object", () => {
      const origin = new Request("https://example.com");
      const req = request(origin);

      expect(isHttioRequest(req)).toBe(true);
    });

    test("should create an HttioRequest from a URL object", () => {
      const origin = new URL("https://example.com");
      const req = request(origin);

      expect(isHttioRequest(req)).toBe(true);
    });

    test("should create an HttioRequest from a string URL", () => {
      const url = "https://example.com/";
      const req = request(url);

      expect(isHttioRequest(req)).toBe(true);
    });

    test("should return the same HttioRequest when passed as input", () => {
      const instance = request("https://example.com");
      const req = request(instance);

      expect(req).toBe(instance);
    });
  });

  describe("clone() method", () => {
    test("should create a new HttioRequest instance with identical properties", () => {
      const origin = request("https://example.com");
      const cloned = origin.clone();

      expect(cloned).not.toBe(origin);
      expect(cloned.url.toString()).toBe(origin.url.toString());
    });

    test("should not modify the original instance", () => {
      const origin = request("https://example.com");
      const cloned = origin.clone();

      cloned.headers.set("X-Test", "value");

      expect(origin.headers.has("X-Test")).toBe(false);
      expect(cloned.headers.has("X-Test")).toBe(true);
    });
  });

  describe("toRequest() method", () => {
    test("should create a standard Request object with the same URL", () => {
      const origin = request("https://example.com");
      const res = origin.toRequest();

      expect(res).toBeInstanceOf(Request);
      expect(res.url).toBe(origin.url.toString());
    });

    test("should correctly set body and headers", () => {
      const origin = request("https://example.com", {
        body: JSON.stringify({ test: "value" }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const res = origin.toRequest();

      expect(res.body).toBeDefined();
      expect(res.headers.get("Content-Type")).toBe("application/json");
    });
  });

  describe("Headers", () => {
    const types = [
      ["application/json", null],
      ["application/json", undefined],
      ["application/json", { key: "value" }],
      ["text/plain", "test body"],
      ["application/x-www-form-urlencoded", new URLSearchParams()],
      ["multipart/form-data", new FormData()],
      ["application/octet-stream", new Blob()],
      ["application/octet-stream", new ReadableStream()],
      ["application/octet-stream", new ArrayBuffer()],
    ] as const;

    test.each(types)("should set Content-Type header to %s for given body type", (type, body) => {
      const req = request("https://example.com", { body, method: "POST" }).toRequest();

      expect(req.headers.get("Content-Type")).toContain(type);
    });
  });
});
