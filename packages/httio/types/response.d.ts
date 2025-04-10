import type { Json } from "~/types/data";

export declare interface HttioResponse {
  blob(): Promise<Blob>;

  buffer(): Promise<ArrayBuffer>;

  bytes(): Promise<Uint8Array>;

  clone(): HttioResponse;

  json<T extends Json>(): Promise<T>;

  origin(): Promise<Response>;

  stream(): Promise<ReadableStream>;

  text(): Promise<string>;
}
