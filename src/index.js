import _ from 'lodash';
import path from 'path';
import { cwd } from 'node:process';
import fs from 'fs';
import render from './formatters/index.js';
import getParseFile from './parsers.js';

const makeAstTree = (firstConfig, secondConfig) => {
  const fileKeys = _.union(_.keys(firstConfig), _.keys(secondConfig)).sort();
  const result = fileKeys.map((key) => {
    const oldValue = firstConfig[key];
    const newValue = secondConfig[key];
    if (!_.has(secondConfig, key)) {
      return { key, status: 'deleted', value: oldValue };
    }
    if (!_.has(firstConfig, key)) {
      return { key, status: 'added', value: newValue };
    }
    if (oldValue === newValue) {
      return { key, status: 'unchanged', value: oldValue };
    }
    if (_.isObject(oldValue) && _.isObject(newValue)) {
      return {
        key,
        status: 'nested',
        children: makeAstTree(oldValue, newValue),
      };
    }
    const modifiedNode = {
      key,
      status: 'changed',
      oldValue,
      newValue,
    };
    return modifiedNode;
  });
  return result;
};

const makeFileData = (pathToFile, directory) => {
  const data = fs.readFileSync(path.resolve(cwd(), directory, pathToFile));
  const format = _.trim(path.extname(pathToFile), '.');

  return { data, format };
};

const genDiff = (pathToFile1, pathToFile2, format) => {
  const firstConfig = makeFileData(pathToFile1, '__fixtures__');
  const secondConfig = makeFileData(pathToFile2, '__fixtures__');

  const parseBefore = getParseFile(firstConfig.format, firstConfig.data);
  const parsesecondConfig = getParseFile(
    secondConfig.format,
    secondConfig.data
  );

  const diffTree = makeAstTree(parseBefore, parsesecondConfig);
  const result = render(diffTree, format);

  return result;
};

export default genDiff;
