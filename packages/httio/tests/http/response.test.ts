import { response } from "~/http/response";
import { isHttioResponse } from "~/utils/validate";

describe("Http Response", () => {
  describe("creating HttioResponse instances", () => {
    test("should create an HttioResponse from a Response object", () => {
      const origin = new Response("test payload");
      const res = response(origin);

      expect(isHttioResponse(res)).toBe(true);
    });

    test("should return the same HttioResponse when passed as input", () => {
      const instance = response("https://example.com");
      const res = response(instance);

      expect(res).toBe(instance);
    });
  });

  describe("clone() method", () => {
    test("should create a new HttioResponse instance with identical properties", () => {
      const origin = response();
      const cloned = origin.clone();

      expect(cloned).not.toBe(origin);
      expect(isHttioResponse(cloned)).toBe(true);
    });

    test("should not modify the original instance", () => {
      const origin = response();
      const cloned = origin.clone();

      cloned.headers.set("X-Test", "value");

      expect(origin.headers.has("X-Test")).toBe(false);
      expect(cloned.headers.has("X-Test")).toBe(true);
    });
  });
});
