import HttpError from "~/http/error";
import request from "~/http/request";
import connection from "~/middleware/connection";
import type { Fetcher } from "~/types/fetch";
import type { HttioRequest } from "~/types/request";

describe("connection", () => {
  let mockFetch: jest.MockedFunction<Fetcher>;
  let mockRequest: HttioRequest;

  beforeEach(() => {
    const resp = new Response(null, {
      status: 200,
    });

    mockFetch = jest.fn().mockResolvedValue(resp);

    mockRequest = request(new URL("https://example.com"), {
      method: "GET",
    });
  });

  test("should set default Accept header if not present", async () => {
    connection(mockFetch)(mockRequest);

    expect(mockRequest.headers.get("Accept")).toBe("text/*,image/*,application/json,application/octet-stream");
  });

  test("should preserve existing Accept header if already set", async () => {
    mockRequest.headers.set("Accept", "application/json");

    connection(mockFetch)(mockRequest);

    expect(mockRequest.headers.get("Accept")).toEqual("application/json");
  });

  test("should set Content-Type as application/x-www-form-urlencoded", async () => {
    mockRequest.body = new URLSearchParams();
    mockRequest.method = "POST";

    connection(mockFetch)(mockRequest);

    expect(mockRequest.headers.get("Content-Type")).toContain("application/x-www-form-urlencoded");
  });

  test("should set Content-Type as multipart/form-data", async () => {
    mockRequest.body = new FormData();
    mockRequest.method = "POST";

    connection(mockFetch)(mockRequest);

    expect(mockRequest.headers.get("Content-Type")).toContain("multipart/form-data");
  });

  test("should set Content-Type as application/octet-stream", async () => {
    mockRequest.method = "POST";

    const middleware = connection(mockFetch);

    [new Blob(), new ArrayBuffer(8), new ReadableStream()].forEach((body) => {
      mockRequest.body = body;

      middleware(mockRequest);

      expect(mockRequest.headers.get("Content-Type")).toContain("application/octet-stream");
    });
  });

  test("should set Content-Type as text/plain", async () => {
    mockRequest.body = "test";
    mockRequest.method = "POST";

    connection(mockFetch)(mockRequest);

    expect(mockRequest.headers.get("Content-Type")).toContain("text/plain");
    expect(mockRequest.headers.get("Content-length")).toBe(mockRequest.body.length.toString());
  });

  test("should set Content-Type as application/json", async () => {
    mockRequest.body = { key: "value" };
    mockRequest.method = "POST";

    connection(mockFetch)(mockRequest);

    expect(mockRequest.headers.get("Content-Type")).toContain("application/json");
  });

  test("should throw HttpError if response is not ok", async () => {
    const resp = new Response(null, {
      status: 400,
    });

    mockFetch.mockResolvedValue(resp);

    const middleware = connection(mockFetch);

    await expect(middleware(mockRequest).json()).rejects.toBeInstanceOf(HttpError);
  });
});
