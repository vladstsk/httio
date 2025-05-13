import { RequestSymbol, ResponseSymbol } from "~/constants/http";
import type { PlaneObject } from "~/types/data";
import type { HttioRequest, HttioResponse } from "~/types/http";

const OBJECT_PROTOTYPE = Object.prototype;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface InstanceConstructor<A extends any[], R> {
  new (...args: A): R;

  prototype: R;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function instanceOf<A extends any[], R>(value: unknown, constructor: InstanceConstructor<A, R>): value is R {
  return value instanceof constructor;
}

export function isArray(value: unknown): value is unknown[] {
  return type(value) === "Array";
}

export function isHttioRequest(value: unknown): value is HttioRequest {
  return isPlaneObject(value) && RequestSymbol in value;
}

export function isHttioResponse(value: unknown): value is HttioResponse {
  return isPlaneObject(value) && ResponseSymbol in value;
}

export function isNumber(value: unknown): value is number {
  return type(value) === "Number";
}

export function isPlaneObject(value: unknown): value is PlaneObject {
  return type(value) === "Object" && Object.getPrototypeOf(value) === OBJECT_PROTOTYPE;
}

export function isPrimitive(value: unknown): value is boolean | number | string | null | undefined {
  return value === null || value === undefined || typeof value !== "object";
}

export function isString(value: unknown): value is string {
  return type(value) === "String";
}

export function type(value: unknown): string {
  return OBJECT_PROTOTYPE.toString.call(value).slice(8, -1);
}
