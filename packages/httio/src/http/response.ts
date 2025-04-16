import body from "~/http/body";
import type { HttioBody, HttioResponse, ResponseInstance } from "~/types/response";
import assign from "~/utils/assign";
import { RESPONSE } from "~/utils/consts";
import pick from "~/utils/pick";

export function wrap(method: string, response: Response, body: HttioBody, urlFallback: URL): HttioResponse {
  const url = response.url ? new URL(response.url) : urlFallback;
  const status = response.url ? response.statusText : "OK";

  return assign(pick(response, "headers", "status"), body, {
    [RESPONSE]: RESPONSE,

    url,

    toString() {
      return `[${method.toUpperCase()}] ${url}: ${response.status} ${status}`;
    },
  });
}

export default function response(url: URL, method: string, factory: () => Promise<Response>): ResponseInstance {
  const promise = factory().then(
    (response) => [response] as const,
    (error) => [null as never, error] as const
  );

  const data = body(promise);

  const instance = promise.then(([res, error]) => {
    if (error) {
      throw error;
    }

    return wrap(method, res, data, url);
  });

  return assign(instance, data);
}
