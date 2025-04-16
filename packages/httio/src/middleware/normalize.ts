import type { MiddlewareResult, NextMiddleware } from "~/types/pipeline";
import type { HttioRequest } from "~/types/request";
import { isString } from "~/utils/validate";

export default function normalize(request: HttioRequest, next: NextMiddleware): MiddlewareResult {
  if (!request.headers.has("Accept")) {
    request.headers.set("Accept", "text/*,image/*,application/json,application/octet-stream");
  }

  if (!request.headers.has("Content-Type")) {
    let type = "application/json";

    if (isString(request.body)) {
      type = "text/plain; charset=utf-8";

      //
    } else if (request.body instanceof URLSearchParams) {
      type = "application/x-www-form-urlencoded";

      //
    } else if (request.body instanceof FormData) {
      type = "multipart/form-data";

      //
    } else if (
      request.body instanceof Blob ||
      request.body instanceof ReadableStream ||
      request.body instanceof ArrayBuffer
    ) {
      type = "application/octet-stream";

      //
    } else {
      request.body = JSON.stringify(request.body);
    }

    request.headers.set("Content-Type", type);
  }

  if (isString(request.body) && !request.headers.has("Content-length")) {
    request.headers.set("Content-length", request.body.length.toString());
  }

  return next(request);
}
