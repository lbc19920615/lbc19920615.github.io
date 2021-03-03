# 前端面试题总结

<TocTree></TocTree>

## JS 部分

### JS 基本数据类型

1. Number
2. String
3. Null
4. Undefined
5. Symbol
6. BigInt

### JS 基本引用数据类型

1. Object
2. Array
3. Function

### 如何判断 js 数据类型

1. typeof
2. instanceof
3. Object.prototype.toString()

### 原型和原型链

avaScript 只有一种结构：对象。每个实例对象（ object ）都有一个私有属性（称之为 proto ）指向它的构造函数的原型对象（prototype ）（只有函数对象才有 prototype）。该原型对象也有一个自己的原型对象( proto ) ，层层向上直到一个对象的原型对象为 null。根据定义，null 没有原型，并作为这个原型链中的最后一个环节。（即 Object.prototype.**proto** = null）;

### 什么是闭包

那什么是闭包呢，一言以蔽之：一个持有外部环境变量的函数就是闭包。

```js
let a = 1
let b = function () {
  console.log(a)
}
```

在这个例子里函数 b 因为捕获了外部作用域（环境）中的变量 a，因此形成了闭包。 而由于变量 a 并不属于函数 b，所以在概念里被称之为「自由变量」。

为了更直观的描述「捕获」这个过程，再用 PHP 来个栗子：

```php
function getMoney() {
  $rmb = 1;
  $func = function() use ( $rmb ) {
    echo $rmb;
  };
  $func();
}
```

### JS ES5 函数继承

```js
function Person(name, age) {
  this.name = name
  this.age = age
}

Person.prototype.setAge = function (v) {
  this.age = v
}

function Student(name, age, school) {
  Person.call(this, name, age)
  this.school = school
}

Student.prototype = Object.create(Person.prototype)
Student.prototype.constructor = Student

let s1 = new Student('hal', 12, 'school')

console.log(s1 instanceof Student, s1 instanceof Person) // true true
console.log(s1.constructor) //Student
console.log(s1)
```

### 事件循环机制

1、js 是单线程。 2、一个线程中，事件循环是唯一的，但是任务队列可以拥有多个。3、任务队列有宏任务（script(整体代码), setTimeout, setInterval, setImmediate, I/O（输入输出）, UI rendering）和微任务（process.nextTick, Promise,MutationObserver)

1）js 代码执行时，先按代码顺序将同步任务压入主执行栈中执行 （2）遇到异步任务则先将异步任务压入对应的任务队列中（宏队列或微队列） （3）同步任务执行完毕后，查看微队列，将微任务一一取出进入主执行栈中执行 （4）微任务队列清空后，再查看宏队列，只取出第一个宏任务执行，执行完一个宏任务后，回到第三步的操作 这个过程是循环不断的，所以整个的这种运行机制又称为 Event Loop（事件循环）。

### JS 函数节流 防抖

防抖

<iframe height="265" style="width: 100%;" scrolling="no" title="js 面试训练 抖动 节流" src="https://codepen.io/andypinet/embed/dyOeRrN?height=265&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/andypinet/pen/dyOeRrN'>js 面试训练 抖动 节流</a> by lingbaichao
  (<a href='https://codepen.io/andypinet'>@andypinet</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

节流

<iframe height="265" style="width: 100%;" scrolling="no" title="js 节流" src="https://codepen.io/andypinet/embed/eYBKNje?height=265&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/andypinet/pen/eYBKNje'>js 节流</a> by lingbaichao
  (<a href='https://codepen.io/andypinet'>@andypinet</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## CSS

### 盒子模型

ie盒子模型： width 和 height 指的是内容区域+border+padding的宽度和高度。
标准盒子模型：width 和 height 指的是内容区域的宽度和高度。

ie盒子模型和标准盒子模型转换可以利用 box-sizing： border-box / content-box；

### border 三角形 梯形

<iframe height="265" style="width: 100%;" scrolling="no" title="border css" src="https://codepen.io/andypinet/embed/PobaPqz?height=265&theme-id=light&default-tab=css,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/andypinet/pen/PobaPqz'>border css</a> by lingbaichao
  (<a href='https://codepen.io/andypinet'>@andypinet</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## 网络部分

### cookie、localStorage 与 sessionStorage 区别

cookie: 一般由服务器生成，可设置失效时间.

localStorage:仅在客户端（即浏览器）中保存,除非被清除，否则永久保存

sessionStorage:仅在当前会话下有效，关闭页面或浏览器后被清除

### 跨域问题

什么是跨域：浏览器在执行脚本的时候，都会检查这个脚本属于哪个页面，即检查是否同源，只有同源的脚本才会被执行；而非同源的脚本在请求数据的时候，浏览器会报一个异常，提示拒绝访问

（协议、域名、端口号都相同，只要有一个不相同，那么都是非同源。

跨域的解决方法：（1）response 添加 header：resp.setHeader("Access-Control-Allow-Origin", "\*");（2）jsonp （原理即利用 script 标签可以跨域）（3）代理

## vue 部分

[链接](/articles/vuetimu)

## 参考

- [1] (2020前端面试题)(https://zhuanlan.zhihu.com/p/138148644)
- [2] (Daily-Interview-Question)(https://github.com/00feng00/diaryBrush)
