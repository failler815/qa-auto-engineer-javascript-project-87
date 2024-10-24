import { expect, test } from '@jest/globals';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import genearateDiff from '../src/formatters/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const getFixturePath = (filename) =>
  join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename));

const file1Json = yaml.load(readFile('file1.json'));
const file2Json = yaml.load(readFile('file2.json'));

const file1Yaml = yaml.load(readFile('file1.yml'));
const file2Yaml = yaml.load(readFile('file2.yml'));

const basic = readFile('gendiff.txt').toString();
const plain = readFile('plain.txt').toString();
const json = readFile('json.txt').toString();

test('Дефолтное сравнение двух файлов json', () => {
  expect(genearateDiff(file1Json, file2Json)).toBe(basic);
});

test('Дефолтное сравнение двух файлов yaml', () => {
  expect(genearateDiff(file1Yaml, file2Yaml)).toBe(basic);
});

test('plain сравнение двух файлов json', () => {
  expect(genearateDiff(file1Json, file2Json, 'plain')).toBe(plain);
});

test('plain сравнение двух файлов yaml', () => {
  expect(genearateDiff(file1Yaml, file2Yaml, 'plain')).toBe(plain);
});

test('json сравнение двух файлов json', () => {
  expect(genearateDiff(file1Json, file2Json, 'json')).toBe(json);
});

test('json сравнение двух файлов yaml', () => {
  expect(genearateDiff(file1Yaml, file2Yaml, 'json')).toBe(json);
});
