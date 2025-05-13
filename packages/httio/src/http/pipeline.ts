import { HttpError } from "~/error/http";
import { request } from "~/http/request";
import { response } from "~/http/response";
import type { HttioBody } from "~/types/body";
import type { RetryOptions } from "~/types/client";
import type { Payload } from "~/types/data";
import type { Fetcher } from "~/types/fetch";
import type { HttioRequest, HttioResponse } from "~/types/http";
import type { Middleware, NextMiddleware } from "~/types/pipeline";
import { assign, merge } from "~/utils/object";
import { delay } from "~/utils/timer";
import { isNumber } from "~/utils/validate";

type PipelineOptions = {
  retry?: RetryOptions | number;
  timeout?: number;
};

function attach<K extends keyof HttioBody>(promise: Promise<HttioResponse>, type: K): HttioBody[K] {
  // todo: fix test
  /* istanbul ignore next */
  return () => promise.then((response) => response[type].call(response)) as never;
}

function handle(source: Promise<HttioResponse | Payload | Response>): HttioBody & Promise<HttioResponse> {
  const promise = source.then(response, (error) => {
    // todo: fix test
    /* istanbul ignore next */
    return <Promise<HttioResponse>>{
      [Symbol.toStringTag]: Promise.prototype[Symbol.toStringTag],

      catch(rejected) {
        return Promise.reject(error).catch(rejected);
      },

      finally(callback) {
        return Promise.reject(error).finally(callback);
      },

      then(fulfilled, rejected) {
        return Promise.reject(error).then(fulfilled, rejected);
      },
    };
  });

  return assign(promise, {
    blob: attach(promise, "blob"),
    buffer: attach(promise, "buffer"),
    bytes: attach(promise, "bytes"),
    json: attach(promise, "json"),
    stream: attach(promise, "stream"),
    text: attach(promise, "text"),
  });
}

// eslint-disable-next-line prettier/prettier
async function process(fetch: Fetcher, request: HttioRequest, options?: PipelineOptions): Promise<HttioResponse | Payload | Response> {
  let retry: Required<RetryOptions> = {
    delay: 1000,
    limit: 3,
  };

  if (isNumber(options?.retry)) {
    retry.limit = options.retry;
  } else if (options?.retry) {
    retry = merge(retry, options.retry as Required<RetryOptions>);
  }

  let res: HttioResponse;
  const req = request.toRequest();

  for (let i = 0; i < retry.limit; i++) {
    res = await Promise.race([
      fetch(req).then(response),
      delay(options?.timeout || 1000).then(() => {
        return response(null, { status: 408 });
      }),
    ]);

    if ([429, 500, 502, 503].includes(res.status)) {
      await delay(retry.delay);

      continue;
    }

    if (!res.ok) {
      break;
    }

    return res;
  }

  throw new HttpError(request, res!);
}

function reduce(next: NextMiddleware, middleware: Middleware): NextMiddleware {
  return (input, init?) => {
    try {
      return handle(Promise.resolve(middleware(request(input as never, init), next)));
    } catch (error) {
      return handle(Promise.reject(error));
    }
  };
}

export function pipeline(middlewares: Middleware[], fetch: Fetcher, options?: PipelineOptions): NextMiddleware {
  return middlewares.reduceRight(reduce, (input, init?) => {
    return handle(process(fetch, request(input as never, init), options));
  });
}
