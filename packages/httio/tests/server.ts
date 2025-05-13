/* istanbul ignore file */

import express from "express";
import type http from "http";

let server: ReturnType<typeof app.listen>;
const app = express();

function payload(request: http.IncomingMessage) {
  if (!request.url) {
    throw new Error("Request url is not defined");
  }

  const url = new URL(request.url, hostname());

  return {
    args: Object.fromEntries(url.searchParams.entries()),
    headers: request.headers,
    url: `${url.protocol}//${url.host}${url.pathname}`,
  };
}

// ==== METHODS ====
app.delete("/delete", (req, res) => {
  res.json(payload(req));
});

app.get("/get", (req, res) => {
  res.json(payload(req));
});

app.head("/head", (_req, res) => {
  res.end();
});

app.options("/options", (req, res) => {
  res.json(payload(req));
});

app.patch("/patch", (req, res) => {
  res.json(payload(req));
});

app.post("/post", (req, res) => {
  res.json(payload(req));
});

app.put("/put", (req, res) => {
  res.json(payload(req));
});

// ==== HEADERS ====
app.all("/headers", (req, res) => {
  const data = payload(req);

  res.json({ headers: data.args });
});

// ==== UTILITIES ====
app.all("/status/:status", (req, res) => {
  const status = Number(req.params.status);

  res.status(status).json({ status });
});

app.all("/delay/:delay", (req, res) => {
  const s = Number(req.params.delay);

  setTimeout(() => res.json({ delay: s }), s * 1000);
});

app.all("/redirect", (req, res) => {
  const url = payload(req).args.url;

  if (!url) {
    throw new Error("Redirect url is not defined");
  }

  res.redirect(url);
});

function hostname(): string {
  const address = server?.address() || null;

  if (address === null || typeof address === "string") {
    throw new Error("Server is not listening");
  }

  return `http://127.0.0.1:${address.port}`;
}

export function start() {
  server = app.listen();

  return hostname();
}

export function stop() {
  return server?.close();
}
