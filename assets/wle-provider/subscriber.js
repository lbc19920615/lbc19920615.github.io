import global from "./global.js";
const ProxyTarget = class {};
const Subscriber = new Proxy(ProxyTarget, {
  construct(target, args) {
    if (!args.length || "String" !== global.getVariableType(args[0])) {
      throw new Error(global.EVENT_NAME_TYPE_ERROR);
    }
    const eventName = `${global.EVENT_PREFIX}_${args[0]}`;
    const instance = new target(eventName);
    const handler = {
      get(proxyTarget, property) {
        return (...param) => {
          let returnValue = void 0;
          const detail = {
            data: {
              property,
              param,
            },
            callback(result) {
              returnValue = result;
            },
          };
          const customEvent = new CustomEvent(eventName, { detail });
          window.dispatchEvent(customEvent);
          return returnValue;
        };
      },
    };
    return new Proxy(instance, handler);
  },
});

export default Subscriber;