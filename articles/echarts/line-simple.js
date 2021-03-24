
 var myChart;

function renderChart(document, option = {}) {
    var dom = document.getElementById("container");
    if (!myChart) {
        myChart = echarts.init(dom);
    } else {
        myChart.clear()
    }

    var opt = Object.assign({}, option);

    if (opt && typeof opt === 'object') {
        myChart.setOption(opt);
    }
}


export let map = new Map();

export function setLineSimple(document) {
    renderChart(document, {
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
    })
}
map.set('setLineSimple', setLineSimple);

export function setLineSmooth(document) {
    renderChart(document, {
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
            areaStyle: {},
            smooth: true
        }]
    })
}
map.set('setLineSmooth', setLineSmooth);
