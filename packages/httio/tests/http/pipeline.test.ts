import { pipeline } from "~/http/pipeline";
import type { Middleware } from "~/types/pipeline";
import { delay } from "~/utils/timer";

describe("Http Pipeline", () => {
  const url = "https://example.com/";
  const request = new Request(url);
  const response = new Response("OK");
  const fetcher = jest.fn(async () => response);

  afterEach(() => {
    fetcher.mockClear();
  });

  test("should work without middlewares", async () => {
    const handle = pipeline([], fetcher);

    await handle(request);

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(expect.objectContaining({ url }));
  });

  test("should work with middlewares", async () => {
    const middleware: Middleware = jest.fn((req, next) => next(req));

    const handle = pipeline([middleware], fetcher);

    await handle(request);

    expect(middleware).toHaveBeenCalledTimes(1);
  });

  test("should handle http errors", async () => {
    fetcher.mockResolvedValue(new Response("Not Found", { status: 404 }));

    const handle = pipeline([], fetcher);

    await expect(handle(request)).rejects.toThrow();
  });

  test("should handle errors in middleware", async () => {
    const middleware: Middleware = jest.fn(() => {
      throw new Error("Middleware error");
    });

    const handle = pipeline([middleware], fetcher);

    await expect(handle(request)).rejects.toThrow("Middleware error");
    expect(fetcher).not.toHaveBeenCalled();
  });

  test("should handle timeout", async () => {
    fetcher.mockResolvedValue(delay(1000).then(() => new Response("OK", { status: 200 })));

    const handle = pipeline([], fetcher, { timeout: 50 });

    await expect(handle(request)).rejects.toThrow();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  test("should handle retries", async () => {
    const retry = 1;

    fetcher.mockResolvedValue(new Response("Too Many Requests", { status: 429 }));

    const handle = pipeline([], fetcher, {
      retry: { delay: 50, limit: retry },
    });

    await expect(handle(request)).rejects.toThrow();
    expect(fetcher).toHaveBeenCalledTimes(retry);
  });

  test("should handle retries", async () => {
    const retry = 1;

    fetcher.mockResolvedValue(new Response("Too Many Requests", { status: 429 }));

    const handle = pipeline([], fetcher, {
      retry,
    });

    await expect(handle(request)).rejects.toThrow();
    expect(fetcher).toHaveBeenCalledTimes(retry);
  });
});
