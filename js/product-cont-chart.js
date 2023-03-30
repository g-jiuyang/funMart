(function (window, document) {
  /* ---------------------------------------- [START] 交易履歷 - Chart */
  var myChart = null;

  var timeControl = {
    'week': 7,
    'month-1': 30,
    'month-3': 90,
    'month-6': 180,
    'year': 365 };


  function buildChart(dataObj, dayType) {
    // console.log('build Chart');

    var chartDom = document.getElementById('pd-history__chart');
    var data = dataObj.slice(0, timeControl[dayType]);

    myChart = echarts.init(chartDom);

    var oneDay = 3600 * 24 * 1000;
    var maxInterval, minInterval;

    // 避免
    switch (dayType) {
      case 'month-3':
        minInterval = oneDay * 30;
        break;
      default:
        maxInterval = null;}


    var option = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
        {
          ticks: {
            beginAtZero: true } }] },




      tooltip: {
        trigger: 'axis',
        // 固定在顶部 + 置中
        position: function position(point, params, dom, rect, size) {
          return [point[0] - size.contentSize[0] / 2, '0'];
        },
        formatter: function formatter(params) {
          // console.log(params[0].data.value[1]);
          return "\n\t\t\t\t\t\t<small class=\"text-tip\">".concat(
          params[0].data.value[0], "</small></br>\n\t\t\t\t\t\t<strong>").concat(
          params[0].data.value[1], "</strong>\n\t\t\t\t\t");

        },
        className: 'echarts-tooltip',
        transitionDuration: 0.1 },

      xAxis: {
        type: 'time',
        splitLine: {
          show: false },

        axisLine: {
          lineStyle: {
            color: '#333' } },


        maxInterval: maxInterval,
        minInterval: minInterval },

      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        axisLine: {
          lineStyle: {
            color: '#333' } } },



      series: [
      {
        type: 'line',
        showSymbol: false, // 取消值点的空心样式，只有在hover时显示
        lineStyle: {
          width: 2 // 正常时的折线宽度
        },
        emphasis: {
          lineStyle: {
            width: 2 // hover时的折线宽度
          } },

        color: '#11b8ea',
        symbolSize: 8, // 交點大小
        data: data }],


      // Chart 的顯示範圍(%)
      grid: {
        top: 50,
        left: 30,
        right: 5,
        bottom: 20 } };



    option && myChart.setOption(option);

    chartDom.echart = myChart;

    chartDom.addEventListener('touchend', function () {
      // myChart.dispatchAction({
      // 	type: 'downplay',
      // 	seriesIndex: 0,
      // });

      myChart.dispatchAction({
        type: 'hideTip' });

    });
  }

  window.addEventListener('resize', function () {
    if (myChart) {
      myChart.resize();
    }
  });

  window.buildChart = buildChart;
  /* ---------------------------------------- [END] 交易履歷 - Chart */
})(window, document);