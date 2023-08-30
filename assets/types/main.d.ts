/**
 *
 * @param {object} descriptor
 * @returns
 */
export function buildValidate(descriptor: object): Schema;
export function setGlobal(v: any): void;
export function Nid(...args: any[]): any;
export function getAllComments(rootElem: any): Node[];
export function getcustomComponents(): Map<any, any>;
/**
 *
 * @param {Function} callback
 * @param {{ele: Element, id: string}} param1
 * @returns
 */
export function createCommonCtx(callback: Function, { ele, insertRoot, id }?: {
    ele: Element;
    id: string;
}): any;
/**
 *
 * @param {object} option
 * @param {object} param1
 * @returns
 */
export function ForEach(option?: object, { label }?: object): {
    getCtx(): any;
    init(callback: any): () => {
        id: string;
        curRoot: any;
        done(parent: any): void;
        reload({ max, list }?: {
            max: any;
            list: any;
        }): void;
        build(innerMax: any, innerList: any): void;
    };
};
export function getConditionMap(): Map<any, any>;
export function If(conditions: any, nid?: string): {
    getCtx(): any;
    init(callback: any): () => {
        id: string;
        curRoot: any;
        done(parent: any): void;
        reload({ max, list }?: {
            max: any;
            list: any;
        }): void;
        build(innerMax: any, innerList: any): void;
    };
};
export function Else(nid?: string): {
    getCtx(): any;
    init(callback: any): () => {
        id: string;
        curRoot: any;
        done(parent: any): void;
        reload({ max, list }?: {
            max: any;
            list: any;
        }): void;
        build(innerMax: any, innerList: any): void;
    };
};
/**
 *
 * @param {string} name
 * @param {any} detail
 */
export function CompEvent(name: string, detail: any): CustomEvent<{
    name: string;
    detail: any;
}>;
/**
 *
 * @param {string} name
 * @param {{attrs: object, props: object}} option
 * @returns {Element}
 */
export function createEle(name: string, option?: {
    attrs: object;
    props: object;
}): Element;
export function hc2(ComponentConstruct: any, { objArg, args, load, init, attrs, props, events, end, afterInit, ready }: {
    objArg?: any;
    args?: any[];
    load?: () => void;
    init?: () => void;
    attrs?: {};
    props?: {};
    events?: {};
    end?: () => void;
    afterInit: any;
    ready: any;
}, ele: any): {
    ele: Element;
};
export function hc(ComponentConstruct: any, { args, init, end, afterInit, ready }: {
    args?: any[];
    init?: () => void;
    end?: () => void;
    afterInit: any;
    ready: any;
}, ele: any): {
    ele: Element;
};
/**
 * 利用proxy 实现h3.Text 这样简单写法
 */
/**
 * 定义Component
 * @param {{setup: Function, ssrRender: Function}} option
 * @returns
 */
export function defComponent(option?: {
    setup: Function;
    ssrRender: Function;
}): (...args: any[]) => {
    init(callback: any, ...initArgs: any[]): () => any;
};
export let events: typeof EventEmitter;
export function getscripts(domRuntime?: Document): void;
export namespace Utils {
    export { _utils_getObjectParam as getObjectParam };
}
export namespace Modifier {
    function setCurEle(ele: any): any;
    function create(handleFun: any): (ele: any) => void;
}
export namespace g {
    export { defc };
}
export const EVENT_NAME: "__on__event__";
export function Button(...args: any[]): {
    init(callback: any, ...initArgs: any[]): () => any;
};
export function Column(...args: any[]): {
    init(callback: any, ...initArgs: any[]): () => any;
};
export function View(...args: any[]): {
    init(callback: any, ...initArgs: any[]): () => any;
};
export function Text(...args: any[]): {
    init(callback: any, ...initArgs: any[]): () => any;
};
export * from "./control";
export class BaseWleElement extends HTMLElement {
    _fireEvent(name: any, detail: any): void;
}
import Schema from 'async-validator';
import EventEmitter from "./event";
declare function _utils_getObjectParam(args?: any[], index?: number): any;
/**
 *
 * @param {*} buildCtx
 * @param {*} runFun
 * @returns {{ele: Element}}
 */
declare function defc(buildCtx: any, runFun: any): {
    ele: Element;
};
