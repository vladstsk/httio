import type { QueryParams } from "~/types/fetch";
import { isArray, isPlaneObject, isPrimitive } from "~/utils/validate";

function inject(search: URLSearchParams, parent?: string, params?: QueryParams): void {
  if (!params) {
    return;
  }

  for (const [name, value] of Object.entries(params)) {
    const key = parent ? `${parent}[${name}]` : name;

    if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const index = `${key}[${i}]`;
        const item = value[i];

        if (isPrimitive(item)) {
          search.append(index, encodeURI(String(item)));
        } else {
          inject(search, index, item);
        }
      }
    }

    if (isPrimitive(value)) {
      search.append(key, String(value));
    } else if (isPlaneObject(value)) {
      inject(search, key, value);
    }
  }
}

export function join(...paths: string[]): string {
  let domain: string | undefined;
  const segments: string[] = [];

  for (const path of paths) {
    const offset = path.indexOf("://");
    let start: number = 0;
    let end: number = path.length;

    if (offset > 0) {
      start = path.indexOf("/", offset + 3);

      if (start < 0) {
        start = path.length;
      }
    }

    if (offset > 0) {
      domain = path.slice(0, start);
    }

    for (; start < path.length; start++) {
      if (path[start] !== "/") {
        break;
      }
    }

    for (; end > start; end--) {
      if (path[end - 1] !== "/") {
        break;
      }
    }

    if (start < end) {
      segments.push(path.slice(start, end));
    }
  }

  if (domain) {
    segments.unshift(domain);
  }

  return segments.join("/");
}

export function search(params?: QueryParams) {
  const target = new URLSearchParams();

  inject(target, void 0, params);

  const value = target.toString();

  return value ? "?" + value : value;
}
