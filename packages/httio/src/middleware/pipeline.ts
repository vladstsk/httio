import response from "~/http/response";
import type { Middleware, NextMiddleware, Pipeline } from "~/types/pipeline";
import type { HttioRequest } from "~/types/request";
import type { HttioResponse } from "~/types/response";
import { isHttioRequest, isHttioResponse } from "~/utils/validate";

export default function pipeline(destination: NextMiddleware): Pipeline {
  const pipes: Middleware[] = [];

  return {
    get handle() {
      const reducer = (next: NextMiddleware, middleware: Middleware) => {
        return function handle(request: HttioRequest): HttioResponse {
          if (!isHttioRequest(request)) {
            throw new Error("Invalid request");
          }

          return response(async () => {
            const data = await middleware(request, next);

            if (isHttioResponse(data)) {
              return data.origin();
            }

            return data instanceof Response ? data : new Response(data);
          });
        };
      };

      return pipes.reduceRight(reducer, destination);
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
