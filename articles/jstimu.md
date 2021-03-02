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

### 如何判断js数据类型

1. typeof
2. instanceof
3. Object.prototype.toString()

### 原型和原型链

avaScript 只有一种结构：对象。每个实例对象（ object ）都有一个私有属性（称之为 proto ）指向它的构造函数的原型对象（prototype ）（只有函数对象才有prototype）。该原型对象也有一个自己的原型对象( proto ) ，层层向上直到一个对象的原型对象为 null。根据定义，null 没有原型，并作为这个原型链中的最后一个环节。（即Object.prototype.__proto__ = null）;

### 什么是闭包

那什么是闭包呢，一言以蔽之：一个持有外部环境变量的函数就是闭包。

```js
let a = 1
let b = function(){
    console.log(a)
}
```

在这个例子里函数b因为捕获了外部作用域（环境）中的变量a，因此形成了闭包。 而由于变量a并不属于函数b，所以在概念里被称之为「自由变量」。

为了更直观的描述「捕获」这个过程，再用PHP来个栗子：

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

Person.prototype.setAge = function(v) {
  this.age = v
}

function Student(name, age, school) {
  Person.call(this, name, age)
  this.school = school
}

Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student

let s1 = new Student('hal', 12, 'school')

console.log(s1 instanceof Student, s1 instanceof Person) // true true
console.log(s1.constructor) //Student
console.log(s1)
```

### 事件循环机制

1、js是单线程。 2、一个线程中，事件循环是唯一的，但是任务队列可以拥有多个。3、任务队列有宏任务（script(整体代码), setTimeout, setInterval, setImmediate, I/O（输入输出）, UI rendering）和微任务（process.nextTick, Promise,MutationObserver)

1）js代码执行时，先按代码顺序将同步任务压入主执行栈中执行 （2）遇到异步任务则先将异步任务压入对应的任务队列中（宏队列或微队列） （3）同步任务执行完毕后，查看微队列，将微任务一一取出进入主执行栈中执行 （4）微任务队列清空后，再查看宏队列，只取出第一个宏任务执行，执行完一个宏任务后，回到第三步的操作 这个过程是循环不断的，所以整个的这种运行机制又称为Event Loop（事件循环）。

### JS 函数节流 抖动

<iframe height="265" style="width: 100%;" scrolling="no" title="js 面试训练 抖动 节流" src="https://codepen.io/andypinet/embed/dyOeRrN?height=265&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/andypinet/pen/dyOeRrN'>js 面试训练 抖动 节流</a> by lingbaichao
  (<a href='https://codepen.io/andypinet'>@andypinet</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>




