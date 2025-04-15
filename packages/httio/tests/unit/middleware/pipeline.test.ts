import request from "~/http/request";
import response from "~/http/response";
import pipeline from "~/middleware/pipeline";
import type { Middleware, NextMiddleware, Pipeline } from "~/types/pipeline";
import type { HttioRequest } from "~/types/request";

describe("Pipeline", () => {
  let mockRequest: HttioRequest;
  let mockResponse: Response;
  let mockPipeline: Pipeline;
  let mockDestination: jest.MockedFunction<NextMiddleware>;

  beforeEach(() => {
    mockRequest = request(new URL("https://example.com"), {
      method: "GET",
    });
    mockResponse = new Response("Destination response");
    mockDestination = jest.fn().mockReturnValue(response(async () => mockResponse));

    mockPipeline = pipeline(mockDestination);
  });

  test("should create pipeline with destination", () => {
    expect(mockPipeline).toHaveProperty("handle");
    expect(mockPipeline).toHaveProperty("pipes");
    expect(mockPipeline).toHaveProperty("use");
    expect(mockPipeline.pipes).toEqual([]);
  });

  test("should add middleware with use()", () => {
    const middleware1: Middleware = jest.fn((req, next) => next(req));
    const middleware2: Middleware = jest.fn((req, next) => next(req));

    mockPipeline.use(middleware1);

    expect(mockPipeline.pipes).toEqual([middleware1]);

    mockPipeline.use(middleware2);

    expect(mockPipeline.pipes).toEqual([middleware1, middleware2]);
  });

  test("should execute middleware in correct order", async () => {
    const executionOrder: number[] = [];

    const middleware1: Middleware = jest.fn((req, next) => {
      executionOrder.push(1);
      return next(req);
    });

    const middleware2: Middleware = jest.fn((req, next) => {
      executionOrder.push(2);
      return next(req);
    });

    mockPipeline.use(middleware1, middleware2).handle(mockRequest);

    expect(executionOrder).toEqual([1, 2]);
    expect(mockDestination).toHaveBeenCalledTimes(1);
  });

  test("should allow middleware to return custom response", async () => {
    const customResponse = new Response("Custom response");

    const middleware: Middleware = jest.fn(async () => customResponse);

    const res = mockPipeline.use(middleware).handle(mockRequest);

    expect(await res.origin()).toBe(customResponse);
    expect(mockDestination).not.toHaveBeenCalled();
  });

  test("should allow middleware to return string body", async () => {
    const middleware: Middleware = jest.fn(() => "String body");

    const res = mockPipeline.use(middleware).handle(mockRequest);

    expect(await res.text()).toBe("String body");
    expect(mockDestination).not.toHaveBeenCalled();
  });

  test("should handle error thrown in middleware when receiving typed data", async () => {
    const middleware: Middleware = jest.fn(() => {
      throw new Error("Middleware error");
    });

    const res = mockPipeline.use(middleware).handle(mockRequest);

    await expect(res.json()).rejects.toThrow("Middleware error");
    expect(mockDestination).not.toHaveBeenCalled();
  });

  test("should throw error for invalid request", async () => {
    const middleware: Middleware = jest.fn((req, next) => next(req));

    mockPipeline.use(middleware);

    expect(() => mockPipeline.handle({} as never)).toThrow("Invalid request");

    expect(mockDestination).not.toHaveBeenCalled();
  });
});
