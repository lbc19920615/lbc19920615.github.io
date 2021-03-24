export declare type markPointSymbol = 'circle' | 'rect' | 'roundRect' | 'triangle' | 'diamond' | 'pin' | 'arrow' | 'none';
export declare type symbolSizeCallback = (value: Array<number> | number, params: Object) => number | Array<number>;
export declare type markPoint = {
    symbol?: markPointSymbol;
    symbolSize?: number | Array<number> | symbolSizeCallback;
};
export default function (): void;
//# sourceMappingURL=echarts.d.ts.map