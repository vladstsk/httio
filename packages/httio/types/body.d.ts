import type { Json } from "~/types/data";

export declare interface HttioBody {
  blob(): Promise<Blob>;

  buffer(): Promise<ArrayBuffer>;

  bytes(): Promise<Uint8Array>;

  json<T extends Json>(): Promise<T>;

  stream(): Promise<ReadableStream<Uint8Array>>;

  text(): Promise<string>;
}
