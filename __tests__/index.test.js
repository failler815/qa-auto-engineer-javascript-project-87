import { expect, test } from '@jest/globals';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import { genDiff } from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) =>
  path.resolve(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename));

test('сравнение json файлов', () => {
  const txt = readFile('gendiff.txt').toString();
  const json1 = JSON.parse(readFile('file1.json'));
  const json2 = JSON.parse(readFile('file2.json'));
  console.log(getFixturePath('file1.json'));
  expect(genDiff(json1, json2)).toBe(txt);
});
test('сравнение yaml файлов', () => {
  const txt = readFile('gendiff.txt').toString();
  const yaml1 = yaml.load(readFile('file1.yml'));
  const yaml2 = yaml.load(readFile('file2.yml'));
  // console.log(yaml1, yaml2, txt);
  expect(genDiff(yaml1, yaml2)).toBe(txt);
});
