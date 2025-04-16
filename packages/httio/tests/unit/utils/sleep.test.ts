import sleep from "~/utils/sleep";

describe("sleep", () => {
  test("should create a delay for the specified number of milliseconds", async () => {
    const startTime = Date.now();
    const delay = 100;

    await sleep(delay);

    const endTime = Date.now();
    const elapsed = endTime - startTime;

    expect(elapsed).toBeGreaterThanOrEqual(delay);
    expect(elapsed).toBeLessThan(delay + 50);
  });

  test("should allow creating chains of delays", async () => {
    const startTime = Date.now();
    const delay = 50;

    await sleep(delay);
    await sleep(delay);
    await sleep(delay);

    const endTime = Date.now();
    const elapsed = endTime - startTime;

    const totalDelay = delay * 3;
    expect(elapsed).toBeGreaterThanOrEqual(totalDelay);
    expect(elapsed).toBeLessThan(totalDelay + 75);
  });

  test("should return a Promise that resolves to undefined", async () => {
    const result = await sleep(10);
    expect(result).toBeUndefined();
  });

  test("should work correctly with zero delay", async () => {
    const startTime = Date.now();

    await sleep(0);

    const endTime = Date.now();
    const elapsed = endTime - startTime;

    expect(elapsed).toBeGreaterThanOrEqual(0);
    expect(elapsed).toBeLessThan(50);
  });

  test("should handle negative values correctly", async () => {
    const startTime = Date.now();

    await sleep(-100);

    const endTime = Date.now();
    const elapsed = endTime - startTime;

    expect(elapsed).toBeGreaterThanOrEqual(0);
    expect(elapsed).toBeLessThan(50);
  });
});
