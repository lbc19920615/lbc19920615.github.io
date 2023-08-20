import global from "./global.js";
export default class Provider {
  constructor(eventName) {
    if (!eventName || "String" !== global.getVariableType(eventName)) {
      throw new Error(global.EVENT_NAME_TYPE_ERROR);
    }
    this.eventName = `${global.EVENT_PREFIX}_${eventName}`;
    this.methods = void 0;
    this.handle = ({ detail }) => {
      const { data } = detail;
      if (
        !(detail?.callback && data?.property && "param" in data && this.methods)
      ) {
        throw new Error(global.INCOMPLETE_DATA);
      }
      if ("function" !== typeof this.methods?.[data.property]) {
        throw new Error(global.methodNotExist(data.property));
      }
      detail.callback(this.methods[data.property](...data.param));
    };
  }
  load(methods) {
    if (!methods || "Object" !== global.getVariableType(methods)) {
      throw new Error(global.LOAD_METHODS_ERROR);
    }
    this.methods = methods;
    window.addEventListener(this.eventName, this.handle);
  }
  destroy() {
    window.removeEventListener(this.eventName, this.handle);
  }
}