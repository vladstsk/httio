import HttpError from "~/http/error";

describe("HttpError", () => {
  let mockError: HttpError;
  let mockRequest: Request;
  let mockResponse: Response;

  beforeEach(() => {
    mockRequest = new Request("https://example.com/api", {
      method: "GET",
    });

    mockResponse = new Response(JSON.stringify({ error: "Not Found" }), {
      headers: new Headers({ "Content-Type": "application/json" }),
      status: 404,
      statusText: "Not Found",
    });

    mockError = new HttpError(null, mockRequest.clone(), mockResponse.clone());
  });

  test("should be initialized with the correct properties", () => {
    expect(mockError.status).toBe(404);
    expect(mockError.message).toBe("[GET] https://example.com/api: Not Found");
  });

  test("should return the expected blob", async () => {
    const result = await mockError.blob();

    expect(result).toBeInstanceOf(Blob);
  });

  test("should return the expected array buffer", async () => {
    const result = await mockError.buffer();

    expect(result).toBeInstanceOf(ArrayBuffer);
  });

  test("should return the expected bytes", async () => {
    const result = await mockError.bytes();

    expect(result).toBeInstanceOf(Uint8Array);
  });

  test("should return the expected JSON", async () => {
    const result = await mockError.json();

    expect(result).toEqual({ error: "Not Found" });
  });

  test("should return the response as a readable stream", async () => {
    const result = await mockError.stream();

    expect(result).toBeInstanceOf(ReadableStream);
  });

  test("should return the expected text", async () => {
    const result = await mockError.text();

    expect(result).toEqual(JSON.stringify({ error: "Not Found" }));
  });
});
