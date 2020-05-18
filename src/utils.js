function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

const isArray = Array.isArray;

function isPlainObject(obj) {
  return isObject(obj) && (obj.constructor === Object || obj.constructor === undefined);
}

export const deepMerge = function(target, ...sources) {
  if (!sources.length) return target;

  const source = sources.shift();

  if (isPlainObject(source) || isArray(source)) {
    for (const key in source) {
      if (isPlainObject(source[key]) || isArray(source[key])) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
          target[key] = {};
        } else if (isArray(source[key]) && !isArray(target[key])) {
          target[key] = [];
        }

        deepMerge(target[key], source[key]);
      } else if (source[key] !== undefined && source[key] !== '') {
        target[key] = source[key];
      }
    }
  }

  return deepMerge(target, ...sources);
}
