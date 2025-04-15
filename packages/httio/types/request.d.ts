import type { Json } from "~/types/data";

export type HttioRequestInit = Omit<RequestInit, "body" | "headers" | "method" | "window"> & {
  body?: BodyInit | Json;
  headers?: Headers | Record<string, string>;
  method: string;
};

export declare interface HttioRequest extends HttioRequestInit {
  headers: Headers;
  url: URL;

  clone(): HttioRequest;

  toRequest(): Request;
}
