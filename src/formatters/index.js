import { makeAstTree } from '../index.js';
import basic from './basic.js';
import plain from './plain.js';

const genearateDiff = (
  firstConfig = {},
  secondConfig = {},
  format = 'basic'
) => {
  const diffTree = makeAstTree(firstConfig, secondConfig);
  switch (format) {
    case 'plain':
      return plain(diffTree);
    case 'basic':
      return basic(diffTree);
    case 'json':
      return JSON.stringify(diffTree, '', 1);
    default:
      throw new Error(`Unknown format: '${format}'!`);
  }
};

export default genearateDiff;
