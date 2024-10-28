import { describe, expect, test } from '@jest/globals';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) =>
  path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) =>
  fs.readFileSync(getFixturePath(filename), 'utf-8').trim();

const file1Json1 = getFixturePath('file1.json');
const file2Json = getFixturePath('file2.json');
const file1Yaml = getFixturePath('file1.yaml');
const file2Yaml = getFixturePath('file2.yaml');

const basic = readFile('basic.txt');
const plain = readFile('plain.txt');
const json = readFile('json.txt');

describe('tests for diff generation between two files', () => {
  test.each([
    ['basic', file1Json1, file2Json, basic],
    ['basic', file1Yaml, file2Yaml, basic],
    ['plain', file1Json1, file2Json, plain],
    ['json', file1Json1, file2Json, json],
  ])(
    'genDiff compares file1 and file2 using %s for expected result',
    (formatName, file1, file2, expectedResult) => {
      expect(genDiff(file1, file2, formatName)).toBe(expectedResult);
    }
  );
});
