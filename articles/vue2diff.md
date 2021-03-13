# vue2 diff的学习

## vnode 格式

```js
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  functionalContext: Component | void; // only for functional component root nodes
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions
  ) {
    /*当前节点的标签名*/
    ...
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next https://github.com/answershuto/learnVue*/
  get child (): Component | void {
    return this.componentInstance
  }
}
```

##  diff算法

1. 拿到两棵node树，从根部往叶部遍历
2. 比较oldVnode和newVnode 是否是isSameNode

    2.1 如果是同一节点 就替换
    2.2 如果不是 就要用新的节点去给旧的节点打补丁


## 分析
###  patch

```js
function patch (oldVnode, vnode) {
    // some code
    if (sameVnode(oldVnode, vnode)) {
      // 替换
    	patchVnode(oldVnode, vnode)
    } else {
    	const oEl = oldVnode.el // 当前oldVnode对应的真实元素节点
    	let parentEle = api.parentNode(oEl)  // 父元素
    	createEle(vnode)  // 根据Vnode生成新元素
    	if (parentEle !== null) {
            api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl)) // 将新元素添加进父元素
            api.removeChild(parentEle, oldVnode.el)  // 移除以前的旧元素节点
            oldVnode = null
    	}
    }
    // some code 
    return vnode
}
```

### patchVnode

```js
patchVnode (oldVnode, vnode) {
  // 获取对应的DOM element
    const el = vnode.el = oldVnode.el
    let i, oldCh = oldVnode.children, ch = vnode.children
    if (oldVnode === vnode) return
    // 如果两个节点都有text且不一样 就替换成新节点的text
    if (oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
        api.setTextContent(el, vnode.text)
    }else {
        updateEle(el, vnode, oldVnode)
    	if (oldCh && ch && oldCh !== ch) {
        // 如果两者都有子节点，则执行updateChildren函数比较子节点，这一步很重要
            updateChildren(el, oldCh, ch)
    	}else if (ch){
        // 如果oldVnode没有子节点而Vnode有，则将Vnode的子节点真实化之后添加到el
            createEle(vnode) 
    	}else if (oldCh){
                // 如果oldVnode有子节点而Vnode没有，则删除el的子节点
            api.removeChildren(el)
    	}
    }
}
```

### updateChildren


粉红色的部分为oldCh和vCh

![](/articles/images/w2021-12134151.png)


我们将它们取出来并分别用s和e指针指向它们的头child和尾child

![](/articles/images/w2021-12651516.png)

现在分别对oldS、oldE、S、E两两做sameVnode比较，有四种比较方式，当其中两个能匹配上那么真实dom中的相应节点会移到Vnode相应的位置，这句话有点绕，打个比方

- 如果是oldS和E匹配上了，那么真实dom中的第一个节点会移到最后
- 如果是oldE和S匹配上了，那么真实dom中的最后一个节点会移到最前，匹配上的两个指针向中间移动
- 如果四种匹配没有一对是成功的，分为两种情况
  - 如果新旧子节点都存在key，那么会根据oldChild的key生成一张hash表，用S的key与hash表做匹配，匹配成功就判断S和匹配节点是否为sameNode，如果是，就在真实dom中将成功的节点移到最前面，否则，将S生成对应的节点插入到dom中对应的oldS位置，S指针向中间移动，被匹配old中的节点置为null。
  - 如果没有key,则直接将S生成新的节点插入真实DOM


四步法

1. 旧首 和 新首 对比

```js
if (sameVnode(oldStartVnode, newStartVnode)) { 
      patchVnode(oldStartVnode.elm, oldStartVnode, newStartVnode);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    }
```

2.旧尾 和 新尾 对比

```js
if (sameVnode(oldEndVnode, newEndVnode)) { //旧尾 和 新尾相同
      patchVnode(oldEndVnode.elm, oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    }
```

3. 旧首 和 新尾 对比

```js
if (sameVnode(oldStartVnode, newEndVnode)) { //旧首 和 新尾相同,将旧首移动到 最后面
      patchVnode(oldStartVnode.elm, oldStartVnode, newEndVnode);
      nodeOps.insertBefore(parentElm, oldStartVnode.elm, oldEndVnode.elm.nextSibling)
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    }
```

4. 旧尾 和 新首 对比,将 旧尾 移动到 最前面

```js
if (sameVnode(oldEndVnode, newStartVnode)) {//旧尾 和 新首相同 ,将 旧尾 移动到 最前面
      patchVnode(oldEndVnode.elm, oldEndVnode, newStartVnode);
      nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    }
```

- 首尾对比 都不 符合 sameVnode 的话
- 尝试 用 newCh 的第一项在 oldCh 内寻找 sameVnode,如果在 oldCh 不存在对应的 sameVnode ，则直接创建一个，存在的话则判断
- 符合 sameVnode，则移动 oldCh 对应的 节点
- 不符合 sameVnode ,创建新节点

最后 通过 oldStartIdx > oldEndIdx ，来判断 oldCh 和 newCh 哪一个先遍历完成

1. oldCh 先遍历完成,则证明 newCh 还有多余节点，需要新增这些节点
2. newCh 先遍历完成,则证明 oldCh 还有多余节点，需要删除这些节点
