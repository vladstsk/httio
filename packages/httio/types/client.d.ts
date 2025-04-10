import type { Json } from "~/types/data";
import type { Fetcher, QueryParams } from "~/types/fetch";
import type { Middleware } from "~/types/pipeline";
import type { HttioRequestInit } from "~/types/request";
import type { HttioResponse } from "~/types/response";

export type HttioClientOptions = Omit<HttioRequestInit, "body" | "method"> & {
  fetch?: Fetcher;
  query?: QueryParams;
  url?: URL | string;
};

export type HttioMethodOptions = Omit<HttioClientOptions, "fetch">;

export declare interface HttioClient {
  delete(url: string, options?: HttioMethodOptions): HttioResponse;

  extends(options: HttioClientOptions): HttioClient;

  get(url: string, options?: HttioMethodOptions): HttioResponse;

  head(url: string, options?: HttioMethodOptions): HttioResponse;

  options(url: string, options?: HttioMethodOptions): HttioResponse;

  patch(url: string, payload?: BodyInit | Json, options?: HttioMethodOptions): HttioResponse;

  post(url: string, payload?: BodyInit | Json, options?: HttioMethodOptions): HttioResponse;

  put(url: string, payload?: BodyInit | Json, options?: HttioMethodOptions): HttioResponse;

  use(...middlewares: Middleware[]): this;
}
