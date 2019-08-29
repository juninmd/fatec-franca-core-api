module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  bail: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: null,
  testRegex: "index.test.ts",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  coveragePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/__tests__/", "<rootDir>/node_modules/"]
};
