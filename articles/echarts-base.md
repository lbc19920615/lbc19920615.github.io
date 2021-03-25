# echarts base

## 异步数据加载和更新

入门示例中的数据是在初始化后 setOption 中直接填入的，但是很多时候可能数据需要异步加载后再填入。Apache EChartsTM 中实现异步数据的更新非常简单，在图表初始化后不管任何时候只要通过 jQuery 等工具异步获取数据后通过 setOption 填入数据和配置项就行。

```js
var myChart = echarts.init(document.getElementById('main'));

$.get('data.json').done(function (data) {
    myChart.setOption({
        title: {
            text: '异步数据加载示例'
        },
        tooltip: {},
        legend: {
            data:['销量']
        },
        xAxis: {
            data: data.categories
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: data.data
        }]
    });
});
```

### loading 动画

```js
myChart.showLoading();
$.get('data.json').done(function (data) {
    myChart.hideLoading();
    myChart.setOption(...);
});
```

## visualMap

visualMap 是视觉映射组件，用于进行『视觉编码』，也就是将数据映射到视觉元素（视觉通道）。

### visualMap-continuous. min

指定 visualMapContinuous 组件的允许的最小值。'min' 必须用户指定。[visualMap.min, visualMax.max] 形成了视觉映射的『定义域』。

### visualMap-continuous. max

指定 visualMapContinuous 组件的允许的最大值。'max' 必须用户指定。[visualMap.min, visualMax.max] 形成了视觉映射的『定义域』。

### visualMap-continuous. dimension

默认取 data 中最后一个维度

### visualMap-continuous. inRange