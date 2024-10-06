module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // o 'jsdom', dependiendo de tu caso
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transforma archivos .ts y .tsx usando ts-jest
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/'],
};
