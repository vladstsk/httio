export type Json = Json[] | Record<PropertyKey, Json> | boolean | number | string | null;

export type Payload = BodyInit | Record<PropertyKey, Json> | null | undefined;

export type PlaneObject = Record<string, unknown>;
