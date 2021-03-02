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

双向绑定源码在observer文件夹下。流程大致如下：

```js
function Vue (options) {
    // ...
    var data = options.data;
    data = typeof data === 'function' ? data() : data || {};
    observe(data, this);
    Watcher(this, this.render, this._update);
    // ...
}
```

先对 data 进行数据劫持（observe），然后为当前实例创建一个订阅者（Watcher）。

数据劫持

数据劫持的实质就是使用 defineProperty 重写对象属性的 getter/setter 方法。但由于defineProperty 无法监测到对象和数组内部的变化，所以遇到子属性为对象时，会递归观察该属性直至简单数据类型；为数组时的处理是重写push、pop、shift等方法，方法内部通知订阅中心：状态变化了！这样就能对所有类型数据进行监听了。