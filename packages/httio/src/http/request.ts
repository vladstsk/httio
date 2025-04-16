import type { HttioRequest, HttioRequestInit } from "~/types/request";
import assign from "~/utils/assign";
import { REQUEST } from "~/utils/consts";
import { isString } from "~/utils/validate";

export default function request(url: URL | string, options: HttioRequestInit): HttioRequest {
  const { headers, method, ...init } = options;

  if (isString(url)) {
    url = new URL(url);
  }

  return assign({ [REQUEST]: REQUEST }, init, {
    headers: new Headers(headers),
    method: method.toUpperCase(),
    url,

    toString() {
      return `[${options.method.toUpperCase()}] ${url.toString()}`;
    },
  });
}
