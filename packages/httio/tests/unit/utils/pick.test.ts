import pick from "~/utils/pick";

describe("pick", () => {
  test("should select specified properties from an object", () => {
    const obj = {
      age: 30,
      city: "New York",
      country: "USA",
      name: "John",
    };

    const result = pick(obj, "name", "age");

    expect(result).toEqual({
      age: 30,
      name: "John",
    });
  });

  test("should return an empty object when no keys are specified", () => {
    const obj = {
      age: 30,
      name: "John",
    };

    const result = pick(obj);

    expect(result).toEqual({});
  });

  test("should work correctly with objects containing undefined property values", () => {
    const obj = {
      age: undefined,
      city: "New York",
      name: "John",
    };

    const result = pick(obj, "name", "age", "city");

    expect(result).toEqual({
      age: undefined,
      city: "New York",
      name: "John",
    });
  });

  test("should work with objects having nested properties", () => {
    const obj = {
      address: {
        city: "New York",
        country: "USA",
      },
      user: {
        age: 30,
        name: "John",
      },
    };

    const result = pick(obj, "user", "address");

    expect(result).toEqual({
      address: {
        city: "New York",
        country: "USA",
      },
      user: {
        age: 30,
        name: "John",
      },
    });
  });

  test("should preserve references to nested objects", () => {
    const nestedObj = { name: "John" };
    const obj = {
      age: 30,
      user: nestedObj,
    };

    const result = pick(obj, "user");

    expect(result.user).toBe(nestedObj);
  });
});
