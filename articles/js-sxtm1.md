# js 手写题目

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