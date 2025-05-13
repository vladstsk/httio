import { RequestSymbol } from "~/constants/http";
import { getBodyPayload } from "~/http/body";
import type { Payload } from "~/types/data";
import type { HttioRequest, HttioRequestInit } from "~/types/http";
import { assign, clone, references } from "~/utils/object";
import { instanceOf, isHttioRequest, isPlaneObject, isString } from "~/utils/validate";

type RequestOptions = Omit<RequestInit, "body" | "headers" | "method" | "window"> & {
  body?: Payload;
  headers: Headers;
  method: string;
};

function extract(source: HttioRequestInit | Request): RequestOptions {
  return assign(
    {
      body: getBodyPayload(source.body),
      headers: new Headers(source.headers),
      method: source.method || "GET",
    },
    clone(
      source,
      "cache",
      "credentials",
      "integrity",
      "keepalive",
      "mode",
      "redirect",
      "referrer",
      "referrerPolicy",
      "signal"
    )
  );
}

export function request(origin: Request): HttioRequest;
export function request(instance: HttioRequest): HttioRequest;
export function request(url: URL | string, init?: HttioRequestInit): HttioRequest;
export function request(input: HttioRequest | Request | URL | string, init?: HttioRequestInit): HttioRequest {
  if (isHttioRequest(input)) {
    return input;
  }

  if (instanceOf(input, Request)) {
    return request(input.url, extract(input));
  }

  let url = new URL(input);
  const options = extract(init || {});

  return assign(
    { [RequestSymbol]: RequestSymbol },

    references(options, "body", "headers", "method"),
    {
      get url() {
        return url;
      },

      // todo: fix test
      /* istanbul ignore next */
      set url(value) {
        url = value;
      },
    },

    {
      clone(): HttioRequest {
        return request(url, options);
      },

      toRequest(): Request {
        let body = options.body;
        let type = "application/json";
        const headers = new Headers(options.headers);

        if (isString(body)) {
          type = "text/plain; charset=utf-8";
        }

        if (isPlaneObject(body)) {
          body = JSON.stringify(body);
        }

        if (body instanceof URLSearchParams) {
          headers.set("Content-Type", "");
        }

        if (body instanceof URLSearchParams) {
          type = "application/x-www-form-urlencoded";
        }

        if (body instanceof FormData) {
          type = "multipart/form-data";
        }

        if (body instanceof Blob || body instanceof ReadableStream || body instanceof ArrayBuffer) {
          type = "application/octet-stream";
        }

        if (body instanceof ReadableStream) {
          // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
          // @ts-expect-error - experimental
          options.duplex = "half";
        }

        headers.set("Accept", "text/*,image/*,application/json,application/octet-stream");
        headers.set("Content-Type", type);

        if (isString(body)) {
          headers.set("Content-length", body.length.toString());
        }

        return new Request(url, assign(options, { body, headers }));
      },
    }
  );
}
