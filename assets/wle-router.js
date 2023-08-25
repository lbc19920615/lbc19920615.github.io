import Nid from "./nid.browser.js";


export function createStyleSheet(name) {
    let style = document.createElement('style');
    style.id = 'style-' + name;

    window.importCss(`/assets/webele/${name ? name : 'main'}.css?v=` + Date.now()).then(({parsedcss}) => {
        // console.log('parsedcss', parsedcss);
        style.innerHTML = parsedcss;
        document.head.appendChild(style)
    })
    // fetch(`/assets/webele/${name ? name : 'main'}.css?v=` + Date.now()).then(res => res.text()).then((cssStr) => {
    //     style.innerHTML = cssStr;
    //     document.head.appendChild(style)
    // })
}

window.createPageStyleSheet = createStyleSheet;


export let routerModule = (function ({ routes, rooterRootEle, pageBeforeRender, keepLives = [] } = {}) {
    let pageMap = new Map();


    let firstBuild = true;
    let pagesCache = [];

    let unloadIds = [];

    function render(rootEle, reloadStr) {
        // console.log(rootEle);
        // rooterRootEle.innerHTML = ''
        let { tureRoot } = pageBeforeRender(rooterRootEle, firstBuild)
        tureRoot.innerHTML = '';
        // console.log('reloadFormCache', reloadStr);
        tureRoot.appendChild(rootEle);
    }

    /**
     * 
     * @param {string} path 
     * @param {string} src 
     */
    window.createNewPageFrame = function (path, src) {
        let iframe = document.createElement('iframe');
        iframe.setAttribute('style', 'z-index:' + pagesCache.length )
        iframe.src = src;
        iframe.onload = function() {
            iframe.contentWindow.postMessage({
                type: '__page-params',
                data: {
                    s: 1
                }
            }, src)
            let stateID = src;
            pagesCache.push([stateID, {
                nid: stateID,
                // reloadFormCache() {
                //     console.log('1111111111111111');
                // },
                unloadIframe() {
                    // console.log('1111111111111111');
                    iframe.style.display = 'none';
                    iframe.remove()
                },
                pageReShow() {
                    console.log('pageReShow', path);
                }
            }]);
            window.history.pushState({
                path,
                stateID
            }, "", "#/" + path);
        }
        iframe.classList.add('a-page-frame');
        document.body.appendChild(iframe);
    }


    function createPageFun(nid = '', params, {
        reRender = function (innerEle, reloadFormCache) {
            render(innerEle, reloadFormCache)
        }, 
        routerName, 
        onEnd } = {}) {
        return function Page(option) {
            let { ele, lifeTimes = {} } = option;

            let pageCtx = {
                nid,
                ele,
                routerName,
                lifeTimes,
                params: {},
                reload(params) {
                    pageCtx.params = params
                    reRender(ele)
                },
                reloadFormCache() {
                    // console.log('reloadFormCache');
                    reRender(ele, 'reloadFormCache')
                }
            }

            pageCtx.params = params;
            reRender(ele);

            let pageVm = {
                $getParams() {
                    return pageCtx.params
                }
            }

            let app = window.getApp();

            if (lifeTimes?.onCreated) {
                lifeTimes.onCreated(pageVm, { app })
            }


            pageMap.set(nid, pageCtx);

            if (onEnd) {
                onEnd(pageCtx)
            }
        }
    }


    function getCurrentPages() {
        return [...pagesCache.map(item => item[1])]
    }

    function setCurrentPage(index, v) {
        return pagesCache[index] = v
    }


    function removeLastPage() {
        // let keys = [...pageMap.keys()]
        // removePage(keys.at(-1))
        let lastPage = pagesCache.at(-1)
        removePage(lastPage[0])
        pagesCache.splice(pagesCache.length - 1, 1)
    }

    function removePage(key) {
        unloadIds.push(key)
        pageMap.delete(key)
    }

    window.getCurrentPages = getCurrentPages;

    const pushRoute = (path = '', params = {}, isPush = true, { onEnd } = {}) => {
        // event = event || window.event;
        // event.preventDefault();
        let keys = [...pagesCache.map(v => v[0])];
        // console.log(keys.at(-1));
        if (keys.at(-1) === path) {
            return
        }
        let stateID = Nid()
        window.history.pushState({
            path,
            stateID
        }, "", "#/" + path);
        handleLocation({
            params,
            stateID,
            onLoadCache(ret) {
                if (Array.isArray(ret) && ret.length == 2) {
                    pagesCache.push(ret)
                }
            },
            isPush,
            onEnd
        })
    };

    const switchTab = (path = '', params = {}) => {
        pushRoute(path, params, false, {
            onEnd(pageCtx, nid) {
                // console.log('onEnd', pageCtx);
                let pages = window.getCurrentPages();
                if (pages[0]) {
                    unBindPage(pages[0])
                }
                setCurrentPage(pages.length - 1, [nid, pageCtx])
            }
        })
    }

    const replaceRoute = (path = '', params = {}) => {
        // event = event || window.event;
        // event.preventDefault();
        // let keys = [...pagesCache.map(v => v[0])];
        // console.log(keys.at(-1));
        let stateID = Nid()
        window.history.replaceState({
            path,
            stateID
        }, "", "#/" + path);
        handleLocation({
            params,
            stateID,
            onLoadCache(ret) {
                pagesCache[index] = ret
            },
            isPush: false
        })
    };

    const backRoute = () => {
        history.back()
    }

    function routeName(str = location.hash) {
        let baseLen = '#/'
        const pathName = str.slice(baseLen.length);
        return pathName
    }


    async function loadPage({ nid, routerName, params = {}, onEnd } = {}) {
        let route = routes[routerName];
        if (!route) {
            route = routes['404'];
        }

        const m = await route(params);

        let Page = createPageFun(nid, params, {
            routerName,
            onEnd(pageCtx) {
                if (onEnd) {
                    onEnd(pageCtx, nid)
                }
            }
        });
        if (m.default) {
            m.default({ Page })
        }
    }

    async function loadSubPage({ nid, routerName, reRender, params = {}, onEnd } = {}) {
        let route = routes[routerName];
        if (!route) {
            route = routes['404'];
        }

        const m = await route(params);

        let Page = createPageFun(nid, params, {
            routerName,
            reRender,
            onEnd(pageCtx) {
                if (onEnd) {
                    onEnd(pageCtx, nid)
                }
            }
        });
        if (m.default) {
            m.default({ Page })
        }
    }

    const handleLocation = async ({ params = {}, stateID, onLoadCache, onEnd, isPush = true } = {}) => {
        const path = window.location.hash;

        let baseLen = '#/'
        const pathName = path.slice(baseLen.length)

        let routerName = pathName ?? '';

        let route = routes[routerName];
        if (!route) {
            route = routes['404'];
            routerName = '404'
        }

        // console.log(routerName, route);

        if (!document.querySelector('#style-' + routerName)) {
            createStyleSheet(routerName)
        }

        const m = await route(params);

        let nid = stateID ?? Nid()

        if (keepLives.includes(nid) && pageMap.get(nid)) {
            let cached = pageMap.get(nid)
            cached.reload(params);
            if (onLoadCache) {
                onLoadCache([nid, cached])
            }
            // return [nid, cached]
        } else {

            // console.log('ssssssssssssssssssssss');
            let Page = createPageFun(nid, params, {
                routerName,
                onEnd(pageCtx) {
                    if (isPush) {
                        pagesCache.push([nid, pageCtx])
                    }
                    if (onEnd) {
                        onEnd(pageCtx, nid)
                    }
                }
            });
            if (m.default) {
                m.default({ Page })
            }


        }


        firstBuild = false

    };

    function unBindPage(lastPage) {
        // console.log('lastPage', lastPage);
        if (lastPage?.lifeTimes?.onUnload) {
            lastPage.lifeTimes.onUnload()
        }
        if (lastPage?.unloadIframe) {
            lastPage.unloadIframe()
        }
    }


    function unLoadLastPage(lastPage) {
        unBindPage(lastPage)
        removeLastPage();
    }

    function __detect_page(state) {
        let pages = getCurrentPages();
        if (pages.length > 1) {
            let lastPage = pages.at(-1);
            let prevPage = pages.at(-2);

            if (state?.stateID) {
                // let cachedIndex = pages.findIndex(page => page.nid === state?.stateID);
                if (unloadIds.includes(state.stateID)) {
                    // console.log('page is unload', unloadIds, state);
                    return
                }
            }
            if (prevPage.nid === state?.stateID || state == null) {
                if (prevPage?.reloadFormCache) {
                    prevPage.reloadFormCache();
                }
                if (prevPage?.pageReShow) {
                    prevPage.pageReShow();
                }
            }
            unLoadLastPage(lastPage);
            // console.log('sssssssssssssssssssss');
            document.dispatchEvent(new CustomEvent('route-change', {
                detail: {

                }
            }))
        }
        else if (pages.length > 0) {

            if (!state) {

            }
            else {
                let nid = state.stateID ?? Nid();
                // console.log(pagesCache[0]);
                if (pagesCache[0]) {
                    unBindPage(pagesCache[0][1])
                }
                loadPage({
                    nid: nid,
                    routerName: state.path,
                    onEnd(pageCtx) {
                        pagesCache[0] = [nid, pageCtx];
                        document.dispatchEvent(new CustomEvent('route-change', {
                            detail: {

                            }
                        }))
                    }
                })
            }
        }


    }

    window.onpopstate = async function (e) {

        let state = e.state;
        console.log('onpopstate', state);
        if (!state) {
            __detect_page();
            return
        }
        else {
            __detect_page(state)
        }

    };

    window.wRoute = {
        push: pushRoute,
        switchTab: switchTab,
        back: backRoute,
        replace: replaceRoute,
        loadSubPage: loadSubPage,
        routeName: routeName,
    };

    handleLocation({
        stateID: Nid()
    });

});
