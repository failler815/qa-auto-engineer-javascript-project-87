import basic from './basic.js';
import plain from './plain.js';

export default (diffTree, format = 'basic') => {
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
