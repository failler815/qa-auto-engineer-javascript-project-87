import _ from 'lodash';

const plainValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (Number.isNaN(Number(value)) || value === '') {
    return `'${value}'`;
  }
  return value;
};

const plain = (diffTree, parentKey = '') => {
  const result = diffTree
    .filter(({ status }) => status !== 'unchanged')
    .map(({
      key, value, status, oldValue, newValue, children,
    }) => {
      const newProperty = _.trim(`${parentKey}.${key}`, '.');
      switch (status) {
        case 'changed':
          return `Property '${newProperty}' was updated. From ${plainValue(oldValue)} to ${plainValue(newValue)}`;
        case 'added':
          return `Property '${newProperty}' was added with value: ${plainValue(value)}`;
        case 'deleted':
          return `Property '${newProperty}' was removed`;
        case 'nested':
          return plain(children, newProperty);
        default:
          throw new Error(`Unknown node status ${status}`);
      }
    });
  return result.join('\n');
};

export default plain;
