import response from "~/http/response";
import type { ResponseInstance } from "~/types/response";

describe("response function", () => {
  const mockUrl = new URL("https://example.com");
  const mockMethod = "GET";
  let mockFactory: jest.Mock<Promise<Response>>;
  let mockResponse: ResponseInstance;

  beforeEach(() => {
    const resp = new Response(JSON.stringify({ test: "value" }), {
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    mockFactory = jest.fn().mockResolvedValue(resp);
    mockResponse = response(mockUrl, mockMethod, mockFactory);
  });

  test("should throw an error when factory rejects", async () => {
    mockFactory = jest.fn().mockRejectedValue(new Error("Network Error"));
    const rejectedResponse = response(mockUrl, mockMethod, mockFactory);

    await expect(rejectedResponse).rejects.toThrow("Network Error");
  });

  test("should use the correct URL from the response object", async () => {
    const resp = new Response(JSON.stringify({ test: "value" }), {
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    Object.defineProperty(resp, "url", { value: "https://example.com/resource" });

    mockFactory = jest.fn().mockResolvedValue(resp);
    mockResponse = response(mockUrl, mockMethod, mockFactory);

    const result = await mockResponse;

    expect(result.url.toString()).toBe("https://example.com/resource");
  });

  test("should return correct toString() representation", async () => {
    const result = await mockResponse;

    expect(result.toString()).toBe("[GET] https://example.com/: 200 OK");
  });
});
