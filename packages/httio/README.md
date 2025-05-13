# **Httio**

[![Bundle size](https://img.shields.io/bundlephobia/minzip/httio)](https://bundlephobia.com/package/httio)
[![License](https://img.shields.io/npm/l/httio)](https://github.com/vladstsk/httio/blob/main/LICENSE)
[![Typed with TypeScript](https://badgen.net/npm/types/httio)](https://github.com/vladstsk/httio)

> Lightweight, type-safe HTTP client for browsers and Node.js.  
> Built on top of the native `fetch` but provides a better DX with strong typing, middleware and a minimalistic API.

---

## Table of Contents

1. [Why Httio?](#why-httio)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Type-Safe Requests](#type-safe-requests)
5. [Client Configuration](#client-configuration)
6. [Handling Responses](#handling-responses)
7. [Middleware](#middleware)
8. [Error Handling](#error-handling)
9. [Recipes](#recipes)
10. [API Reference](#api-reference)
11. [FAQ](#faq)
12. [License](#license)

---

## Why Httio?

| Feature                   | Description                                                                                           |
|---------------------------|-------------------------------------------------------------------------------------------------------|
| **TypeScript-first**      | All public types are exported; strict compile-time checks.                                            |
| **Tiny footprint**        | Ships as ESM + CJS, zero runtime dependencies.                                                        |
| **Lazy parsing**          | Body is not parsed automatically—_you_ decide when and how.                                           |
| **One interface everywhere** | Works in browsers, Node 18+, edge functions—no polyfills required.                              |
| **Extensible**            | Middleware chain for logging, auth, caching, etc.                                                     |
| **Convenient cloning**    | `extends()` lets you reuse and override base options elegantly.                                       |
| **Full control**          | Everything from `fetch` is exposed plus syntactic sugar (`params`, `json`, `timeout`).                |

---

## Installation

```bash
# npm
npm i httio

# yarn
yarn add httio

# pnpm
pnpm add httio
```

Node 18+ already includes `fetch`.  
For earlier versions add any fetch polyfill.

---

## Quick Start

```ts
import httio from 'httio';

// GET
const users = await httio.get('https://api.example.com/users').json();

// POST
await httio.post(
  'https://api.example.com/users',
  { name: 'Alice', email: 'alice@example.com' }
).json();

// PUT with query params
await httio.put(
  'https://api.example.com/users/42',
  { name: 'Bob' },
  { params: { notify: true } }
);
```

---

## Type-Safe Requests

```ts
import httio from 'httio';

interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserDto {
  name: string;
  email: string;
}

// Strictly typed array
const list = async (): Promise<User[]> => {
  return httio.get('https://api.example.com/users').json<User[]>();
}

// Typed payload + response
const create = async (payload: CreateUserDto): Promise<User> => {
  return httio.post('https://api.example.com/users', payload).json<User>();
};
```

`json<T>()` guarantees the shape of data at **compile-time**.

---

## Client Configuration

### Base client

```ts
import { client } from 'httio';

const api = client({
  url: 'https://api.example.com',
  headers: { 'Accept': 'application/json' },
});
```

### Extending an existing client

`extends()` returns a _new_ instance with inherited and/or overridden options:

```ts
const v2 = api.extends({ url: '/v2' });
await v2.get('/status');        // → https://api.example.com/v2/status
```

### Supported options

| Option    | Type                                   | Default                            | Description                                     |
|-----------|----------------------------------------|------------------------------------|-------------------------------------------------|
| `url`     | `string \| URL`                        | –                                  | Base URL for relative paths.                    |
| `headers` | `HeadersInit`                          | –                                  | Global headers.                                 |
| `params`  | `Record<string, string \| number>`     | –                                  | Query params (auto-encoded).                    |
| `timeout` | `number`                               | –                                  | Abort request after N ms via `AbortController`. |
| `url`     | `string \| URL` (only in `extends`)    | –                                  | Alias for `base` when only host changes.        |
| `fetch`   | `(input, init) => Promise<Response>`   | `globalThis.fetch \| window.fetch` | Custom fetch implementation (handy in tests).                    |

---

## Handling Responses

Httio returns a **wrapper** around `Response` with extra parsing helpers.  
They are _lazy_—HTTP call is sent immediately, but body reading starts only when a parser is invoked.

| Method           | Return type            |
|------------------|------------------------|
| `json<T>()`      | `Promise<T>`           |
| `text()`         | `Promise<string>`      |
| `blob()`         | `Promise<Blob>`        |
| `bytes()`        | `Promise<Uint8Array>`  |
| `buffer()`       | `Promise<ArrayBuffer>` |
| `stream()`       | `Promise<ReadableStream>` |

Example of deferred parsing:

```ts
// Fire the request
const response = httio.get('/slow-endpoint');

// Do something else in parallel
await doSomething();

// Now read the body
const data = await response.json<MyData>();
```

---

## Middleware

Middleware are async functions `(req, next) => Response` executed in a chain:

```ts
import httio, { type Middleware } from 'httio';

const auth: Middleware = async (req, next) => {
  req.headers.set('Authorization', `Bearer ${getToken()}`);
  
  return next(req);
};

const logger: Middleware = async (req, next) => {
  const started = performance.now();
  
  const res = await next(req);
  console.log(`${req.method} ${req.url} → ${res.status} (${Date.now() - started} ms)`);
  
  return res;
};

httio.use(auth, logger);
```

Flow: `auth → logger → fetch → logger → auth`.

---

## Error Handling

HTTP status `4xx/5xx` triggers a `HttpError`:

```ts
import httio, { HttpError } from 'httio';

try {
  await httio.get('/admin').json();
} catch (err) {
  if (err instanceof HttpError) {
    console.error(`Error ${err.status}: ${err.message}`);
  } else {
    throw err; // non-HTTP error
  }
}
```

`HttpError` exposes:

| Property    | Description                      |
|-------------|----------------------------------|
| `status`    | HTTP status code                 |
| `statusText`| Human-readable text (if any)     |
| `response`  | Original `Response` object       |
| `url`       | Final URL (after redirects)      |

---

## Error Handling

HTTP status codes in the `4xx/5xx` range throw an instance of `HttpError`:
```ts
import httio, { HttpError } from 'httio';

try {
  await httio.get('/admin').json();
} catch (err) {
  if (err instanceof HttpError) {
    // Access the original request and response objects
    const { request, response } = err;

    console.error(
      `Request to ${request.url} failed with status ${response.status} ${response.statusText}`,
    );
  } else {
    throw err; // non-HTTP error
  }
}
```

`HttpError` exposes only two properties:

| Property  | Type            | Description                              |
|-----------|-----------------|------------------------------------------|
| `request` | `HttioRequest`  | Object representing the original request |
| `response`| `HttioResponse` | Object representing the server response  |

You can read any additional details (status code, headers, body, etc.) from the `response` object itself.

---

## Recipes

### Passing query params

```ts
httio.get('/search', { params: { q: 'httio', page: 2 } });
```

Produces `/search?q=httio&page=2`.

### Uploading files

```ts
const form = new FormData();
form.append('avatar', file);

await httio.post('/me/avatar', form);
```

`Content-Type: multipart/form-data` is set automatically.

### Working with streams

```ts
const stream = await httio.get('/logs').stream();
const reader = stream.getReader();

while (true) {
  const { value, done } = await reader.read();
  
  if (done) {
    break;
  }
  
  console.log(new TextDecoder().decode(value));
}
```

### Reusing an `AbortController`

```ts
const controller = new AbortController();

setTimeout(() => controller.abort(), 5000); // 5 s timeout

httio.get('/long', { signal: controller.signal });
```

---

## API Reference

### `client(options?)`

Creates a new client.  
See [configuration](#supported-options) for the list of parameters.

### `HttioClient` instance

| Method                              | Description                                    |
|-------------------------------------|------------------------------------------------|
| `get(url, opts?)`                   | `HEAD`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS` — same signature |
| `extends(opts)`                     | Returns a new client inheriting options        |
| `use(...middleware)`                | Adds middleware                                |

### `RequestOptions`

Extends the native `RequestInit`:

| Extra field | Type                            | Description                    |
|-------------|---------------------------------|--------------------------------|
| `params`    | `Record<string,string|number>`  | Adds query parameters          |
| `timeout`   | `number`                        | Aborts the request after N ms  |

### Types

All core interfaces are exported from the package root:

```ts
import type { HttioClient, Middleware, HttpError } from 'httio';
```

---

## FAQ

### Is it a full Axios replacement?

Httio focuses on **type safety** and minimalism.  
If you need request/response transformers, cancellation, works-everywhere support and do not want heavy dependencies—yes, Httio can be a solid alternative.

### Are legacy browsers supported?

Any environment with `fetch` (or a polyfill) and `ReadableStream` works.  
IE 11 would require polyfills for both Promise and fetch, but the package is not officially tested there.

### How do I test code that uses Httio?

Pass your own `fetch` to the client:

```ts
import { client } from 'httio';
import { createFetchMock } from '@mswjs/interceptors';

const fetchMock = createFetchMock();
const api = client({ fetch: fetchMock });
```

---

## License

Distributed under the MIT License.  
See [LICENSE](../../LICENSE) for more details.
