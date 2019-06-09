const pathScripts = '<rootDir>/src/scripts';
const pathTests = '<rootDir>/tests';

module.exports = {
  verbose: true,
  roots: [pathScripts, pathTests],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', pathScripts],
  setupFilesAfterEnv: [`${pathTests}/setup.js`]
};
