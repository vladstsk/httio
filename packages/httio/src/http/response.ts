import { ResponseSymbol } from "~/constants/http";
import { getBodyInit, getResponseBody } from "~/http/body";
import type { Payload } from "~/types/data";
import type { HttioResponse } from "~/types/http";
import { assign, references } from "~/utils/object";
import { instanceOf, isHttioResponse } from "~/utils/validate";

export function response(origin: Response): HttioResponse;
export function response(instance: HttioResponse): HttioResponse;
export function response(payload?: Payload, init?: ResponseInit): HttioResponse;
export function response(origin: HttioResponse | Payload | Response, init?: ResponseInit): HttioResponse {
  if (isHttioResponse(origin)) {
    return origin;
  }

  if (!instanceOf(origin, Response)) {
    return response(new Response(getBodyInit(origin), init));
  }

  return assign(
    { [ResponseSymbol]: ResponseSymbol },

    getResponseBody(origin),

    references(origin, "headers", "ok", "redirected", "status", "statusText", "type", "url"),

    {
      clone(): HttioResponse {
        return response(origin.clone());
      },
    }
  );
}
