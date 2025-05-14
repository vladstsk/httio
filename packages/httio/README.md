# **Httio**

[![Bundle size](https://img.shields.io/bundlephobia/minzip/httio)](https://bundlephobia.com/package/httio)
[![License](https://img.shields.io/npm/l/httio)](https://github.com/vladstsk/httio/blob/main/LICENSE)
[![Typed with TypeScript](https://badgen.net/npm/types/httio)](https://github.com/vladstsk/httio)

> Lightweight, type-safe HTTP client for browsers and Node.js.  
> Built on top of the native `fetch` but provides a better DX with strong typing, middleware and a minimalistic API.

---

## Table of Contents

1. [Why Httio?](#why-httio)
2. [Httio vs. The Rest](#httio-vs-the-rest)
3. [Installation](#installation)
4. [Quick Start](#quick-start)
    - [ES Modules (`import`)](#es-modules-import)
    - [CommonJS (`require`)](#commonjs-require)
5. [Type-Safe Requests](#type-safe-requests)
6. [Client Configuration](#client-configuration)
    - [Base client](#base-client)
    - [Extending an existing client](#extending-an-existing-client)
    - [Supported options](#supported-options)
7. [Handling Responses](#handling-responses)
8. [Middleware](#middleware)
9. [Error Handling](#error-handling)
10. [Recipes](#recipes)
    - [Passing query params](#passing-query-params)
    - [Uploading files](#uploading-files)
    - [Working with streams](#working-with-streams)
    - [Reusing an `AbortController`](#reusing-an-abortcontroller)
11. [API Reference](#api-reference)
    - [`client(options?)`](#clientoptions)
    - [HttioClient` instance](#httioclient-instance)
    - [`RequestOptions`](#requestoptions)
12. [FAQ](#faq)
13. [License](#license)

---

## Why Httio?

| Feature                      | Description                                                                                           |
|------------------------------|-------------------------------------------------------------------------------------------------------|
| **TypeScript-first**         | All public types are exported; strict compile-time checks.                                            |
| **Tiny footprint**           | Ships as ESM + CJS, zero runtime dependencies.                                                        |
| **Lazy parsing**             | Body is not parsed automatically—_you_ decide when and how.                                           |
| **One interface everywhere** | Works in browsers, Node 18+, edge functions—no polyfills required.                              |
| **Extensible**               | Middleware chain for logging, auth, caching, etc.                                                     |
| **Convenient cloning**       | `extends()` lets you reuse and override base options elegantly.                                       |
| **Full control**             | Everything from `fetch` is exposed plus syntactic sugar (`params`, `json`, `timeout`).                |

---

## Httio vs. The Rest

| Library          |                             Size (min + gzip)                              | TS-first | Browser | Node | Native `fetch` | Middleware | Retries |                                                                  Deps                                                                  | Notes          |
|------------------|:--------------------------------------------------------------------------:|:--------:|:-------:|:----:|:--------------:|:----------:|:-------:|:--------------------------------------------------------------------------------------------------------------------------------------:|----------------|
| **Httio**        |      ![size](https://img.shields.io/bundlephobia/minzip/httio?label)       |    ✅    |   ✅    |  ✅  |       ✅       |    ✅     |   ✅    |            [![deps](https://badgen.net/bundlephobia/dependency-count/httio?label)](https://bundlephobia.com/package/httio)             | Modern, tiny   |
| Axios            |      ![size](https://img.shields.io/bundlephobia/minzip/axios?label)       |    ⚠️    |   ✅    |  ✅  |       ❌       |    ⚠️     |   ⚠️    |            [![deps](https://badgen.net/bundlephobia/dependency-count/axios?label)](https://bundlephobia.com/package/axios)             | Heavy          |
| isomorphic-fetch | ![size](https://img.shields.io/bundlephobia/minzip/isomorphic-fetch?label) |    ❌    |   ✅    |  ✅  |       ✅       |    ❌     |   ❌    | [![deps](https://badgen.net/bundlephobia/dependency-count/isomorphic-fetch?label)](https://bundlephobia.com/package/isomorphic-fetch)  | Simple shim    |
| ky               |         ![size](https://img.shields.io/bundlephobia/minzip/ky?label)       |    ✅    |   ✅    |  ✅  |       ✅       |    ⚠️     |   ✅    |               [![deps](https://badgen.net/bundlephobia/dependency-count/ky?label)](https://bundlephobia.com/package/ky)                | Small, fetch-first   |
| superagent       |    ![size](https://img.shields.io/bundlephobia/minzip/superagent?label)    |    ⚠️    |   ✅    |  ✅  |       ❌       |    ✅     |   ⚠️    |       [![deps](https://badgen.net/bundlephobia/dependency-count/superagent?label)](https://bundlephobia.com/package/superagent)        | Classic        |
| request          |     ![size](https://img.shields.io/bundlephobia/minzip/request?label)      |    ❌    |   ❌    |  ✅  |       ❌       |    ❌     |   ❌    |          [![deps](https://badgen.net/bundlephobia/dependency-count/request?label)](https://bundlephobia.com/package/request)           | Deprecated     |
| r2               |        ![size](https://img.shields.io/bundlephobia/minzip/r2?label)        |    ⚠️    |   ❌    |  ✅  |       ✅       |    ❌     |   ❌    |               [![deps](https://badgen.net/bundlephobia/dependency-count/r2?label)](https://bundlephobia.com/package/r2)                | Minimal        |
| phin             |       ![size](https://img.shields.io/bundlephobia/minzip/phin?label)       |    ⚠️    |   ❌    |  ✅  |       ❌       |    ❌     |   ✅    |             [![deps](https://badgen.net/bundlephobia/dependency-count/phin?label)](https://bundlephobia.com/package/phin)              | Promise client |


### Key takeaways

1. **Native by design** – Httio is a thin layer above `fetch`, so knowledge transfers instantly and no shims are required in modern runtimes.
2. **Strict types everywhere** – every public method is generically typed, turning many runtime bugs into compile-time errors.
3. **Zero runtime deps** – smaller bundles, faster cold starts, less supply-chain risk.
4. **Middleware without bloat** – add logging, auth or caching in a few lines, no heavyweight “interceptors” machinery.
5. **One client → any environment** – the same code runs in browsers, Node 18+, edge workers and service workers.

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

### ES Modules (`import`)

```ts
import httio from 'httio';

// GET
const users = await httio.get('https://api.example.com/users').json();

const payload = {
  name: 'Alice',
  email: 'alice@example.com',
};

// POST
await httio.post('https://api.example.com/users', payload);

// PUT with query params
await httio.put('https://api.example.com/users/42', payload, {
  params: {
    notify: true,
  },
});
```

### CommonJS (`require`)

If your project is still on CommonJS (for example when you run Node ≤ 12 or simply prefer `require`), import the library like this:

```javascript
// Option 1 — named export (recommended)
const { client } = require('httio');

// Option 2 — default export (identical to ESM default)
const httio = require('httio');

// Example
const api = client({
  url: 'https://api.example.com',
});

api.get('/users/me').json().then(console.log);
```

`httio` ships with dual ESM/CJS bundles (`index.mjs` & `index.cjs`), so no extra Babel or `type: "module"` setup is required.

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
const v2 = api.extends({
  url: '/v2',
});

await v2.get('/status'); // → https://api.example.com/v2/status
```

### Supported options

| Option    | Type                                | Default                            | Description                                                      |
|-----------|-------------------------------------|------------------------------------|------------------------------------------------------------------|
| `url`     | `string \| URL`                     | –                                  | Base URL for relative paths.                                     |
| `url`     | `string \| URL` (only in `extends`) | –                                  | Extends the base URL or replaces it if the link contains a host. |
| `params`  | `Record<string, string \| number>`  | –                                  | Query params (auto-encoded).                                     |
| `timeout` | `number`                            | `1000`                             | Abort request after N ms.                                        |
| `retry`   | `number \| RetryOptions`            | `{ limit: 3, delay: 1000 }`        | How many times (and with what delay) to retry failed requests.   |
| `fetch`   | `Fetcher`                           | `globalThis.fetch \| window.fetch` | Custom fetch implementation (handy in tests).                    |

> You can also pass any field accepted by the standard Fetch `Request`/`Response` objects; those options are forwarded unchanged.

---

## Handling Responses

Httio returns a **wrapper** of type `HttioBody & Promise<HttioResponse>` around the native `Response`.

It behaves as both:

1. `Promise<HttioResponse>` – you can `await` it or call `.then()`.
2. `HttioBody` – exposes lazy body-parsers: `json()`, `text()`, `blob()`, `buffer()`, `bytes()`, `stream()`.

The HTTP request is dispatched immediately, while the response body is read only when one of the parsers is invoked.

| Method           | Return type               |
|------------------|---------------------------|
| `json<T>()`      | `Promise<T>`              |
| `text()`         | `Promise<string>`         |
| `blob()`         | `Promise<Blob>`           |
| `bytes()`        | `Promise<Uint8Array>`     |
| `buffer()`       | `Promise<ArrayBuffer>`    |
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

Middleware are async functions `(request: HttioRequest, next: NextMiddleware): MaybePromise<HttioResponse | Payload | Response>` executed in a chain:

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

`HttpError` extends the native `Error` class and additionally exposes:

| Property   | Type            | Description                                                   |
|------------|-----------------|---------------------------------------------------------------|
| `request`  | `HttioRequest`  | The request object that triggered the error (post-middleware) |
| `response` | `HttioResponse` | The received response (contains status, headers, etc.)        |

Standard `Error` fields (`name`, `message`, `stack`) remain available.

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

| Method                              | Description                                                          |
|-------------------------------------|----------------------------------------------------------------------|
| `get(url, opts?)`                   | `HEAD`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS` — same signature |
| `extends(opts)`                     | Returns a new client inheriting options                              |
| `use(...middleware)`                | Adds middleware                                                      |

### `RequestOptions`

Extends the native `RequestInit`:

| Extra field | Type                              | Description                   |
|-------------|-----------------------------------|-------------------------------|
| `params`    | `Record<string,string \| number>` | Adds query parameters         |
| `timeout`   | `number`                          | Aborts the request after N ms |
| `retry`     | `number \| RetryOptions`          | How many times (and with what delay) to retry failed requests. |

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

const api = client({
  fetch: fetchMock,
});
```

---

## License

Distributed under the MIT License.  
See [LICENSE](../../LICENSE) for more details.
