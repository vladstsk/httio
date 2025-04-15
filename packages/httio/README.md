[![Bundle size](https://img.shields.io/bundlephobia/minzip/httio)](https://bundlephobia.com/package/httio)
[![License](https://img.shields.io/npm/l/httio)](https://github.com/vladstsk/httio/blob/main/LICENSE)
[![Typed with TypeScript](https://badgen.net/npm/types/httio)](https://github.com/vladstsk/httio)

A lightweight, type-safe HTTP client for browser and Node.js environments.

## Features

- **TypeScript first** - Full type safety with TypeScript generics
- **Simple API** - Intuitive interface for making HTTP requests
- **Lazy evaluation** - Control when to parse response data
- **Promise-based** - Modern async/await pattern for request handling
- **Middleware support** - Extend functionality with custom middleware
- **Lightweight** - Minimal footprint
- **Customizable** - Flexible configuration for various use cases

## Installation

```bash
npm install httio
```

```bash
yarn add httio
```

```bash
pnpm add httio
```

## Basic Usage

```typescript
import httio from 'httio';

// Make a GET request
const getUsers = async () => {
  const response = httio.get('https://api.example.com/users');
  
  return response.json();
};

// Make a POST request
const createUser = async (payload) => {
  const response = httio.post('https://api.example.com/users', payload);
  
  return response.json();
};
```

## Type-Safe Requests

```typescript
import httio from 'httio';

// Define types for requests and responses
interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
}

// Typed requests
const getUsers = async (): Promise<User[]> => {
  const response = httio.get('https://api.example.com/users');
  
  return response.json<User[]>();
};

const createUser = async (payload: CreateUserRequest): Promise<User> => {
  const response = httio.post('https://api.example.com/users', payload);

  return response.json<User[]>();
};
```

## Lazy Evaluation

One of the key features of httio is that responses need explicit parsing, giving you control over when and how to process the response data:

```typescript
import httio from 'httio';

// Start a request but don't parse the result immediately
const pendingRequest = httio.post('https://api.example.com/users/create', {
  name: "John Doe",
  email: "john@example.com",
});

// Do some other operations
await someOtherOperation();

// Now wait for the request to complete and get JSON result
const result = await pendingRequest.json();
```

## Using Middleware

```typescript
import httio from 'httio';
import type { Middleware } from 'httio';

// Create middleware
const auth: Middleware = async (request, next) => {
  request.headers.Authorization = `Bearer ${getToken()}`;
  
  return next(request);
};

const logging: Middleware = async (request, next) => {
  console.log(`[${request.method}] ${request.url}`);
  
  const response = await next(request);
  
  console.log(`Response status: ${response.status}`);
  
  return response;
};

httio.use(auth, logging);

// Apply middleware
const response = await httio.get('https://api.example.com/users').json();
```

## Error Handling

```typescript
import httio from 'httio';

try {
  const users = await httio.get('https://api.example.com/users').json();
  
  console.log(users);
} catch (error) {
  if (error.status === 404) {
    console.error('Resource not found');
  } else if (error.status === 401) {
    console.error('Unauthorized');
  } else {
    console.error('An error occurred:', error.message);
  }
}
```

## Response Methods

The client provides several methods to handle different response types:

```typescript
// Get JSON response
const json = await httio.get('https://api.example.com/users').json();

// Get text response
const text = await httio.get('https://api.example.com/content').text();

// Get Blob response
const blob = await httio.get('https://api.example.com/image').blob();

// Get ArrayBuffer response
const buffer = await httio.get('https://api.example.com/binary').buffer();

// Get ReadableStream response
const stream = await httio.get('https://api.example.com/form').stream();
```

## Advanced Configuration

```typescript
import httio from 'httio';

const response = await httio
  .get('https://api.example.com/users', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  .json();
```

## API Reference

### New Client Instance

Creates a new HTTP client instance targeting the specified URL.

```typescript
import { client } from 'httio';

const httio = client({
  base: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});
```

### Request Methods

- `client.get(url, options?)` - Make a GET request
- `client.post(url, payload?, options?)` - Make a POST request
- `client.put(url, payload?, options?)` - Make a PUT request
- `client.patch(url, payload?, options?)` - Make a PATCH request
- `client.delete(url, options?)` - Make a DELETE request
- `client.head(url, options?)` - Make a HEAD request
- `client.options(url, options?)` - Make an OPTIONS request

### Configuration Methods

- `client.extends(options?)` - Set request timeout in milliseconds
- `client.use(middleware)` - Add middleware to the request

### Response Methods

- `response.json()` - Parse response as JSON
- `response.text()` - Parse response as text
- `response.blob()` - Parse response as Blob
- `response.bytes()` - Parse response as Uint8Array
- `response.buffer()` - Parse response as ArrayBuffer
- `response.stream()` - Parse response as ReadableStream
