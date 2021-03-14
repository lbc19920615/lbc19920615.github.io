# Vue3 Composition API

<iframe 
height="265" style="width: 100%;" scrolling="no" 
src="https://stackblitz.com/edit/vue-hvobag?embed=1&file=src/components/calculator.vue"
frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>


## reactive 和 ref

ref 和 reactive 一个针对原始数据类型，而另一个用于对象，这两个API都是为了给JavaScript普通的数据类型赋予响应式特性(reactivity)。根据Vue3官方文档，这两者的主要区别在于每个人写JavaScript时的风格不同，有人喜欢用原始数据类型(primitives)，把变量单独拎出来写；而有人喜欢用对象(Object)，把变量当作对象里的属性，都写在一个对象里头，比如：


## React Hooks vs Vue Composition API

React hook 底层是基于链表实现，调用的条件是每次组件被render的时候都会顺序执行所有的hooks，所以下面的代码会报错

```js
function App(){
  const [name, setName] = useState('demo');
  if(condition){
    const [val, setVal] = useState('');    
  }
}
```

因为底层是链表，每一个hook的next是指向下一个hook的，if会导致顺序不正确，从而导致报错，所以react是不允许这样使用hook的。

vue hook 只会被注册调用一次，vue 能避开这些麻烦的问题，原因在于它对数据的响应是基于proxy的，对数据直接代理观察。这种场景下，只要任何一个更改data的地方，相关的function或者template都会被重新计算，因此避开了react可能遇到的性能上的问题

> react数据更改的时候，会导致重新render，重新render又会重新把hooks重新注册一次，所以react的上手难度更高一些

代码的执行

> Vue 中，“钩子”就是一个生命周期方法

- Vue Composition API 的 setup() 晚于 beforeCreate 钩子，早于 created 钩子被调用
- React hooks 会在组件每次渲染时候运行，而 Vue setup() 只在组件创建时运行一次

由于 React hooks 会多次运行，所以 render 方法必须遵守某些规则，比如:

> 不要在循环内部、条件语句中或嵌套函数里调用 Hooks