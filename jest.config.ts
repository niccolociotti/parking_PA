import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  // Usa ts-jest per gestire i file .ts
  preset: 'ts-jest',
  // Ambiente di test lato server
  testEnvironment: 'node',

  // Dove cercare i test e il codice da coprire
  roots: ['<rootDir>/src'],

  // Pattern per individuare i file di test
  testMatch: [
    '**/__tests__/**/*.+(ts|js)',
    '**/?(*.)+(spec|test).+(ts|js)'
  ],

  // Estensioni dei moduli da considerare
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Pulisci i mock tra ogni test
  clearMocks: true,

  // Genera report di coverage
  collectCoverage: true,
  coverageDirectory: 'coverage',
};
export default config;