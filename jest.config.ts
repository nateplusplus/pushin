import * as path from 'path';
import type { Config } from '@jest/types';

const isCI = process.env.CI === 'true';

const config: Config.InitialOptions = {
  displayName: 'pushin',
  rootDir: path.resolve('.'),
  preset: 'ts-jest',

  /**
   * A set of global variables that need to be available in all test environments.
   */
  globals: {
    'ts-jest': {
      allowSyntheticDefaultImports: true,
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },

  transform: {
    '^.+\\.spec.ts$': 'ts-jest',
  },

  /**
   * By default, Jest runs all tests and produces all errors into the console upon completion.
   * The bail config option can be used here to have Jest stop running tests after n failures.
   * Setting bail to true is the same as setting bail to 1
   */
  bail: true,

  /**
   * Indicates whether the coverage information should be collected while executing the test.
   * Because this retrofits all executed files with coverage collection statements,
   * it may significantly slow down your tests.
   */
  collectCoverage: isCI,

  /**
   * An array of glob patterns indicating a set of files for which coverage
   * information should be collected. If a file matches the specified glob pattern,
   * coverage information will be collected for it even if no tests exist for this file and
   * it's never required in the test suite.
   */
  collectCoverageFrom: ['test/*.spec.ts'],

  /**
   * A list of reporter names that Jest uses when writing coverage reports.
   * Any istanbul reporter can be used.
   * https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-reports/lib
   */
  coverageReporters: ['json', 'lcovonly', 'lcov', 'text', 'html'],

  /**
   * The glob patterns Jest uses to detect test files.
   */
  testMatch: ['<rootDir>/test/**/*.spec.ts'],

  /**
   * Indicates whether each individual test should be reported during the run.
   * All errors will also still be shown on the bottom after execution.
   */
  verbose: true,

  /**
   * The directory where Jest should store its cached dependency information.
   */
  cacheDirectory: '<rootDir>/.cache',

  /**
   * By default, each test file gets its own independent module registry.
   * Enabling resetModules goes a step further and resets the module registry before running
   * each individual test. This is useful to isolate modules for every test so that local
   * module state doesn't conflict between tests. This can be done programmatically
   * using jest.resetModules().
   */
  resetModules: true,

  /**
   * Automatically clear mock calls and instances between every test.
   * Equivalent to calling jest.clearAllMocks() between each test.
   * This does not remove any mock implementation that may have been provided.
   */
  clearMocks: true,

  testEnvironment: 'node',
};

export default config;
