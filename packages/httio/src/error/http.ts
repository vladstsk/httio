import type { HttioRequest, HttioResponse } from "~/types/http";

export class HttpError extends Error {
  public request: HttioRequest;
  public response: HttioResponse;

  constructor(request: HttioRequest, response: HttioResponse) {
    super(`[${request.method}] ${request.url}: status code ${response.status} ${response.statusText}`);

    this.name = "HttpError";
    this.request = request;
    this.response = response;
  }
}
