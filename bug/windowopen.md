# window.open失效

<el-alert
  title="很多浏览器强制禁止 所以不要把window.open放在异步任务里"
  type="warning">
</el-alert>

```js
function() {
  window.open()  // yes
  coursePay(self.checkout_id, data).then(res => {
    window.open() // no
  })
}
```

使用a标签打开还是保险一点

```js
function newWin(url, id) {
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('target', '_blank');
  a.setAttribute('id', id);
  // 防止反复添加
  if (!document.getElementById(id)) {
    document.body.appendChild(a);
  }
  a.click();
}
window.newWin = newWin;
```