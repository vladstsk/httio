import type { HttioRequest, HttioRequestInit } from "~/types/request";
import type { HttioResponse, ResponseInstance } from "~/types/response";

export type MiddlewareResult = BodyInit | HttioResponse | Response | ResponseInstance | null;

export declare interface Middleware {
  (request: HttioRequest, next: NextMiddleware): MiddlewareResult | Promise<MiddlewareResult>;
}

export declare interface NextMiddleware {
  (request: HttioRequest): ResponseInstance;
}

export declare interface Pipeline {
  readonly pipes: Middleware[];

  handle(url: URL | string, options: HttioRequestInit): ResponseInstance;

  use(...middleware: Middleware[]): this;
}
