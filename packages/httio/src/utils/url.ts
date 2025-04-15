import type { QueryParams } from "~/types/fetch";
import { isArray, isPlaneObject, type } from "~/utils/validate";

function inject(search: URLSearchParams, parent?: string, params?: QueryParams): void {
  for (const name in params) {
    const key = parent ? `${parent}[${name}]` : name;

    if (isArray(params[name])) {
      for (let i = 0; i < params[name].length; i++) {
        const index = `${key}[${i + 1}]`;

        if (["Boolean", "Number", "String"].includes(type(params[name][i]))) {
          search.append(index, String(params[name][i]));
        } else {
          inject(search, index, params[name][i] as QueryParams);
        }
      }
    }

    if (["Boolean", "Number", "String"].includes(type(params[name]))) {
      search.append(key, String(params[name]));
    }

    if (isPlaneObject(params[name])) {
      inject(search, key, params[name] as QueryParams);
    }
  }
}

export default function url(base: URL | string, path: string, params?: QueryParams): URL {
  if (!(base instanceof URL)) {
    base = new URL(base);
  }

  let pathname = base.pathname;

  base.pathname = "";

  if (path.includes("://")) {
    pathname = "";
  }

  const url = new URL(path, base);

  url.pathname = (pathname + url.pathname).replace("//", "/");

  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
  }

  if (url.search !== base.search) {
    url.search = base.search + "&" + url.search.slice(1);
  }

  inject(url.searchParams, void 0, params);

  return url;
}
