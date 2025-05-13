import type { HttioBody } from "~/types/body";
import type { Payload } from "~/types/data";
import type { HttioRequest, HttioResponse } from "~/types/http";

type MaybePromise<T> = Promise<T> | T;

export declare interface Middleware {
  (request: HttioRequest, next: NextMiddleware): MaybePromise<HttioResponse | Payload | Response>;
}

export declare interface NextMiddleware {
  (request: HttioRequest | Request): HttioBody & Promise<HttioResponse>;

  (url: URL | string, init?: HttioRequestInit): HttioBody & Promise<HttioResponse>;
}
