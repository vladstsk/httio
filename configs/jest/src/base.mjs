/** @type {import("jest").Config} */
const config = {
  coverageReporters: ["json-summary", "text", "lcov"],
  moduleFileExtensions: ["js", "ts", "mjs"],
  preset: "ts-jest",
  rootDir: ".",
  roots: ["<rootDir>/tests"],
  testEnvironment: "node",
  testMatch: ["**/*.test.ts?(x)"],
};

export default config;
