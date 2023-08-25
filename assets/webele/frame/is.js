export const objectToString = Object.prototype.toString;
export const toTypeString = (value) =>
  objectToString.call(value);
export const toRawType = (value) =>
  toTypeString(value).slice(8, -1);

  export function isConstructor(f) {
    try {
      new f();
    } catch (err) {
      // verify err is the expected error and then
      return false;
    }
    return true;
  }

export const isArray = Array.isArray;
export const isMap = (val) =>
  toTypeString(val) === '[object Map]';
export const isSet = (val) =>
  toTypeString(val) === '[object Set]';
export const isDate = (val) =>
  toTypeString(val) === '[object Date]';
export const isFunction = (val) =>
  typeof val === 'function';
export const isString = (val) =>
  typeof val === 'string';
export const isSymbol = (val) =>
  typeof val === 'symbol';
export const isObject = (val) =>
  val !== null && typeof val === 'object';
export const isPromise = (val) =>
  isObject(val) && isFunction(val.then) && isFunction(val.catch);

export const isPlainObject = (val) =>
  toTypeString(val) === '[object Object]';
export const isIntegerKey = (key) =>
  isString(key) &&
  key !== 'NaN' &&
  key[0] !== '-' &&
  `${parseInt(key, 10)}` === key;
