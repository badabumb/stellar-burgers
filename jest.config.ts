import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: './',
  moduleDirectories: ['node_modules', 'src'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleNameMapper: {
    '@cmpnts': ['<rootDir>/src/components'],
    '@uicomps': ['<rootDir>/src/components/ui'],
    '@screens': ['<rootDir>/src/pages'],
    '@types': ['<rootDir>/src/utils/types'],
    '@apiClient': ['<rootDir>/src/utils/burger-api.ts'],
    '@slices': ['<rootDir>/src/services/slices'],
    '@hooks': ['<rootDir>/src/hooks'],
    '@store': ['<rootDir>/src/services/store.ts'],
    '@selectors': ['<rootDir>/src/services/selectors']
  }
};

export default config;