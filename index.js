import _ from 'lodash';
import path from 'path';
import { cwd } from 'node:process';

const genDiff = (data1, data2) => {
  const keys = _.union(_.keys(data1), _.keys(data2));
  const sortKeys = keys.sort();
  let result = '{\n';
  sortKeys.forEach((key) => {
    if (!Object.hasOwn(data1, key)) {
      result += `  + ${key}: ${data2[key]}\n`;
    } else if (!Object.hasOwn(data2, key)) {
      result += `  - ${key}: ${data1[key]}\n`;
    } else if (data1[key] !== data2[key]) {
      result += `  - ${key}: ${data1[key]}\n`;
      result += `  + ${key}: ${data2[key]}\n`;
    } else {
      result += `    ${key}: ${data1[key]}\n`;
    }
  });
  result += '}';
  return result;
};

const findFile = (pathToFile, directory) =>
  path.resolve(cwd(), directory, pathToFile);

export { genDiff, findFile };
