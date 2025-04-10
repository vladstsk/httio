import type { Json } from "~/types/data";
import type { HttioResponse } from "~/types/response";
import { RESPONSE } from "~/utils/consts";

export default function response(factory: () => Promise<Response>): HttioResponse {
  const promise = factory().then(
    (data) => ({ data, error: null as never }),
    (error) => ({ data: null as never, error })
  );

  return Object.assign(
    { [RESPONSE]: RESPONSE },
    {
      async blob(): Promise<Blob> {
        const { data, error } = await promise;

        if (error) {
          throw error;
        }

        return data.blob();
      },

      async buffer(): Promise<ArrayBuffer> {
        const { data, error } = await promise;

        if (error) {
          throw error;
        }

        return data.arrayBuffer();
      },

      async bytes(): Promise<Uint8Array> {
        const { data, error } = await promise;

        if (error) {
          throw error;
        }

        return data.bytes();
      },

      clone(): HttioResponse {
        return response(async () => {
          const { data, error } = await promise;

          if (error) {
            throw error;
          }

          return data.clone();
        });
      },

      async json<T extends Json>(): Promise<T> {
        const { data, error } = await promise;

        if (error) {
          throw error;
        }

        return data.json();
      },

      async origin(): Promise<Response> {
        const { data, error } = await promise;

        if (error) {
          throw error;
        }

        return data;
      },

      async stream(): Promise<ReadableStream> {
        const { data, error } = await promise;

        if (error) {
          throw error;
        }

        return data.body!;
      },

      async text(): Promise<string> {
        const { data, error } = await promise;

        if (error) {
          throw error;
        }

        return data.text();
      },
    }
  );
}
