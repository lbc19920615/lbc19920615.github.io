# JS 面试题总结

## JS 基本数据类型

1. Number
2. String
3. Null
4. Undefined
5. Symbol
6. BigInt

## JS 基本引用数据类型

1. Object
2. Array
3. Function

## JS ES5 函数继承

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

## JS 函数节流 抖动

<iframe height="265" style="width: 100%;" scrolling="no" title="js 面试训练 抖动 节流" src="https://codepen.io/andypinet/embed/dyOeRrN?height=265&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/andypinet/pen/dyOeRrN'>js 面试训练 抖动 节流</a> by lingbaichao
  (<a href='https://codepen.io/andypinet'>@andypinet</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>



