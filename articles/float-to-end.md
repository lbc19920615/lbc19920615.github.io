# css 浮动元素到右下角

是否需要在右侧或左侧布置元素，以使文字环绕？对于float属性，这是一件容易的事。但是，如果您还想在我们处于该位置时将该元素放到右下角，该怎么办？

html

```html

<h1>Resize the below div!</h1>

<div class="wrapper">
  <div class="box">
    <div class="float"><img src="https://picsum.photos/id/1/100/100" ></div>
  shdjsjshjd说的就是过段时间低功耗撒股东会市规划局sad规划设计更待何时更待何时十多个时间段规划师更待何时更待何时更待何时是更待何时更待何时更待何时shdjsjshjd说的就是过段时间低功耗撒股东会市规划局sad规划设计更待何时更待何时十多个时间段规划师更待何时更待何时更待何时是更待何时更待何时更待何时shdjsjshjd说的就是过段时间低功耗撒股东会市规划局sad规划设计更待何时更待何时十多个时间段规划师更待何时更待何时更待何时是更待何时更待何时更待何时
  </div>
</div>

```


第一步放到右下角

![img](/articles/images/w1212112265656565.png)


然后要靠 [shape-outside](https://developer.mozilla.org/zh-CN/docs/Web/CSS/shape-outside) 

> shape-outside的CSS 属性定义了一个可以是非矩形的形状，相邻的内联内容应围绕该形状进行包装。 默认情况下，内联内容包围其边距框; shape-outside提供了一种自定义此包装的方法，可以将文本包装在复杂对象周围而不是简单的框中。

inset  插入一个矩形

https://developer.mozilla.org/en-US/docs/Web/CSS/basic-shape#inset()

> 定义一个插入矩形。当提供了前四个自变量的全部时，它们表示从参考框向内的顶部，右侧，底部和左侧偏移，这些偏移定义了插入矩形边缘的位置。

```css
    shape-outside:inset(calc(100% - var(--img-width)) 0 0 0);
```

<iframe height="265" style="width: 100%;" scrolling="no" title="dyNgYOP" src="https://codepen.io/andypinet/embed/dyNgYOP?height=265&theme-id=light&default-tab=css,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/andypinet/pen/dyNgYOP'>dyNgYOP</a> by lingbaichao
  (<a href='https://codepen.io/andypinet'>@andypinet</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>