/**
 * 
 * @param {object} object 
 * @param {string} path 
 * @param {any} value 
 * @returns 
 */
export function getObj (object, path, value) {
    const pathArray = Array.isArray(path) ? path : path.split('.').filter(key => key)
    const pathArrayFlat = pathArray.flatMap(part => typeof part === 'string' ? part.split('.') : part)

    return pathArrayFlat.reduce((obj, key) => obj && obj[key], object) || value
}

/**
 * @param ob Object                 The object to flatten
 * @param prefix String (Optional)  The prefix to add before each key, also used for recursion
 **/
export function flattenObject(ob, prefix = false, result = null) {
    result = result || {};
  
    // Preserve empty objects and arrays, they are lost otherwise
    if (prefix && typeof ob === 'object' && ob !== null && Object.keys(ob).length === 0) {
      result[prefix] = Array.isArray(ob) ? [] : {};
      return result;
    }
  
    prefix = prefix ? prefix + '.' : '';
  
    for (const i in ob) {
      if (Object.prototype.hasOwnProperty.call(ob, i)) {
        // Only recurse on true objects and arrays, ignore custom classes like dates
        if (typeof ob[i] === 'object' && (Array.isArray(ob[i]) || Object.prototype.toString.call(ob[i]) === '[object Object]') && ob[i] !== null) {
          // Recursion on deeper objects
          flattenObject(ob[i], prefix + i, result);
        } else {
          result[prefix + i] = ob[i];
        }
      }
    }
    return result;
  }