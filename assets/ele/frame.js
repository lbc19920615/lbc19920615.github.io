export function parseRpx(css = '', winWidth = window.innerWidth) {
    let parsedcss = css;

    if (winWidth > 768) {
        parsedcss = css.replace(/(\d+)(?=rpx)rpx/g, function (pxs, ...pxargs) {
            return pxs.replace('rpx', 'px')
        });
    }
    else {
        parsedcss = css.replace(/(\d+)(?=rpx)rpx/g, function (pxs, ...pxargs) {
            let val = pxargs[0]
            return pxs.replace('rpx', 'px').replace(val, val / 750 * winWidth)
        })
    }
    return parsedcss;
}

export async function importCss(url) {
    const cssFile = await fetch(url);
    const css = await cssFile.text();
    // console.log(css);

    let parsedcss = parseRpx(css);
    // console.log(parsedcss);
    const myStyleSheet = new CSSStyleSheet();
    myStyleSheet.replace(parsedcss);
    return {myStyleSheet, parsedcss};
}

export async function importCssStyleSheet(url) {
    let {myStyleSheet} = await importCss(url)
    return myStyleSheet
}