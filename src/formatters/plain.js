const plainValue = (value) => {
  switch (true) {
    case value === null:
      return value;
    case typeof value === 'object':
      return '[complex value]';
    case typeof value === 'string':
      return `'${value}'`;
    default:
      return value;
  }
};

const plain = (diffTree, parentKey = '') => {
  const summary = [];
  diffTree.forEach(({ key, value, status }) => {
    const keyNameOriginal = `${parentKey}.${key}`;
    const keyName = keyNameOriginal.startsWith('.')
      ? keyNameOriginal.slice(1)
      : keyNameOriginal;
    switch (status) {
      case 'nested':
        summary.push(plain(value, keyName));
        break;
      case 'added':
        summary.push(
          `Property '${keyName}' was added with value: ${plainValue(value)}`
        );
        break;
      case 'deleted':
        summary.push(`Property '${keyName}' was removed`);
        break;
      case 'changed':
        summary.push(
          `Property '${keyName}' was updated. From ${plainValue(value[0])} to ${plainValue(value[1])}`
        );
        break;
      case 'unchanged':
        break;
      default:
        throw new Error(`Unknown status: '${status}'!`);
    }
  });
  return summary.join('\n');
};

export default plain;
