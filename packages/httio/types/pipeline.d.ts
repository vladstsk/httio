import type { HttioRequest } from "~/types/request";
import type { HttioResponse } from "~/types/response";

export type MiddlewareResult = BodyInit | HttioResponse | Response | null;

export declare interface Middleware {
  (request: HttioRequest, next: NextMiddleware): MiddlewareResult | Promise<MiddlewareResult>;
}

export declare interface NextMiddleware {
  (request: HttioRequest): HttioResponse;
}

export declare interface Pipeline {
  readonly pipes: Middleware[];

  handle(request: HttioRequest): HttioResponse;

  use(...middleware: Middleware[]): this;
}
