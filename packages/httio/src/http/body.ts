import type { HttioBody } from "~/types/response";
import { isFunction } from "~/utils/validate";

type Failure = readonly [never, unknown];
type Success = readonly [Response, never?];

function bind<T>(promise: Promise<Failure | Success>, key: keyof Response) {
  return async function handle(): Promise<T> {
    const [data, error] = await promise;

    if (error) {
      throw error;
    }

    return isFunction(data[key]) ? (data[key]() as T) : (data[key] as T);
  };
}

export default function body(promise: Promise<Failure | Success>): HttioBody {
  const data = { stream: bind(promise, "body") } as HttioBody;

  for (const property of ["arrayBuffer", "blob", "bytes", "json", "text"] satisfies (keyof HttioBody)[]) {
    data[property] = bind(promise, property) as never;
  }

  return data;
}
