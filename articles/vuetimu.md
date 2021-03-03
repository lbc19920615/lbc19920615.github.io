# Vue的面试题目

## vdom

vdom是树状结构，其节点为vnode，vnode和浏览器DOM中的Node一一对应，通过vnode的el属性可以访问到对应的Node。
vdom完全是用js去实现，和宿主浏览器没有任何联系。也就是说，页面的更新可以先全部反映在JS对象(虚拟DOM)上，操作内存中的JS对象的速度显然要更快，等更新完成后，再将最终的JS对象映射成真实的DOM，交由浏览器去绘制。
由此可见，虚拟DOM是为了解决浏览器性能问题而被设计出来的。

## vue双向绑定原理

vue数据双向绑定通过‘数据劫持’ + 订阅发布模式实现
vue2.x使用Object.defineProperty();
vue3.x使用Proxy

### 源码解析

```js
function observable(obj) {
    if (!obj || typeof obj !== 'object') {
        return;
    }
    const keys = Object.keys(obj)
    keys.forEach(key => {
        defineReactive(obj, key, obj[key])
    })
}
```

先对 data 进行数据劫持（observe），然后为当前实例创建一个订阅者（Watcher）。

数据劫持

数据劫持的实质就是使用 defineProperty 重写对象属性的 getter/setter 方法。但由于defineProperty 无法监测到对象和数组内部的变化，所以遇到子属性为对象时，会递归观察该属性直至简单数据类型；为数组时的处理是重写push、pop、shift等方法，方法内部通知订阅中心：状态变化了！这样就能对所有类型数据进行监听了。

[0 到 1 掌握：Vue 核心之数据双向绑定](https://juejin.cn/post/6844903903822086151)


## vue的keep-alive

keep-alive 是 Vue 内置的一个组件，可以使被包含的组件保留状态，避免重新渲染 ，其有以下特性：

一般结合路由和动态组件一起使用，用于缓存组件；
提供 include 和 exclude 属性，两者都支持字符串或正则表达式， include 表示只有名称匹配的组件会被缓存，exclude 表示任何名称匹配的组件都不会被缓存 ，其中 exclude 的优先级比 include 高；
对应两个钩子函数 activated 和 deactivated ，当组件被激活时，触发钩子函数 activated，当组件被移除时，触发钩子函数 deactivated。


## Vue 组件间通信有哪几种方式

（1）props / $emit 适用 父子组件通信
（2）ref 与 $parent / $children 适用 父子组件通信
（3）EventBus （$emit / $on） 适用于 父子、隔代、兄弟组件通信
（4）$attrs/$listeners 适用于 隔代组件通信
（5）provide / inject 适用于 隔代组件通信
（6）Vuex 适用于 父子、隔代、兄弟组件通信

## Vue 怎么用 vm.$set() 解决对象新增属性不能响应的问题 

```js
export function set (target: Array<any> | Object, key: any, val: any): any {
  // target 为数组  
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    // 修改数组的长度, 避免索引>数组长度导致splcie()执行有误
    target.length = Math.max(target.length, key)
    // 利用数组的splice变异方法触发响应式  
    target.splice(key, 1, val)
    return val
  }
  // key 已经存在，直接修改属性值  
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  // target 本身就不是响应式数据, 直接赋值
  if (!ob) {
    target[key] = val
    return val
  }
  // 对属性进行响应式处理
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
```

- 如果目标是数组，直接使用数组的 splice 方法触发相应式；

- 如果目标是对象，会先判读属性是否存在、对象是否是响应式，最终如果要对属性进行响应式处理，则是通过调用   defineReactive 方法进行响应式处理（ defineReactive 方法就是  Vue 在初始化对象时，给对象属性采用 Object.defineProperty 动态添加 getter 和 setter 的功能所调用的方法）

## Vue 核心之虚拟DOM


## 参考

[1] (Daily-Interview-Question)(https://github.com/00feng00/diaryBrush)

[2] (Vue 面试题)(https://juejin.cn/post/6844903918753808398#heading-21)

[3] (Vue) (https://github.com/fengshi123/blog)