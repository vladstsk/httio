import type { Json } from "~/types/data";

export declare interface HttioRequest extends Omit<HttioRequestInit, "headers"> {
  headers: Headers;
  url: URL;

  toString(): string;
}

export declare interface HttioRequestInit extends Omit<RequestInit, "body" | "headers" | "method" | "window"> {
  body?: BodyInit | Json;
  headers?: Headers | Record<string, string>;
  method: string;
}
