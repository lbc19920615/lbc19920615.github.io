# 正确处理json的方法

```javascript
function safeParseJSON(str) {
  // 处理换行符
  str = str.replace(/\n/g, '\\n')
  return JSON.parse(str)
}
```