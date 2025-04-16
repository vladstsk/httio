import pipeline from "~/http/pipeline";
import type { Middleware } from "~/types/pipeline";

describe("pipeline", () => {
  const mockFetcher = jest.fn();

  beforeEach(() => {
    mockFetcher.mockReset();
  });

  it("should add middleware via use()", () => {
    const mockMiddleware = jest.fn();
    const pipe = pipeline(mockFetcher);

    pipe.use(mockMiddleware);

    expect(pipe.pipes).toContain(mockMiddleware);
  });

  it("should execute fetch when handle is called", async () => {
    mockFetcher.mockResolvedValueOnce(new Response("test response"));

    pipeline(mockFetcher).handle("https://example.com", {
      method: "GET",
    });

    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });

  it("should execute middleware in order", async () => {
    const middleware1 = jest.fn((req, next) => next(req));
    const middleware2 = jest.fn((req, next) => next(req));

    mockFetcher.mockResolvedValueOnce(new Response("test response"));

    const pipe = pipeline(mockFetcher).use(middleware1, middleware2);

    pipe.handle("https://example.com", { method: "GET" });

    expect(middleware1).toHaveBeenCalledTimes(1);
    expect(middleware2).toHaveBeenCalledTimes(1);
  });

  it("should transform request in middleware", async () => {
    let headers = new Headers({
      "Content-Type": "application/json",
    });

    const update: Middleware = jest.fn((req, next) => {
      req.headers.set("X-Test", "test");

      return next(req);
    });

    const replace: Middleware = (req, next) => {
      headers = req.headers;

      return next(req);
    };

    mockFetcher.mockResolvedValueOnce(new Response("test response"));

    expect(headers.get("X-Test")).toBeNull();

    const pipe = pipeline(mockFetcher).use(update, replace);

    await pipe.handle("https://example.com", {
      headers,
      method: "GET",
    });

    expect(update).toHaveBeenCalledTimes(1);
    expect(headers.get("X-Test")).toBe("test");
  });

  it("should transform response in middleware", async () => {
    const middleware: Middleware = jest.fn(async () => {
      return "transformed response";
    });

    mockFetcher.mockResolvedValueOnce(new Response("test response"));

    const pipe = pipeline(mockFetcher).use(middleware);

    const response = await pipe.handle("https://example.com", {
      method: "GET",
    });

    expect(middleware).toHaveBeenCalledTimes(1);

    expect(await response.text()).toBe("transformed response");
  });
});
