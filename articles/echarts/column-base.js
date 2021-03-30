import { renderChart } from '/articles/echarts/render-chart.js'

export function setColumnBase1(document) {
  renderChart(document, {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
        }
    }]
  })
}

export function init(map) {
  map.set('setColumnBase1', setColumnBase1)
}