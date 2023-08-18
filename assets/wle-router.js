export let routerModule = (function ({routes, rooterRootEle, pageBeforeRender, keepLives = [] } = {}) {
    let pageMap = new Map();

    let pagesCache = [];

    function render(rootEle) {
        rooterRootEle.innerHTML = ''
        let { tureRoot } = pageBeforeRender(rooterRootEle)
        tureRoot.appendChild(rootEle)
    }

    function createPageFun(nid = '', params) {
        return function Page(option) {
            let { ele, lifeTimes = {} } = option

            function reRender(innerEle) {
                render(innerEle)
            }

            let pageCtx = {
                nid,
                ele,
                lifeTimes,
                params: {},
                reload(params) {
                    pageCtx.params = params
                    reRender(ele)
                },
                reloadFormCache() {
                    reRender(ele)
                }
            }

            pageCtx.params = params;
            reRender(ele);

            let pageVm = {
                $getParams() {
                    return pageCtx.params
                }
            }

            if (lifeTimes.onLoad) {
                lifeTimes.onLoad(pageVm)
            }



            pageMap.set(nid, pageCtx);
            pagesCache.push([nid, pageCtx])
        }
    }


    function getCurrentPages() {
        return [...pagesCache.map(item => item[1])]
    }

    function removeLastPage() {
        // let keys = [...pageMap.keys()]
        // removePage(keys.at(-1))
        let lastPage = pagesCache.at(-1)
        removePage(lastPage[0])
        pagesCache.splice(pagesCache.length - 1, 1)
    }

    function removePage(key) {
        pageMap.delete(key)
    }

    window.getCurrentPages = getCurrentPages;

    const pushRoute = (path = '', params = {}) => {
        // event = event || window.event;
        // event.preventDefault();
        let keys = [...pagesCache.map(v => v[0])];
        // console.log(keys.at(-1));
        if (keys.at(-1) === path) {
            return
        }
        window.history.pushState({}, "", "#/" + path);
        handleLocation(params, {
            onLoadCache(ret) {        
                if (Array.isArray(ret) && ret.length == 2) {
                    pagesCache.push(ret)
                }
            }
        })
    };

    const backRoute = () => {
        history.back()
    }

    const handleLocation = async (params = {}, {onLoadCache} = {}) => {
        const path = window.location.hash;

        let baseLen = '#/'
        const pathName = path.slice(baseLen.length)

        let routerName = pathName ? pathName : '404'
        // console.log(routerName);
        
        const route = routes[routerName] ?? routes['404'];

        const m = await route(params);

        let nid = routerName ?? Nid()

        if (keepLives.includes(nid) && pageMap.get(nid)) {
            let cached = pageMap.get(nid)
            cached.reload(params);
            if (onLoadCache) {
                onLoadCache( [nid, cached])
            }
            // return [nid, cached]
        } else {

            let Page = createPageFun(nid, params)
            if (m.default) {
                m.default({ Page })
            }
        }


    };

    window.onpopstate = async function () {
        let pages = getCurrentPages();
        let lastPage = pages.at(-1);
        if (lastPage?.lifeTimes?.onUnload) {
            lastPage.lifeTimes.onUnload()
        }
        removeLastPage();
        // window.history.popState()
        console.log(lastPage);
        let prevPage = getCurrentPages().at(-1);
        prevPage.reloadFormCache();
        // await handleLocation()
    };

    window.wRoute = {
        push: pushRoute,
        back: backRoute
    };

    handleLocation();
});
