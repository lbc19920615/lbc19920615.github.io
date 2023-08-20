import { Nid } from "wle";

export let routerModule = (function ({routes, rooterRootEle, pageBeforeRender, keepLives = [] } = {}) {
    let pageMap = new Map();

    let firstBuild = true;
    let pagesCache = [];

    function render(rootEle, reloadStr) {
        // rooterRootEle.innerHTML = ''
        let { tureRoot } = pageBeforeRender(rooterRootEle, firstBuild)
        tureRoot.innerHTML = '';
        console.log('reloadFormCache', reloadStr);
        tureRoot.appendChild(rootEle);
    }

    function createPageFun(nid = '', params, {routerName} = {}) {
        return function Page(option) {
            let { ele, lifeTimes = {} } = option

            function reRender(innerEle, reloadFormCache) {
                render(innerEle, reloadFormCache)
            }

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
                lifeTimes.onCreated(pageVm, {app})
            }

            // console.log(app);
            if (app.isLoaded) {
                if (lifeTimes?.onReady) {
                    lifeTimes.onReady({appConfig: app.globalConfig})
                }
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
        let stateID = Nid()
        window.history.pushState({
            path,
            stateID
        }, "", "#/" + path);
        handleLocation( {
            params,
            stateID,
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

    const handleLocation = async ({params = {}, stateID, onLoadCache} = {}) => {
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

        const m = await route(params);

        let nid = stateID ?? Nid()

        if (keepLives.includes(nid) && pageMap.get(nid)) {
            let cached = pageMap.get(nid)
            cached.reload(params);
            if (onLoadCache) {
                onLoadCache( [nid, cached])
            }
            // return [nid, cached]
        } else {

            let Page = createPageFun(nid, params, {
                routerName
            })
            if (m.default) {
                m.default({ Page })
            }
        }

        
        firstBuild = false

    };

    function unLoadLastPage(lastPage) {
        if (lastPage?.lifeTimes?.onUnload) {
            lastPage.lifeTimes.onUnload()
        }
        removeLastPage();
    }

    function __detect_page(state) {
        let pages = getCurrentPages();
        if (pages.length > 1) {
            let lastPage = pages.at(-1);
            let prevPage = pages.at(-2);
            if (prevPage.nid === state?.stateID || state == null){
                unLoadLastPage(lastPage)
                prevPage?.reloadFormCache();
            }
        }
        else if (pages.length > 0) {
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
        back: backRoute
    };

    handleLocation({
        stateID: Nid()
    });
    
});
