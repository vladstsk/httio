import HttpError from "~/http/error";
import response from "~/http/response";
import type { Fetcher } from "~/types/fetch";
import type { NextMiddleware } from "~/types/pipeline";
import { CONTENT_TYPES } from "~/utils/consts";
import { isString } from "~/utils/validate";

export default function connection(fetch: Fetcher): NextMiddleware {
  return function open(request) {
    if (!request.headers.has("Accept")) {
      request.headers.set("Accept", "text/*,image/*,application/json,application/octet-stream");
    }

    if (!request.headers.has("Content-Type")) {
      let value: string;

      if (request.body instanceof URLSearchParams) {
        value = CONTENT_TYPES.query;
      } else if (request.body instanceof FormData) {
        value = CONTENT_TYPES.form;
      } else if (request.body instanceof Blob) {
        value = CONTENT_TYPES.blob;
      } else if (request.body instanceof ReadableStream) {
        value = CONTENT_TYPES.stream;
      } else if (request.body instanceof ArrayBuffer) {
        value = CONTENT_TYPES.buffer;
      } else if (isString(request.body)) {
        value = CONTENT_TYPES.text;
      } else {
        request.body = JSON.stringify(request.body);
        value = CONTENT_TYPES.json;
      }

      request.headers.set("Content-Type", value);
    }

    if (isString(request.body) && !request.headers.has("Content-length")) {
      request.headers.set("Content-length", request.body.length.toString());
    }

    return response(async () => {
      const req = request.toRequest();
      const res = await fetch(req);

      if (!res.ok) {
        throw new HttpError(null, req, res);
      }

      return res;
    });
  };
}
