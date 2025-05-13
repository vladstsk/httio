import { pipeline } from "~/http/pipeline";
import type { HttioClient, HttioClientOptions, HttioRequestOptions } from "~/types/client";
import type { Payload } from "~/types/data";
import type { Fetcher } from "~/types/fetch";
import type { Middleware } from "~/types/pipeline";
import { assign, merge } from "~/utils/object";
import { join, search } from "~/utils/url";

type RequestOptions = Omit<HttioClientOptions, "fetch"> & {
  fetch: Fetcher;
};

function mergeOptions(oldOptions?: HttioClientOptions, newOptions?: HttioClientOptions): RequestOptions {
  return assign({ fetch }, oldOptions, newOptions, {
    params: merge(oldOptions?.params, newOptions?.params),
    url: join(oldOptions?.url || "", newOptions?.url || ""),
  });
}

function request(method: string, payload: Payload, middlewares: Middleware[], options: RequestOptions) {
  const { fetch, headers, params, retry, timeout, url, ...$init } = options;

  const handle = pipeline(middlewares, fetch, { retry, timeout });

  assign($init, {
    body: payload,
    headers: headers,
    method: method.toUpperCase(),
  });

  return handle(url + search(params), $init);
}

export function client(options?: HttioClientOptions): HttioClient {
  const middlewares: Middleware[] = [];

  return assign(
    {
      extends(init: HttioClientOptions): HttioClient {
        return client(mergeOptions(options, init)).use(...middlewares);
      },

      use(this: HttioClient, ...middlewares: Middleware[]): HttioClient {
        middlewares.push(...middlewares);

        return this;
      },
    },

    {
      delete(path: string, init?: HttioRequestOptions) {
        return request("delete", undefined, middlewares, mergeOptions(options, assign({}, init, { url: path })));
      },

      get(path: string, init?: HttioRequestOptions) {
        return request("get", undefined, middlewares, mergeOptions(options, assign({}, init, { url: path })));
      },

      head(path: string, init?: HttioRequestOptions) {
        return request("head", undefined, middlewares, mergeOptions(options, assign({}, init, { url: path })));
      },

      options(path: string, init?: HttioRequestOptions) {
        return request("options", undefined, middlewares, mergeOptions(options, assign({}, init, { url: path })));
      },

      patch(path: string, payload?: Payload, init?: HttioRequestOptions) {
        return request("patch", payload, middlewares, mergeOptions(options, assign({}, init, { url: path })));
      },

      post(path: string, payload?: Payload, init?: HttioRequestOptions) {
        return request("post", payload, middlewares, mergeOptions(options, assign({}, init, { url: path })));
      },

      put(path: string, payload?: Payload, init?: HttioRequestOptions) {
        return request("put", payload, middlewares, mergeOptions(options, assign({}, init, { url: path })));
      },
    }
  );
}
