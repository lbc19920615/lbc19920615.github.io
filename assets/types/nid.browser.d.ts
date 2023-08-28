export default Nid;
declare function Nid(spec: any): string | {
    (): string;
    curses(): any;
    len: any;
    alphabet: any;
};
declare namespace Nid {
    export function curses(): any;
    import len = defaults.len;
    export { len };
    import alphabet = defaults.alphabet;
    export { alphabet };
}
declare namespace defaults {
    let len_1: number;
    export { len_1 as len };
    let alphabet_1: string;
    export { alphabet_1 as alphabet };
}
