import response from "~/http/response";
import type { HttioResponse } from "~/types/response";

describe("response function", () => {
  let mockFactory: jest.Mock<Promise<Response>>;
  let mockResponse: HttioResponse;

  beforeEach(() => {
    const resp = new Response(JSON.stringify({ test: "value" }), {
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    mockFactory = jest.fn().mockResolvedValue(resp);
    mockResponse = response(mockFactory);
  });

  test("should correctly clone the response object", async () => {
    const resp = new Response(JSON.stringify({ test: "value" }), {
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    mockResponse = response(async () => resp);

    const clonedResponse = mockResponse.clone();

    const originalJson = await mockResponse.json();
    const clonedJson = await clonedResponse.json();

    expect(originalJson).toEqual({ test: "value" });
    expect(clonedJson).toEqual({ test: "value" });
    expect(clonedResponse).not.toBe(mockResponse);
  });

  test("should handle cases where the factory rejects after cloning", async () => {
    mockFactory.mockRejectedValueOnce(new Error("Original factory error"));
    const originalResponse = response(mockFactory);
    const clonedResponse = originalResponse.clone();

    await expect(originalResponse.json()).rejects.toThrow("Original factory error");
    await expect(clonedResponse.json()).rejects.toThrow("Original factory error");
  });

  test("should retrieve blob from the response", async () => {
    const result = await mockResponse.blob();

    expect(mockFactory).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Blob);
  });

  test("should throw error if unable to retrieve blob", async () => {
    mockFactory.mockRejectedValue(new Error("Blob error"));

    await expect(response(mockFactory).blob()).rejects.toThrow("Blob error");
  });

  test("should retrieve buffer from the response", async () => {
    const result = await mockResponse.buffer();

    expect(mockFactory).toHaveBeenCalled();
    expect(result).toBeInstanceOf(ArrayBuffer);
  });

  test("should throw error if unable to retrieve buffer", async () => {
    mockFactory.mockRejectedValue(new Error("Buffer error"));

    await expect(response(mockFactory).buffer()).rejects.toThrow("Buffer error");
  });

  test("should retrieve bytes from the response", async () => {
    const result = await mockResponse.bytes();

    expect(mockFactory).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Uint8Array);
  });

  test("should throw error if unable to retrieve bytes", async () => {
    mockFactory.mockRejectedValue(new Error("Bytes error"));

    await expect(response(mockFactory).bytes()).rejects.toThrow("Bytes error");
  });

  test("should retrieve JSON from the response", async () => {
    const result = await mockResponse.json();

    expect(mockFactory).toHaveBeenCalled();
    expect(result).toEqual({ test: "value" });
  });

  test("should throw error if unable to retrieve JSON", async () => {
    mockFactory.mockRejectedValue(new Error("JSON error"));

    await expect(response(mockFactory).json()).rejects.toThrow("JSON error");
  });

  test("should retrieve the original response object", async () => {
    const result = await mockResponse.origin();

    expect(mockFactory).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Response);
  });

  test("should throw error if unable to retrieve original response", async () => {
    mockFactory.mockRejectedValue(new Error("Origin error"));

    await expect(response(mockFactory).origin()).rejects.toThrow("Origin error");
  });

  test("should retrieve the response stream", async () => {
    const result = await mockResponse.stream();

    expect(mockFactory).toHaveBeenCalled();
    expect(result).toBeInstanceOf(ReadableStream);
  });

  test("should throw error if unable to retrieve the stream", async () => {
    mockFactory.mockRejectedValue(new Error("Stream error"));

    await expect(response(mockFactory).stream()).rejects.toThrow("Stream error");
  });

  test("should retrieve text content from the response", async () => {
    const result = await mockResponse.text();

    expect(mockFactory).toHaveBeenCalled();
    expect(result).toBe(JSON.stringify({ test: "value" }));
  });

  test("should throw error if unable to retrieve text content", async () => {
    mockFactory.mockRejectedValue(new Error("Text error"));

    await expect(response(mockFactory).text()).rejects.toThrow("Text error");
  });
});
