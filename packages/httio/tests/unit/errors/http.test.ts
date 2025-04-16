import HttpError from "~/errors/http";
import type { HttioRequest } from "~/types/request";
import type { HttioResponse } from "~/types/response";

describe("HttpError", () => {
  const mockRequest = <HttioRequest>{
    toString: () => "MockRequest",
  };

  const mockResponse = <HttioResponse>{
    toString: () => "MockResponse",
  };

  test("should default the message to the response.toString() if no message is provided", () => {
    const error = new HttpError(undefined, mockRequest, mockResponse);

    expect(error.message).toBe("MockResponse");
  });
});
