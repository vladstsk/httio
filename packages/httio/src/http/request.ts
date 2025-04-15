import type { HttioRequest, HttioRequestInit } from "~/types/request";
import { REQUEST } from "~/utils/consts";
import { isPlaneObject } from "~/utils/validate";

export default function request(url: URL | string, options: HttioRequestInit): HttioRequest {
  const { headers, ...init } = options;

  if (!init.method) {
    throw new Error("Invalid method");
  }

  if (headers === null || (headers && !(headers instanceof Headers || isPlaneObject(headers)))) {
    throw new Error("Invalid headers");
  }

  return Object.assign({ [REQUEST]: REQUEST }, init, {
    headers: new Headers(headers),
    url: new URL(url),

    clone(this: HttioRequest): HttioRequest {
      const { url, ...init } = this;

      return request(url, init);
    },

    toRequest(): Request {
      const { url, ...init } = this;

      return new Request(url, init);
    },
  });
}
