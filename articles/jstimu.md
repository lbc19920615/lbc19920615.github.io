# 前端面试题总结

<TocTree></TocTree>

## 浏览器原理

从浏览器多进程到JS单线程，JS运行机制最全面的一次梳理
https://segmentfault.com/a/1190000012925872

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

JavaScript 只有一种结构：对象。每个实例对象（ object ）都有一个私有属性（称之为 proto ）指向它的构造函数的原型对象（prototype ）（只有函数对象才有 prototype）。该原型对象也有一个自己的原型对象( proto ) ，层层向上直到一个对象的原型对象为 null。根据定义，null 没有原型，并作为这个原型链中的最后一个环节。（即 Object.prototype.**proto** = null）;

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

### js 数组去重

```js
function unqiueArr(arr) {
  return arr.filter(function(v, index) {
    return arr.indexOf(v) === index
  })
}
```

### JS中的深拷贝与浅拷贝的区别？

- 深拷贝递归地复制新对象中的所有值或属性，而拷贝只复制引用。

- 在深拷贝中，新对象中的更改不会影响原始对象，而在浅拷贝中，新对象中的更改，原始对象中也会跟着改。

- 在深拷贝中，原始对象不与新对象共享相同的属性，而在浅拷贝中，它们具有相同的属性。

### 事件循环机制

1、js 是单线程。 2、一个线程中，事件循环是唯一的，但是任务队列可以拥有多个。3、任务队列有宏任务（script(整体代码), setTimeout, setInterval, setImmediate, I/O（输入输出）, UI rendering）和微任务（process.nextTick, Promise,MutationObserver)

1）js 代码执行时，先按代码顺序将同步任务压入主执行栈中执行 （2）遇到异步任务则先将异步任务压入对应的任务队列中（宏队列或微队列） （3）同步任务执行完毕后，查看微队列，将微任务一一取出进入主执行栈中执行 （4）微任务队列清空后，再查看宏队列，只取出第一个宏任务执行，执行完一个宏任务后，回到第三步的操作 这个过程是循环不断的，所以整个的这种运行机制又称为 Event Loop（事件循环）。

[复杂的js事件分析](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

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

## map 和 set 和 object

Map 对象保存键值对，并且能够记住键的原始插入顺序。任何值(对象或者原始值) 都可以作为一个键或一个值。

Objects 和 Maps 类似的是，它们都允许你按键存取一个值、删除键、检测一个键是否绑定了值。因此（并且也没有其他内建的替代方式了）过去我们一直都把对象当成 Maps 使用。不过 Maps 和 Objects 有一些重要的区别，在下列情况里使用 Map 会是更好的选择：

![](/articles/images/w12121212121215.png)

![](/articles/images/w1212124565656565.png)


Set 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用。


## Set 和 WeakSet

WeakSet 对象是一些对象值的集合, 并且其中的每个对象值都只能出现一次。在WeakSet的集合中是唯一的

它和 Set 对象的区别有两点:

与Set相比，WeakSet 只能是对象的集合，而不能是任何类型的任意值。
WeakSet持弱引用：集合中对象的引用为弱引用。 如果没有其他的对WeakSet中对象的引用，那么这些对象会被当成垃圾回收掉。 这也意味着WeakSet中没有存储当前对象的列表。 正因为这样，WeakSet 是不可枚举的。

## CSS

### bfc

[史上最全面、最透彻的BFC原理剖析](
https://github.com/zuopf769/notebook/blob/master/fe/BFC%E5%8E%9F%E7%90%86%E5%89%96%E6%9E%90/README.md)

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

### get post

GET产生一个TCP数据包，请求时浏览器会把http header和data一并发送出去，服务器响应200（返回数据）

POST产生两个TCP数据包，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok（返回数据）

（get请求参数的限制是来源与浏览器或web服务器，浏览器或web服务器限制了url的长度。）

### 跨域问题

什么是跨域：浏览器在执行脚本的时候，都会检查这个脚本属于哪个页面，即检查是否同源，只有同源的脚本才会被执行；而非同源的脚本在请求数据的时候，浏览器会报一个异常，提示拒绝访问

（协议、域名、端口号都相同，只要有一个不相同，那么都是非同源。

跨域的解决方法：（1）response 添加 header：resp.setHeader("Access-Control-Allow-Origin", "\*");（2）jsonp （原理即利用 script 标签可以跨域）（3）代理

## 你所知道的http的响应码及含义？

1xx(临时响应)

100: 请求者应当继续提出请求。

101(切换协议) 请求者已要求服务器切换协议，服务器已确认并准备进行切换。

2xx(成功)

200：正确的请求返回正确的结果

201：表示资源被正确的创建。比如说，我们 POST 用户名、密码正确创建了一个用户就可以返回 201。

202：请求是正确的，但是结果正在处理中，这时候客户端可以通过轮询等机制继续请求。

3xx(已重定向)

300：请求成功，但结果有多种选择。

301：请求成功，但是资源被永久转移。

303：使用 GET 来访问新的地址来获取资源。

304：请求的资源并没有被修改过

4xx(请求错误)

400：请求出现错误，比如请求头不对等。

401：没有提供认证信息。请求的时候没有带上 Token 等。

402：为以后需要所保留的状态码。

403：请求的资源不允许访问。就是说没有权限。

404：请求的内容不存在。

5xx(服务器错误)

500：服务器错误。

501：请求还没有被实现。

## vue 部分

[链接](/articles/vuetimu)

## js 手写

[链接](/articles/jswrite)

## node.js 部分

[链接](/articles/node)

## 参考

- [1] (2020前端面试题)(https://zhuanlan.zhihu.com/p/138148644)
- [2] (Daily-Interview-Question)(https://github.com/00feng00/diaryBrush)
