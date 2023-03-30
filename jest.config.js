/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  testMatch: ['**/*.test.ts'],
  testRunner: 'jest-circus/runner',
  setupFiles: ["dotenv/config"],
  verbose: true
};