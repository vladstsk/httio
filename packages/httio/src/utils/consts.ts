export const REQUEST = Symbol("HttioRequest");

export const RESPONSE = Symbol("HttioResponse");

export const CONTENT_TYPES = {
  blob: "application/octet-stream",
  buffer: "application/octet-stream",
  form: "multipart/form-data",
  json: "application/json",
  query: "application/x-www-form-urlencoded",
  stream: "application/octet-stream",
  text: "text/plain; charset=utf-8",
};
