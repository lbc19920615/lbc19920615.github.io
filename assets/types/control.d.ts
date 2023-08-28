/**
 *
 * @param {class} target
 * @returns
 */
export function metaCls(target: class): {
    state: {};
    getters: {};
    actions: {};
};
export function injectControl(name?: string): (target: any) => void;
/**
 *
 * @param {string | class} cls
 * @returns
 */
export function useControl(cls: string | class): any;
export class BaseVmControl {
}
