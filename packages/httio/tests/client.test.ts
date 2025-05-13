import { client } from "~/client";
import type { HttioClient } from "~/types/client";

import { start, stop } from "./server";

describe("Client", () => {
  let host: string;
  let base: HttioClient;
  let extended: HttioClient;

  beforeAll(() => {
    base = client();
    extended = base.extends({
      url: (host = start()),
    });
  });

  afterAll(stop);

  describe("HTTP methods", () => {
    test.each(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] as const)(
      "should make %s request",
      async (method) => {
        const $method = method.toLowerCase() as Lowercase<typeof method>;

        expect(base[$method]).toBeInstanceOf(Function);
        expect(extended[$method]).toBeInstanceOf(Function);

        const response = { url: new URL(`${host}/${$method}`) };

        await expect(base[$method](`${host}/${$method}`)).resolves.toMatchObject(response);
        await expect(extended[$method](`/${$method}`)).resolves.toMatchObject(response);
      }
    );
  });

  describe("Response types", () => {
    const instances = [
      ["buffer", ArrayBuffer],
      ["blob", Blob],
      ["bytes", Uint8Array],
      ["stream", ReadableStream],
    ] as const;

    test.each(instances)("should handle %s response", async (method, instance) => {
      const response = extended.get("/get");

      expect(response[method]).toBeInstanceOf(Function);
      await expect(response[method]()).resolves.toBeInstanceOf(instance);
    });

    test("should return response as JSON", async () => {
      const response = extended.get("/get");

      expect(response.json).toBeInstanceOf(Function);
      await expect(response.json()).resolves.toMatchObject({ url: new URL(`${host}/get`) });
    });

    test("should return response as text", async () => {
      const response = extended.get("/get");

      expect(response.text).toBeInstanceOf(Function);
      expect(JSON.parse(await response.text())).toMatchObject({ url: new URL(`${host}/get`) });
    });
  });

  describe("Request options", () => {
    test("should handle redirects", async () => {
      const response = extended.get(`/redirect`, {
        params: { url: `${host}/get` },
      });

      await expect(response.json()).resolves.toMatchObject({ url: new URL(`${host}/get`) });
    });
  });

  describe("Client extensions", () => {
    test("should extend extended with new URL", async () => {
      const status = 201;
      const response = await extended.extends({ url: "/status" }).get(`/${status}`);

      expect(response.status).toBe(status);
      expect(response.url).toBe(`${host}/status/${status}`);
      await expect(response.json()).resolves.toMatchObject({ status });
    });
  });
});
