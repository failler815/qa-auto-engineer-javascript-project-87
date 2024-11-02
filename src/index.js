import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import render from './formatters/index.js';
import getParseFile from './parsers.js';

const makeAstTree = (beforeConfig, afterConfig) => {
  const fileKeys = _.sortBy(_.union(_.keys(beforeConfig), _.keys(afterConfig)));
  const result = fileKeys.map((key) => {
    const oldValue = beforeConfig[key];
    const newValue = afterConfig[key];
    if (!_.has(afterConfig, key)) {
      return { key, status: 'deleted', value: oldValue };
    }
    if (!_.has(beforeConfig, key)) {
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const makeFileData = (pathToFile) => {
  const absolutePath = path.resolve(
    __dirname,
    '..',
    '__fixtures__',
    pathToFile
  );
  const data = fs.readFileSync(absolutePath, 'utf-8');
  const format = _.trim(path.extname(pathToFile), '.');

  return { data, format };
};

const genDiff = (pathToFile1, pathToFile2, format) => {
  const beforeConfig = makeFileData(pathToFile1);
  const afterConfig = makeFileData(pathToFile2);

  const parseBefore = getParseFile(beforeConfig.format, beforeConfig.data);
  const parseAfter = getParseFile(afterConfig.format, afterConfig.data);

  const diffTree = makeAstTree(parseBefore, parseAfter);
  const result = render(diffTree, format);

  return result;
};

export default genDiff;
