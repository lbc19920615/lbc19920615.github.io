# CSS scroll-driven

在最新的Chrome 115中，令人无比期待的CSS 滚动驱动动画(CSS scroll-driven animations)终于正式支持了~有了它，几乎以前任何需要JS监听滚动的交互都可以纯 CSS 实现了


```html
<div class="progress"></div>
```

进度条是fixed定位

```css
.progress{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 10px;
  background-color: #F44336;
  transform-origin: 0 50%;
}

```

然后给这个进度条添加一个动画，表示进度从0到100%
```css
@keyframes grow-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

```css
.progress{
  animation: grow-progress 3s linear;
}
```

刷新页面，可以看到进度条在3s内从0增长到了100%

最后，加上最核心的一段，也就是今天的主角animation-timeline

```css
.progress{
  /*...*/
  animation-timeline: scroll();
}
```

<iframe style="display: block; width: 100%; height: 350px" src="https://code.juejin.cn/pen/7258614059845566521" />