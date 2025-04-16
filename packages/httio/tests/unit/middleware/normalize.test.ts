import normalize from "~/middleware/normalize";
import type { HttioRequest } from "~/types/request";

describe("normalize middleware", () => {
  let mockRequest: HttioRequest;
  const mockNextMiddleware = jest.fn();

  beforeEach(() => {
    mockRequest = {
      body: null,
      headers: new Headers(),
      method: "GET",
      url: new URL("https://example.com"),
    };

    mockNextMiddleware.mockClear();
  });

  it("should set default Accept header if not present", () => {
    normalize(mockRequest, mockNextMiddleware);

    expect(mockRequest.headers.get("Accept")).toBe("text/*,image/*,application/json,application/octet-stream");
  });

  it("should not override existing Accept header", () => {
    mockRequest.headers.set("Accept", "application/xml");

    normalize(mockRequest, mockNextMiddleware);

    expect(mockRequest.headers.get("Accept")).toBe("application/xml");
  });

  it("should set default Content-Type header based on body type if not present", () => {
    mockRequest.body = { key: "value" };

    normalize(mockRequest, mockNextMiddleware);

    expect(mockRequest.headers.get("Content-Type")).toBe("application/json");
    expect(mockRequest.body).toBe(JSON.stringify({ key: "value" }));
  });

  it("should set Content-Type to text/plain; charset=utf-8 for string body", () => {
    mockRequest.body = "string body";

    normalize(mockRequest, mockNextMiddleware);

    expect(mockRequest.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
  });

  it("should set Content-Type to application/x-www-form-urlencoded for URLSearchParams body", () => {
    mockRequest.body = new URLSearchParams("key=value");

    normalize(mockRequest, mockNextMiddleware);

    expect(mockRequest.headers.get("Content-Type")).toBe("application/x-www-form-urlencoded");
  });

  it("should set Content-Type to multipart/form-data for FormData body", () => {
    mockRequest.body = new FormData();

    normalize(mockRequest, mockNextMiddleware);

    expect(mockRequest.headers.get("Content-Type")).toBe("multipart/form-data");
  });

  it("should set Content-Type to application/octet-stream for Blob body", () => {
    mockRequest.body = new Blob(["test"]);

    normalize(mockRequest, mockNextMiddleware);

    expect(mockRequest.headers.get("Content-Type")).toBe("application/octet-stream");
  });

  it("should add Content-length header for string body if not present", () => {
    mockRequest.body = "string body";

    normalize(mockRequest, mockNextMiddleware);

    expect(mockRequest.headers.get("Content-length")).toBe("11");
  });

  it("should call next middleware with the modified request", () => {
    normalize(mockRequest, mockNextMiddleware);

    expect(mockNextMiddleware).toHaveBeenCalledWith(mockRequest);
    expect(mockNextMiddleware).toHaveBeenCalledTimes(1);
  });
});
