import type { HttioRequest } from "~/types/request";
import type { HttioResponse } from "~/types/response";
import { REQUEST, RESPONSE } from "~/utils/consts";

export function isArray(value: unknown): value is unknown[] {
  return type(value) === "Array";
}

export function isHttioRequest(value: unknown): value is HttioRequest {
  return type(value) === "Object" && REQUEST in (value as object);
}

export function isHttioResponse(value: unknown): value is HttioResponse {
  return type(value) === "Object" && RESPONSE in (value as object);
}

export function isPlaneObject(value: unknown): value is Record<string, unknown> {
  return type(value) === "Object" && Object.getPrototypeOf(value) === Object.prototype;
}

export function isString(value: unknown): value is string {
  return type(value) === "String";
}

export function type(value: unknown): string {
  return Object.prototype.toString.call(value).slice(8, -1);
}
