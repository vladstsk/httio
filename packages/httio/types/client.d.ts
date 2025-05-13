import type { HttioBody } from "~/types/body";
import type { Payload } from "~/types/data";
import type { Fetcher, QueryParams } from "~/types/fetch";
import type { HttioResponse } from "~/types/http";
import type { Middleware } from "~/types/pipeline";

export declare interface HttioClient extends HttioClientMethods {
  extends(options: HttioClientOptions): HttioClient;

  use(...middlewares: Middleware[]): this;
}

export declare interface HttioClientMethods {
  delete(url: string, options?: HttioRequestOptions): HttioBody & Promise<HttioResponse>;

  get(url: string, options?: HttioRequestOptions): HttioBody & Promise<HttioResponse>;

  head(url: string, options?: HttioRequestOptions): HttioBody & Promise<HttioResponse>;

  options(url: string, options?: HttioRequestOptions): HttioBody & Promise<HttioResponse>;

  patch(url: string, payload?: Payload, options?: HttioRequestOptions): HttioBody & Promise<HttioResponse>;

  post(url: string, payload?: Payload, options?: HttioRequestOptions): HttioBody & Promise<HttioResponse>;

  put(url: string, payload?: Payload, options?: HttioRequestOptions): HttioBody & Promise<HttioResponse>;
}

export declare interface HttioClientOptions extends HttioRequestOptions {
  fetch?: Fetcher;
  url?: string;
}

export declare interface HttioRequestOptions extends Omit<RequestInit, "body" | "headers" | "method" | "window"> {
  headers?: Record<string, string>;
  params?: QueryParams;
  retry?: RetryOptions | number;
  timeout?: number;
}

export declare interface RetryOptions {
  delay?: number;
  limit?: number;
}
