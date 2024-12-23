const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['node_modules', 'loaders'],
  coverageProvider: 'v8',
  verbose: true
};

export default config;
