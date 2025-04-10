export type * from "~/types/client";
export type * from "~/types/data";
export type * from "~/types/fetch";
export type * from "~/types/pipeline";
export type * from "~/types/request";
export type * from "~/types/response";

import client from "~/client";
import HttpError from "~/http/error";

export { client, HttpError };

const httio = client();

export default httio;
