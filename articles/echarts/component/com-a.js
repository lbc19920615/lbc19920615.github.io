import { renderChart, getChart } from '/articles/echarts/render-chart.js'

export let map = new Map()

export function setLineMulti(document) {
  var data = [
    ['2000-06-05', 116],
    ['2000-06-06', 129],
    ['2000-06-07', 135],
    ['2000-06-08', 86],
    ['2000-06-09', 73],
    ['2000-06-10', 85],
    ['2000-06-11', 73],
    ['2000-06-12', 68],
    ['2000-06-13', 92],
    ['2000-06-14', 130],
    ['2000-06-15', 245],
    ['2000-06-16', 139],
    ['2000-06-17', 115],
    ['2000-06-18', 111],
    ['2000-06-19', 309],
    ['2000-06-20', 206],
    ['2000-06-21', 137],
    ['2000-06-22', 128],
    ['2000-06-23', 85],
    ['2000-06-24', 94],
    ['2000-06-25', 71],
    ['2000-06-26', 106],
    ['2000-06-27', 84],
    ['2000-06-28', 93],
    ['2000-06-29', 85],
    ['2000-06-30', 73],
    ['2000-07-01', 83],
    ['2000-07-02', 125],
    ['2000-07-03', 107],
    ['2000-07-04', 82],
    ['2000-07-05', 44],
    ['2000-07-06', 72],
    ['2000-07-07', 106],
    ['2000-07-08', 107],
    ['2000-07-09', 66],
    ['2000-07-10', 91],
    ['2000-07-11', 92],
    ['2000-07-12', 113],
    ['2000-07-13', 107],
    ['2000-07-14', 131],
    ['2000-07-15', 111],
    ['2000-07-16', 64],
    ['2000-07-17', 69],
    ['2000-07-18', 88],
    ['2000-07-19', 77],
    ['2000-07-20', 83],
    ['2000-07-21', 111],
    ['2000-07-22', 57],
    ['2000-07-23', 55],
    ['2000-07-24', 60],
  ]

  var dateList = data.map(function (item) {
    return item[0]
  })
  var valueList = data.map(function (item) {
    return item[1]
  })

  let option = {
    // Make gradient line here
    visualMap: [
      {
        show: false,
        type: 'continuous',
        seriesIndex: 0,
        min: 0,
        max: 400,
      },
      {
        show: false,
        type: 'continuous',
        seriesIndex: 1,
        dimension: 0,
        min: 0,
        max: dateList.length - 1,
      },
    ],

    title: [
      {
        left: 'center',
        text: 'Gradient along the y axis',
      },
      {
        top: '55%',
        left: 'center',
        text: 'Gradient along the x axis',
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
    xAxis: [
      {
        data: dateList,
      },
      {
        data: dateList,
        gridIndex: 1,
      },
    ],
    yAxis: [
      {},
      {
        gridIndex: 1,
      },
    ],
    grid: [
      {
        bottom: '60%',
      },
      {
        top: '60%',
      },
    ],
    series: [
      {
        type: 'line',
        showSymbol: false,
        data: valueList,
      },
      {
        type: 'line',
        showSymbol: false,
        data: valueList,
        xAxisIndex: 1,
        yAxisIndex: 1,
      },
    ],
  }

  renderChart(document, option)
}
map.set('setLineMulti', setLineMulti)

export function setLineDian(document) {
  let option = {
    title: {
      text: '一天用电量分布',
      subtext: '纯属虚构',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [
        '00:00',
        '01:15',
        '02:30',
        '03:45',
        '05:00',
        '06:15',
        '07:30',
        '08:45',
        '10:00',
        '11:15',
        '12:30',
        '13:45',
        '15:00',
        '16:15',
        '17:30',
        '18:45',
        '20:00',
        '21:15',
        '22:30',
        '23:45',
      ],
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} W',
      },
      axisPointer: {
        snap: true,
      },
    },
    visualMap: {
      show: false,
      dimension: 0,
      pieces: [
        {
          lte: 6,
          color: 'green',
        },
        {
          gt: 6,
          lte: 8,
          color: 'red',
        },
        {
          gt: 8,
          lte: 14,
          color: 'green',
        },
        {
          gt: 14,
          lte: 17,
          color: 'red',
        },
        {
          gt: 17,
          color: 'green',
        },
      ],
    },
    series: [
      {
        name: '用电量',
        type: 'line',
        smooth: true,
        data: [
          300,
          280,
          250,
          260,
          270,
          300,
          550,
          500,
          400,
          390,
          380,
          390,
          400,
          500,
          600,
          750,
          800,
          700,
          600,
          400,
        ],
        markArea: {
          itemStyle: {
            color: 'rgba(255, 173, 177, 0.4)',
          },
          data: [
            [
              {
                name: '早高峰',
                xAxis: '07:30',
              },
              {
                xAxis: '10:00',
              },
            ],
            [
              {
                name: '晚高峰',
                xAxis: '17:30',
              },
              {
                xAxis: '21:15',
              },
            ],
          ],
        },
      },
    ],
  }

  renderChart(document, option)
}

map.set('setLineDian', setLineDian)

export function setLineDynimal(document) {
  function randomData() {
    now = new Date(+now + oneDay)
    value = value + Math.random() * 21 - 10
    return {
      name: now.toString(),
      value: [
        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
        Math.round(value),
      ],
    }
  }

  var data = []
  var now = +new Date(1997, 9, 3)
  var oneDay = 24 * 3600 * 1000
  var value = Math.random() * 1000
  for (var i = 0; i < 1000; i++) {
    data.push(randomData())
  }

  let option = {
    title: {
      text: '动态数据 + 时间坐标轴',
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        params = params[0]
        var date = new Date(params.name)
        return (
          date.getDate() +
          '/' +
          (date.getMonth() + 1) +
          '/' +
          date.getFullYear() +
          ' : ' +
          params.value[1]
        )
      },
      axisPointer: {
        animation: false,
      },
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        name: '模拟数据',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: data,
      },
    ],
  }

  renderChart(document, option);

  setInterval(function () {
    for (var i = 0; i < 5; i++) {
      data.shift()
      data.push(randomData())
    }

    getChart().setOption({
      series: [
        {
          data: data,
        },
      ],
    })
  }, 1000)
}
map.set('setLineDynimal', setLineDynimal)
