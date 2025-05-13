import type { HttioBody } from "~/types/body";
import type { Payload } from "~/types/data";

export declare interface HttioRequest {
  body?: Payload;
  headers: Headers;
  method: string;
  url: URL;

  clone(): HttioRequest;
  toRequest(): Request;
}

export declare interface HttioRequestInit extends Omit<RequestInit, "body" | "window"> {
  body?: Payload;
}

export declare interface HttioResponse extends HttioBody {
  readonly headers: Headers;
  readonly ok: boolean;
  readonly redirected: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly type: ResponseType;
  readonly url: string;

  clone(): HttioResponse;
}
