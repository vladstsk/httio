import { REQUEST, RESPONSE } from "~/utils/consts";
import { isArray, isHttioRequest, isHttioResponse, isPlaneObject, isString, type } from "~/utils/validate";

describe("validate utils", () => {
  test("type function returns correct type for different values", () => {
    expect(type("")).toBe("String");
    expect(type("hello")).toBe("String");
    expect(type(0)).toBe("Number");
    expect(type(123)).toBe("Number");
    expect(type(123.45)).toBe("Number");
    expect(type(true)).toBe("Boolean");
    expect(type(false)).toBe("Boolean");
    expect(type(null)).toBe("Null");
    expect(type(undefined)).toBe("Undefined");
    expect(type({})).toBe("Object");
    expect(type({ name: "test" })).toBe("Object");
    expect(type([])).toBe("Array");
    expect(type([1, 2, 3])).toBe("Array");
    expect(type(new Date())).toBe("Date");
    expect(type(new RegExp(""))).toBe("RegExp");
    expect(type(() => {})).toBe("Function");
    expect(type(new Map())).toBe("Map");
    expect(type(new Set())).toBe("Set");
  });

  test("isArray function correctly identifies arrays", () => {
    expect(isArray([])).toBe(true);
    expect(isArray([1, 2, 3])).toBe(true);
    expect(isArray([])).toBe(true);
    expect(isArray(Array.from("abc"))).toBe(true);

    expect(isArray(null)).toBe(false);
    expect(isArray(undefined)).toBe(false);
    expect(isArray("")).toBe(false);
    expect(isArray("string")).toBe(false);
    expect(isArray(123)).toBe(false);
    expect(isArray({})).toBe(false);
    expect(isArray({ length: 1 })).toBe(false);
    expect(isArray(true)).toBe(false);
    expect(isArray(false)).toBe(false);
    expect(isArray(new Set())).toBe(false);
    expect(isArray(new Map())).toBe(false);
  });

  test("isHttioRequest function correctly identifies HttioRequest", () => {
    expect(isHttioRequest({ [REQUEST]: REQUEST })).toBe(true);

    expect(isHttioRequest({})).toBe(false);
    expect(isHttioRequest(null)).toBe(false);
    expect(isHttioRequest({ [RESPONSE]: RESPONSE })).toBe(false);
    expect(isHttioRequest([])).toBe(false);
  });

  test("isHttioResponse function correctly identifies HttioResponse", () => {
    expect(isHttioResponse({ [RESPONSE]: RESPONSE })).toBe(true);

    expect(isHttioResponse({})).toBe(false);
    expect(isHttioResponse(null)).toBe(false);
    expect(isHttioResponse({ [REQUEST]: REQUEST })).toBe(false);
    expect(isHttioResponse([])).toBe(false);
  });

  test("isPlaneObject function correctly identifies plain objects", () => {
    expect(isPlaneObject({})).toBe(true);
    expect(isPlaneObject({ key: "value" })).toBe(true);

    expect(isPlaneObject(null)).toBe(false);
    expect(isPlaneObject(Object.create(null))).toBe(false);
    expect(isPlaneObject(undefined)).toBe(false);
    expect(isPlaneObject([])).toBe(false);
    expect(isPlaneObject(new Date())).toBe(false);
    expect(isPlaneObject(new Map())).toBe(false);
    expect(isPlaneObject(new Set())).toBe(false);
    expect(isPlaneObject(() => {})).toBe(false);
    expect(isPlaneObject(new RegExp(""))).toBe(false);
  });

  test("isString function correctly identifies strings", () => {
    expect(isString("")).toBe(true);
    expect(isString("hello")).toBe(true);
    expect(isString(String("test"))).toBe(true);
    expect(isString(new String("test"))).toBe(true);
    expect(isString(`template literal`)).toBe(true);

    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString(123)).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString(true)).toBe(false);
    expect(isString(false)).toBe(false);
    expect(isString(new Date())).toBe(false);
    expect(isString(new Set())).toBe(false);
    expect(isString(new Map())).toBe(false);
  });
});
