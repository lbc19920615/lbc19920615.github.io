var myChart;

export function renderChart(document, option = {}) {
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

export function getChart() {
    return myChart
}