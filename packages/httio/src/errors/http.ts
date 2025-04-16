import type { HttioRequest } from "~/types/request";
import type { HttioResponse } from "~/types/response";

export default class HttpError extends Error {
  public request: HttioRequest;
  public response: HttioResponse;

  constructor(message: string | null | undefined, request: HttioRequest, response: HttioResponse) {
    super(message || response.toString());

    this.request = request;
    this.response = response;
  }
}
