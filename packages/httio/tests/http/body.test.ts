import { getBodyInit, getBodyPayload, getResponseBody } from "~/http/body";

describe("Http Body", () => {
  describe("getBodyInit() function", () => {
    test("should return undefined when payload is undefined", () => {
      expect(getBodyInit(undefined)).toBeUndefined();
    });

    test("should return a JSON string when payload is a plain object", () => {
      const payload = { key: "value" };
      const result = getBodyInit(payload);
      expect(result).toBe(JSON.stringify(payload));
    });

    test("should return input as-is when payload is of BodyInit type", () => {
      const payload = "plain string";
      const result = getBodyInit(payload);
      expect(result).toBe(payload);
    });

    test("should return null when payload is null", () => {
      const result = getBodyInit(null);
      expect(result).toBeNull();
    });

    test("should return input as-is when payload is not a plain object", () => {
      const payload = new Date();
      const result = getBodyInit(payload);
      expect(result).toBe(payload);
    });
  });

  describe("getBodyPayload() function", () => {
    test("should parse and return an object when body is a valid JSON string", () => {
      const body = '{"key":"value"}';
      const result = getBodyPayload(body);
      expect(result).toEqual({ key: "value" });
    });

    test("should return input as-is when body is of BodyInit type", () => {
      const body = "plain string";
      const result = getBodyPayload(body);
      expect(result).toBe(body);
    });

    test("should return null when body is null", () => {
      const result = getBodyPayload(null);
      expect(result).toBeNull();
    });

    test("should return undefined when body is undefined", () => {
      const result = getBodyPayload(undefined);
      expect(result).toBeUndefined();
    });

    test("should return input as-is when body is an invalid JSON string", () => {
      const invalidJson = '{"key": "value"'; // Missing closing brace
      const result = getBodyPayload(invalidJson);
      expect(result).toBe(invalidJson);
    });
  });

  describe("getResponseBody() function", () => {
    test("should return a blob() function returning a Blob", async () => {
      const body = getResponseBody(new Response());

      await expect(body.blob()).resolves.toBeInstanceOf(Blob);
    });

    test("should return a buffer() function returning an ArrayBuffer", async () => {
      const body = getResponseBody(new Response());

      await expect(body.buffer()).resolves.toBeInstanceOf(ArrayBuffer);
    });

    test("should return bytes() function returning a Uint8Array", async () => {
      const body = getResponseBody(new Response());

      await expect(body.bytes()).resolves.toBeInstanceOf(Uint8Array);
    });

    test("should return a json() function returning parsed JSON", async () => {
      const payload = { key: "value" };
      const body = getResponseBody(new Response(JSON.stringify(payload)));

      await expect(body.json()).resolves.toEqual(payload);
    });

    test("should return a stream() function returning a ReadableStream", async () => {
      const body = getResponseBody(new Response());

      await expect(body.stream()).resolves.toBeInstanceOf(ReadableStream);
    });

    test("should return a text() function returning a string", async () => {
      const body = getResponseBody(new Response("some text"));

      await expect(body.text()).resolves.toEqual("some text");
    });
  });
});
