export function setLineSimple(document) {
  var dom = document.getElementById("container");
  var myChart = echarts.init(dom);
  var app = {};

  var option;



  option = {
      xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
          areaStyle: {}
      }]
  };

  if (option && typeof option === 'object') {
      myChart.setOption(option);
  }
}