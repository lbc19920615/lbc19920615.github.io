const showAuthorPlugin = {
  // 插件名称
  name: 'showAuthorPlugin',
  // 扩展核心功能
  extend(api) {
    api.processMarkdown(text => {
       return text.replace(/{author}/g, '> Written by lbc')
    })
  }
};

(function() {

  let TocItems  = []

  function last(items) {
    return items[items.length - 1]
  }

  function addTocItem(text, level, id) {
    let items = TocItems
    const item = { text, level, id };
    if (items.length === 0) { // 第一个 item 直接 push
      items.push(item);
    } else {
      let lastItem = last(items); // 最后一个 item

      if (item.level > lastItem.level) { // item 是 lastItem 的 children
        for (let i = lastItem.level + 1; i <= 6; i++) {
          const { children } = lastItem;
          if (!children) { // 如果 children 不存在
            lastItem.children = [item];
            break;
          }

          lastItem = last(children); // 重置 lastItem 为 children 的最后一个 item

          if (item.level <= lastItem.level) { // item level 小于或等于 lastItem level 都视为与 children 同级
            children.push(item);
            break;
          }
        }
      } else { // 置于最顶级
        items.push(item);
      }
    }
  }

  window.TocManager = {
    addTocItem: addTocItem,
    get: function() {
      return TocItems
    },
    reset: function() {
      TocItems = []
    }
  }

})();

(function() {
  window.extCurPagePlugin = {
    // 插件名称
    name: 'extCurPagePlugin',
    // 扩展核心功能
    extend(api) {
      window.curPageInfo = {
        toc: [],
        router: api.router
      }
      api.processMarkdown(text => {
        window.TocManager.reset()
        // text
        const tokens = marked.lexer(text);
        tokens.forEach(element => {
          if (element.type === "heading") {
            window.TocManager.addTocItem(element.text, element.depth, element.text)
          }
        });
        window.curPageInfo.toc = window.TocManager.get()
      })
    }
  }
})();

(function() {
  window.appSearchsPlugin = {
    extend(api) {
      api.registerComponent("header-right:start", AppSearchComponent)
    }
  }
})();