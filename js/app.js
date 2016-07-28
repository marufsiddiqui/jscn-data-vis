$(function () {

  function prepareTypeData(type, elt) {
    return [new Date(elt.date), elt[type]]
  }

  function prepareData(data){
    const sortedBookingData = _.sortBy(data[0], function (x) {
      return new Date(x.date);
    });
    
    const sortedUsageData = _.sortBy(data[1], function (x) {
      return new Date(x.date);
    });
    
    return [{
      name: "Business",
      stack: 'usage',
      data: sortedBookingData.map(_.partial(prepareTypeData, 'business'))
    },{
      name: "Private",
      stack: 'usage',
      data: sortedBookingData.map(_.partial(prepareTypeData, 'private'))
    },{
      name: "Service",
      stack: 'usage',
      data: sortedBookingData.map(_.partial(prepareTypeData, 'service'))
    }, {
      name: "Active",
      type: "line",
      data: sortedUsageData.map(_.partial(prepareTypeData, 'active'))
    }, {
      name: "Usage",
      type: "column",
      data: sortedUsageData.map(_.partial(prepareTypeData, 'usage'))
    }];
  }
  
  function initChart(data) {
    console.table(data);
    var time = data.map(function (t) {
      return new Date(t);
    });
    $('#container').highcharts({
      chart: {
        type: 'column',
        zoomType: 'x'
      },
      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },
      title: {
        text: 'Booking per day'
      },
      xAxis: {
        type: 'datetime',
        format: '%Y-%m-%d'
      },
      yAxis: {
        title: {
          text: 'BOOKINGS PER DAY'
        }
      },
      series: data
    });
  }
  
  
  var getBookingPromise = $.getJSON('/data/bookingsPerDay.json?time=1');
  var getUsagePromise = $.getJSON('/data/vehicleUsage.json?time=1');
  Promise.all([getBookingPromise, getUsagePromise])
    .then(prepareData)
    .then(initChart);
  
});