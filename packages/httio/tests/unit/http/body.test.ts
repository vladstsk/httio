import body from "~/http/body";

describe("body function", () => {
  const mockMethods = [
    ["arrayBuffer", new ArrayBuffer(10)],
    ["blob", new Blob(["test"])],
    ["bytes", new Uint8Array([1, 2, 3])],
    ["json", { key: "value" }],
    ["text", "test string"],
  ] as const;

  test.each(mockMethods)("should include the %s method", async (property, payload) => {
    const res = mockMethods.reduce((response, [method, value]) => {
      response[method as never] = jest.fn(() => Promise.resolve(value)) as never;

      return response;
    }, {} as Response);

    const methods = body(Promise.resolve([res]));

    expect(methods).toHaveProperty(property);

    const method = methods[property];

    await expect(method()).resolves.toBe(payload);
  });

  test("should throw an error", async () => {
    const error = new Error("Test error");
    const methods = body(Promise.resolve([null as never, error]));

    await expect(methods.json()).rejects.toThrow(error);
  });
});
