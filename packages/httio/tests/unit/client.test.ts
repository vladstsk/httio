import client from "~/client";
import type { HttioClientOptions } from "~/types/client";
import type { Json } from "~/types/data";
import type { Fetcher } from "~/types/fetch";

describe("HttioClient", () => {
  const mockUrl = "https://example.com";
  let mockFetch: jest.MockedFunction<Fetcher>;
  let mockOptions: HttioClientOptions;

  beforeEach(() => {
    mockFetch = jest.fn(async (req: Request) => {
      return new Response(req.body, {
        status: 200,
      });
    });

    mockOptions = {
      fetch: mockFetch,
      url: mockUrl,
    };
  });

  test("should initialize client with default options", () => {
    const instance = client();

    expect(instance).toBeDefined();
    expect(instance).toHaveProperty("delete");
    expect(instance).toHaveProperty("extends");
    expect(instance).toHaveProperty("get");
    expect(instance).toHaveProperty("head");
    expect(instance).toHaveProperty("options");
    expect(instance).toHaveProperty("patch");
    expect(instance).toHaveProperty("post");
    expect(instance).toHaveProperty("put");
    expect(instance).toHaveProperty("use");
  });

  const methods: [method: string, body: Json][] = [
    ["GET", null],
    ["POST", { key: "value" }],
    ["PUT", { key: "value" }],
    ["PATCH", { key: "value" }],
    ["DELETE", null],
    ["HEAD", null],
    ["OPTIONS", null],
  ];

  test.each(methods)("should send a %s request with the correct URL and options", async (method, body) => {
    // @ts-expect-error ---
    const res = client(mockOptions)[method.toLowerCase()]("/test", body || {});

    expect(mockFetch).toHaveBeenCalled();

    const req = mockFetch.mock.calls[0]![0];
    expect(req.method).toBe(method);
    expect(req.url).toBe(`${mockUrl}/test`);

    if (body !== null) {
      expect(await res.json()).toEqual(body);
    }
  });

  test("should extend the client with new options", async () => {
    client(mockOptions).extends({ url: "/extended" }).get("/test");

    expect(mockFetch).toHaveBeenCalled();

    const req = mockFetch.mock.calls[0]![0];
    expect(req.method).toBe("GET");
    expect(req.url).toBe(`${mockUrl}/extended/test`);
  });

  test("should correctly perform request when full URL is passed to the method and client has no base URL", async () => {
    delete mockOptions.url;

    client(mockOptions).get(mockUrl);

    expect(mockFetch).toHaveBeenCalled();

    const req = mockFetch.mock.calls[0]![0];

    expect(req.method).toBe("GET");
    expect(req.url).toBe(new URL(mockUrl).toString());
  });

  // test("should throw an error for non-ok responses", async () => {
  //   const resp = new Response("Not Found", {
  //     status: 404,
  //   });
  //
  //   mockFetch.mockResolvedValue(resp);
  //
  //   await expect(client(mockOptions).get("/fail").json()).rejects.toThrow(HttpError);
  // });

  test("should allow using middlewares via use()", async () => {
    const middleware = jest.fn((req, next) => next(req));

    client(mockOptions).use(middleware).get("/test");

    expect(mockFetch).toHaveBeenCalled();
    expect(middleware).toHaveBeenCalled();
  });
});
