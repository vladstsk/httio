import pipeline from "~/http/pipeline";
import type { HttioClient, HttioClientMethods, HttioClientOptions, HttioMethodOptions } from "~/types/client";
import type { Middleware } from "~/types/pipeline";
import assign from "~/utils/assign";
import merge from "~/utils/merge";
import url from "~/utils/url";
import { isPlaneObject } from "~/utils/validate";

const METHODS_WITH_BODY: (keyof HttioClientMethods)[] = ["delete", "options", "patch", "post", "put"];

const METHODS: (keyof HttioClientMethods)[] = ["get", "head", ...METHODS_WITH_BODY];

export default function client(options?: HttioClientOptions): HttioClient {
  const { fetch: $fetch = fetch, url: base, ...init } = options || {};

  const middleware = pipeline($fetch);

  const methods = {} as HttioClientMethods;

  for (const method of METHODS) {
    // @ts-expect-error ---
    methods[method] = (path, body, options) => {
      if (!METHODS_WITH_BODY.includes(method)) {
        if (isPlaneObject(body)) {
          options = body as HttioMethodOptions;
        }

        body = void 0;
      }

      const { query, ...$options } = merge(init, options || {});

      return middleware.handle(
        url(base || path, path, query),
        assign($options, {
          body,
          method: method.toUpperCase(),
        })
      );
    };
  }

  return assign(methods, {
    extends(_options: HttioClientOptions): HttioClient {
      if (!_options.fetch) {
        _options.fetch = $fetch;
      }

      if (!_options.url) {
        _options.url = base;
      } else if (base) {
        _options.url = url(base, _options.url instanceof URL ? _options.url.toString() : _options.url);
      }

      return client(merge(init, _options)).use(...middleware.pipes);
    },

    use(this: HttioClient, ...middlewares: Middleware[]): HttioClient {
      middleware.use(...middlewares);

      return this;
    },
  });
}
