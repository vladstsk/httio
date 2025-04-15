import request from "~/http/request";
import connection from "~/middleware/connection";
import pipeline from "~/middleware/pipeline";
import type { HttioClient, HttioClientOptions, HttioMethodOptions } from "~/types/client";
import type { Json } from "~/types/data";
import type { Middleware } from "~/types/pipeline";
import type { HttioRequestInit } from "~/types/request";
import type { HttioResponse } from "~/types/response";
import merge from "~/utils/merge";
import url from "~/utils/url";

export default function client(options?: HttioClientOptions): HttioClient {
  const { fetch: $fetch = fetch, query, url: base = "", ...init } = options || {};

  const middleware = pipeline(connection($fetch));

  const open = (url: URL, options: HttioRequestInit): HttioResponse => {
    return middleware.handle(request(url, options));
  };

  return {
    delete(path: string, options?: HttioMethodOptions): HttioResponse {
      const { query, ...$options } = merge(init, options || {});

      return open(url(base || path, path, query), { ...$options, method: "DELETE" });
    },

    extends(_options: HttioClientOptions): HttioClient {
      const { query: _query, url: _base = "", ..._init } = _options;

      if (!_init.fetch) {
        _init.fetch = $fetch;
      }

      if (base && _base) {
        // @ts-expect-error ---
        _init.url = url(base, _base, merge(query, _query));
      } else if (base) {
        // @ts-expect-error ---
        _init.url = url(base, "/", merge(query, _query));
      } else if (_base) {
        // @ts-expect-error ---
        _init.url = url(_base, "/", merge(query, _query));
      }

      return client(merge(init, _init)).use(...middleware.pipes);
    },

    get(path: string, options?: HttioMethodOptions): HttioResponse {
      const { query, ...$options } = merge(init, options || {});

      return open(url(base || path, path, query), { ...$options, method: "GET" });
    },

    head(path: string, options?: HttioMethodOptions): HttioResponse {
      const { query, ...$options } = merge(init, options || {});

      return open(url(base || path, path, query), { ...$options, method: "HEAD" });
    },

    options(path: string, options?: HttioMethodOptions): HttioResponse {
      const { query, ...$options } = merge(init, options || {});

      return open(url(base || path, path, query), { ...$options, method: "OPTIONS" });
    },

    patch(path: string, payload?: BodyInit | Json, options?: HttioMethodOptions): HttioResponse {
      const { query, ...$options } = merge(init, options || {});

      return open(url(base || path, path, query), { ...$options, body: payload, method: "PATCH" });
    },

    post(path: string, payload?: BodyInit | Json, options?: HttioMethodOptions): HttioResponse {
      const { query, ...$options } = merge(init, options || {});

      return open(url(base || path, path, query), { ...$options, body: payload, method: "POST" });
    },

    put(path: string, payload?: BodyInit | Json, options?: HttioMethodOptions): HttioResponse {
      const { query, ...$options } = merge(init, options || {});

      return open(url(base || path, path, query), { ...$options, body: payload, method: "PUT" });
    },

    use(...middlewares: Middleware[]): HttioClient {
      middleware.use(...middlewares);

      return this;
    },
  };
}
