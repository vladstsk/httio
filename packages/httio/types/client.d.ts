import type { Json } from "~/types/data";
import type { Fetcher, QueryParams } from "~/types/fetch";
import type { Middleware } from "~/types/pipeline";
import type { HttioRequestInit } from "~/types/request";

export type HttioMethodOptions = Omit<HttioClientOptions, "fetch">;

export declare interface HttioClient extends HttioClientMethods {
  extends(options: HttioClientOptions): HttioClient;

  use(...middlewares: Middleware[]): this;
}

export declare interface HttioClientMethods {
  delete(url: string, options?: HttioMethodOptions): ResponseInstance;

  get(url: string, options?: HttioMethodOptions): ResponseInstance;

  head(url: string, options?: HttioMethodOptions): ResponseInstance;

  options(url: string, options?: HttioMethodOptions): ResponseInstance;

  patch(url: string, payload?: BodyInit | Json, options?: HttioMethodOptions): ResponseInstance;

  post(url: string, payload?: BodyInit | Json, options?: HttioMethodOptions): ResponseInstance;

  put(url: string, payload?: BodyInit | Json, options?: HttioMethodOptions): ResponseInstance;
}

export declare interface HttioClientOptions extends Omit<HttioRequestInit, "body" | "method"> {
  fetch?: Fetcher;
  query?: QueryParams;
  url?: URL | string;
}
