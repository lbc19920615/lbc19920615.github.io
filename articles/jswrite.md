# js 手写题目

手写数组转树

```js
let input = [
  {
    id: 1,
    val: "学校",
    parentId: null,
  },
  {
    id: 2,
    val: "班级1",
    parentId: 1,
  },
  {
    id: 3,
    val: "班级2",
    parentId: 1,
  },
  {
    id: 4,
    val: "学生1",
    parentId: 2,
  },
  {
    id: 5,
    val: "学生2",
    parentId: 3,
  },
  {
    id: 6,
    val: "学生3",
    parentId: 3,
  },
];
```

<iframe height="265" style="width: 100%;" scrolling="no" title="js 手写面试题1" src="https://codepen.io/andypinet/embed/preview/gOLKNXM?height=265&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/andypinet/pen/gOLKNXM'>js 手写面试题1</a> by lingbaichao
  (<a href='https://codepen.io/andypinet'>@andypinet</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

2 深度拷贝

<iframe height="265" style="width: 100%;" scrolling="no" title="js 手写面试题2" src="https://codepen.io/andypinet/embed/poNKMam?height=265&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/andypinet/pen/poNKMam'>js 手写面试题2</a> by lingbaichao
  (<a href='https://codepen.io/andypinet'>@andypinet</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

3 事件总线

<script async src="//jsfiddle.net/lbc19920615/9sz1v8t2/21/embed/"></script>

## 去重

```js
function arr_unique(arr) {
  var res = arr.filter(function(item, index, array) {
    return array.indexOf(item) === index
  })
  return res;
}
```

## flat

```js
function arr_flat(arr) {
  var ret = []
  for (let i = 0; i < arr.length; i++) {
    if (!Array.isArray(arr[i])) {
      ret.push(arr[i])
    } else {
      ret = ret.concat(arr_flat(arr[i]))
    }
  }
  return ret;
}
```

[link](https://jsfiddle.net/lbc19920615/z5Lj4x60/4/)

## debouce

```js
function debounce(fun, wait, imm) {
  var timeout, result;
  var debouced = function() {
    var context = this
    var args = arguments
    if (timeout) {  clearTimeout(timeout) }
    if (imm) {
      var callNow = !timeout
      timeout = setTimeout(function() {
        timeout = null
      }, wait)
      if (callNow) {
        result = fun.apply(context, args)
      }
    } else {
      timeout = setTimeout(function() {
         result = fun.apply(context, args)
      }, wait)
    }
    return result
  }

  debouced.cancel = function() {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}
```

```js
function throttle(fn, delay) {
  var previous = 0
  return function() {
    var _this = this;
    var args = arguments;
    var now = new Date()
    if (now - previous > delay) {
      fn.apply(_this, args);
      previous = now
    }
  }
}
```

## 柯里化

```js
function curry(fn) {
  let judge = (...args) => {
    if (args.length == fn.length) {
      return fn(...args)
    }
    return (...arg) => judge(...args, ...arg)
  }
  
  return judge;
}
```