export type * from "~/types/body";
export type * from "~/types/client";
export type * from "~/types/data";
export type * from "~/types/fetch";
export type * from "~/types/http";
export type * from "~/types/pipeline";

import { client } from "~/client";
import { HttpError } from "~/error/http";

const httio = client();

export { client, httio as default, HttpError };
