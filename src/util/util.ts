const _toString = Object.prototype.toString;
const hasOwnProperty = Object.prototype.hasOwnProperty;

const _completeValue = (value: any) => {
  return value > 9 ? value : '0' + value;
};

export function isFn(fn: any) {
  return typeof fn === 'function';
}

export function isNum(num: any) {
  return typeof num === 'number';
}

export function isStr(str: string) {
  return typeof str === 'string';
}

export function isObject(obj: any) {
  return obj !== null && typeof obj === 'object';
}

export function isArray(obj: any) {
  return _toString.call(obj) === '[object Array]';
}

export function isPlainObject(obj: Object) {
  return _toString.call(obj) === '[object Object]';
}

export const isTextNode = (child: any): boolean => {
  return typeof child === 'object' && child.hasOwnProperty('tag') && child.hasOwnProperty('props') && child.hasOwnProperty('children') ? false : true;
};

export const isSameText = (oldText: any, newText: any): boolean => {
  if (isArray(oldText) && isArray(newText)) {
    return oldText.flat().join('') === newText.flat().join('');
  }
  return oldText === newText || (isNum(oldText) && isNum(newText) && isNaN(oldText) && isNaN(newText));
};

export function hasOwn(obj: Object, key: string) {
  return hasOwnProperty.call(obj, key);
}

export function setProperties(item: Object, props: any[], propsData: Object) {
  props.forEach(function (name) {
    if (hasOwn(propsData, name)) {
      item[name] = propsData[name];
    }
  });
}

export function getLen(str = '') {
  /* eslint-disable no-control-regex */
  return ('' + str).replace(/[^\x00-\xff]/g, '**').length;
}

export function formatDateTime({ date = new Date(), mode = 'date' }) {
  if (mode === 'time') {
    return _completeValue(date.getHours()) + ':' + _completeValue(date.getMinutes());
  } else {
    return date.getFullYear() + '-' + _completeValue(date.getMonth() + 1) + '-' + _completeValue(date.getDate());
  }
}

export function guid() {
  return Math.floor(4294967296 * (1 + Math.random()))
    .toString(16)
    .slice(1);
}

export const parserUrl = (route: string): { route: string; query: Object } => {
  const queryIndex = route.indexOf('?');
  const query = {};
  if (queryIndex === -1) {
    return { route, query };
  }
  const queryString = route.slice(queryIndex + 1, route.length);
  if (queryString) {
    const data = queryString.split('&');
    if (data.length) {
      data.forEach((item) => {
        const queryItem = item.split('=');
        query[queryItem[0]] = queryItem[1];
      });
    }
  }
  return { query, route: route.slice(0, queryIndex) };
};

export const getHashPath = (url: string) => {
  const hash = url.split('#');
  return hash.length > 1 ? hash[1] : '';
};
