import type { Json } from "~/types/data";

export default class HttpError extends Error {
  public readonly headers: Headers;
  public readonly status: number;

  private readonly _response: Response;

  constructor(message: string | null | undefined, request: Request, response: Response) {
    super(message || `[${request.method}] ${request.url}: ${response.statusText}`);

    this.status = response.status;
    this.headers = response.headers;
    this._response = response;
  }

  async blob(): Promise<Blob> {
    return this._response.blob();
  }

  async buffer(): Promise<ArrayBuffer> {
    return this._response.arrayBuffer();
  }

  async bytes(): Promise<Uint8Array> {
    return this._response.bytes();
  }

  async json<T extends Json>(): Promise<T> {
    return this._response.json();
  }

  async stream(): Promise<ReadableStream> {
    return this._response.body!;
  }

  async text(): Promise<string> {
    return this._response.text();
  }
}
