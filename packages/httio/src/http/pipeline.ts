import request from "~/http/request";
import response from "~/http/response";
import normalize from "~/middleware/normalize";
import type { Fetcher } from "~/types/fetch";
import type { Middleware, NextMiddleware, Pipeline } from "~/types/pipeline";
import type { HttioRequest, HttioRequestInit } from "~/types/request";
import type { ResponseInstance } from "~/types/response";
import { isHttioResponse } from "~/utils/validate";

export default function pipeline(fetch: Fetcher): Pipeline {
  const pipes: Middleware[] = [];

  const open: NextMiddleware = (request) => {
    const { url, ...init } = request;

    return response(url, request.method, async () => fetch(new Request(url, init as RequestInit)));
  };

  const reducer = (next: NextMiddleware, middleware: Middleware) => {
    return function handle(req: HttioRequest): ResponseInstance {
      return response(req.url, req.method, async () => {
        const data = await middleware(req, next);

        if (isHttioResponse(data)) {
          return new Response(await data.stream(), {
            headers: data.headers,
            status: data.status,
          });
        }

        return data instanceof Response ? data : new Response(data);
      });
    };
  };

  return {
    get handle() {
      const next = pipes.reduceRight(reducer, open);

      return function handle(url: URL | string, options: HttioRequestInit): ResponseInstance {
        return normalize(request(url, options), next) as never;
      };
    },

    get pipes() {
      return pipes;
    },

    use(...middleware: Middleware[]) {
      pipes.push(...middleware);

      return this;
    },
  };
}
