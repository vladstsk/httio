import type { HttioBody } from "~/types/body";
import type { Payload } from "~/types/data";
import { isPlaneObject } from "~/utils/validate";

export function getBodyInit(payload?: Payload): BodyInit | null | undefined {
  if (isPlaneObject(payload)) {
    return JSON.stringify(payload);
  }

  return payload;
}

export function getBodyPayload(body?: BodyInit | Payload): Payload {
  try {
    return JSON.parse(body as string);
  } catch {
    return body;
  }
}

export function getResponseBody(response: Body | Promise<Body>): HttioBody {
  const promise = Promise.resolve(response);

  return {
    async blob() {
      const res = await promise;

      return res.blob();
    },

    async buffer() {
      const res = await promise;

      return res.arrayBuffer();
    },

    async bytes() {
      const res = await promise;

      return res.bytes();
    },

    async json() {
      const res = await promise;

      return res.json();
    },

    async stream() {
      const res = await promise;

      return res.body || new ReadableStream();
    },

    async text() {
      const res = await promise;

      return res.text();
    },
  };
}
