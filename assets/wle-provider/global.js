export default {
    EVENT_PREFIX: "WLEPRE",
    EVENT_NAME_TYPE_ERROR: "The event name must be a non-empty string!",
    INCOMPLETE_DATA: "Incomplete data!",
    LOAD_METHODS_ERROR: "The load method parameter must be an object!",
    methodNotExist(name) {
      return `The ${name} method does not exist!`;
    },
    getVariableType(value) {
      return Object.prototype.toString.call(value).slice(8, -1);
    },
};