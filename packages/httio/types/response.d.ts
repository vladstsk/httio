import type { Json } from "~/types/data";

export type ResponseInstance = HttioBody & Promise<HttioResponse>;

export declare interface HttioBody {
  arrayBuffer(): Promise<ArrayBuffer>;

  blob(): Promise<Blob>;

  bytes(): Promise<Uint8Array>;

  json<T extends Json>(): Promise<T>;

  stream(): Promise<ReadableStream<Uint8Array>>;

  text(): Promise<string>;
}

export declare interface HttioResponse extends HttioBody {
  headers: Headers;
  status: number;
  url: URL;

  toString(): string;
}
