$(document).ready(function ($) {
  var containers = 0;
  var racks = 0;
  var servers = {};
  $.ajax({
    url: "/api/info/amount",
    method: "GET",
    async: true,
    success: function (response) {
      containers = response["container"];
      racks = response["rack"];
      servers = response["server"];
      console.log(containers, racks, servers);
    },
    error: function (response) {
      alert("Failed to get hardware information.");
    },
  }).then({});

  var now = new Date();
  var year = now.getYear() + 1900;
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var day = `${year}-${month}-${date}`;

  console.log(servers["1"]);
  // rack 1 == container 1 rack 1 + container 2 rack 1
  var rack1Options = [];
  for (var r = 0; r < servers[1]; r++) {
    rack1Options.push(
      new chartOption("rack1server" + str(i + 1) + "-chart", str(i + 1))
    );
  }

  console.log(rack1Options);

  var rack2Options = [];
  for (var r = 0; r < servers[2]; r++) {
    rack2Options.push(
      new chartOption("rack2server" + str(i + 1) + "-chart", str(i + 1))
    );
  }

  console.log(rack2Options);

  for (var i = 0; i < racks; i++) {
    generateTempSurface(rackOptions[i]).then(function (option) {
      rackOptions[i] = option;
      drawTemperature(rackOptions[i], day);
    });
  }
  //   generateTempSurface(rack1Option).then(function (option) {
  //     rack1Option = option;
  //     drawTemperature(rack1Option, day);
  //   });
  //   generateTempSurface(rack2Option).then(function (option) {
  //     rack2Option = option;
  //     drawTemperature(rack2Option, day);
  //   });
  //   generateTempSurface(rack3Option).then(function (option) {
  //     rack3Option = option;
  //     drawTemperature(rack3Option, day);
  //   });
  //   generateTempSurface(rack4Option).then(function (option) {
  //     rack4Option = option;
  //     drawTemperature(rack4Option, day);
  //   });
  //   var rack1Option = new chartOption("temperature-chart1", "1");
  //   var rack2Option = new chartOption("temperature-chart2", "2");
  //   var rack3Option = new chartOption("temperature-chart3", "3");
  //   var rack4Option = new chartOption("temperature-chart4", "4");

  var pueOptions = [];
  for (var j = 0; j < containers; j++) {
    pueOptions.push(new pueOption("pue-container" + str(j + 1), str(j + 1)));
  }
  for (var j = 0; j < containers; j++) {
    generatePUESurface(pueOption[j]).then(function (option) {
      pueOptions[j] = option;
      drawTemperature(pueOptions[j], day);
    });
  }
  //   var pue1Option = new pueOption("pue-chart1", "1");
  //   var pue2Option = new pueOption("pue-chart2", "2");

  //   generatePUESurface(pue1Option).then(function (option) {
  //     pue1Option = option;
  //     drawPUE(pue1Option, day);
  //   });

  //   generatePUESurface(pue2Option).then(function (option) {
  //     pue2Option = option;
  //     drawPUE(pue2Option, day);
  //   });

  $("input:text").attr("placeholder", today);

  var timers = [];
  for (var i = 0; i < racks; i++) {
    timers.push(setInterval(updateTemperature, 30000, rackOptions[i], day));
  }

  var pueTimers = [];
  for (var j = 0; j < containers; j++) {
    pueTimers.push(setInterval(updatePUE, 30000, pueOptions[j], day));
  }
  //   timer1 = setInterval(updateTemperature, 30000, rack1Option, day);
  //   timer2 = setInterval(updateTemperature, 30000, rack2Option, day);
  //   timer3 = setInterval(updateTemperature, 30000, rack3Option, day);
  //   timer4 = setInterval(updateTemperature, 30000, rack4Option, day);

  //   pueTimer1 = setInterval(updatePUE, 30000, pue1Option, day);
  //   pueTimer2 = setInterval(updatePUE, 30000, pue2Option, day);
});

var chartOption = function (id, rack) {
  this.id = id;
  this.rack = rack;
  this.time = 0;

  this.sciChartSurface = null;
  this.wasmContext = null;

  this.lineSeries1 = null;
  this.lineSeries2 = null;
  this.lineSeries3 = null;
  this.lineSeries4 = null;

  this.data1 = null;
  this.data2 = null;
  this.data3 = null;
  this.data4 = null;
};

var pueOption = function (id, rack) {
  this.id = id;
  this.rack = rack;
  this.time = 0;

  this.sciChartSurface = null;
  this.wasmContext = null;

  this.lineSeries = null;

  this.data = null;
};

var timer1 = null;
var timer2 = null;
var timer3 = null;
var timer4 = null;

var pueTimer1 = null;
var pueTimer2 = null;

var now = new Date();
var year = now.getYear() + 1900;
var month = now.getMonth() + 1;
var date = now.getDate();
var today = `${year}-${month}-${date}`;

const {
  SciChartSurface,
  NumericAxis,
  DateTimeNumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  XyScatterRenderableSeries,
  EllipsePointMarker,
  EZoomState,
  SweepAnimation,
  SciChartJSLightTheme,
  RolloverModifier,
  RubberBandXyZoomModifier,
  NumberRange,
  LegendModifier,
  MouseWheelZoomModifier,
  ZoomPanModifier,
  ZoomExtentsModifier,
} = SciChart;

const generateTempSurface = async function (option) {
  var option = option;
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    option.id
  );

  const xAxis = new DateTimeNumericAxis(wasmContext);
  const yAxis = new NumericAxis(wasmContext);

  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

  const lineSeries1 = new FastLineRenderableSeries(wasmContext, {
    stroke: "#F45B5B",
    strokeThickness: 4,
  });
  const lineSeries2 = new FastLineRenderableSeries(wasmContext, {
    stroke: "#FFB703",
    strokeThickness: 4,
  });
  const lineSeries3 = new FastLineRenderableSeries(wasmContext, {
    stroke: "#90EE7E",
    strokeThickness: 4,
  });
  const lineSeries4 = new FastLineRenderableSeries(wasmContext, {
    stroke: "#2B908F",
    strokeThickness: 4,
  });

  const tooltipModifier = new RolloverModifier(wasmContext);
  sciChartSurface.chartModifiers.add(tooltipModifier);
  sciChartSurface.chartModifiers.add(
    new LegendModifier({ showCheckboxes: true, margin: 1 })
  );
  sciChartSurface.chartModifiers.add(
    new ZoomPanModifier(),
    new MouseWheelZoomModifier()
  );
  // sciChartSurface.chartModifiers.add(new RubberBandXyZoomModifier());

  sciChartSurface.renderableSeries.add(
    lineSeries1,
    lineSeries2,
    lineSeries3,
    lineSeries4
  );

  option.sciChartSurface = sciChartSurface;
  option.wasmContext = wasmContext;
  option.lineSeries1 = lineSeries1;
  option.lineSeries2 = lineSeries2;
  option.lineSeries3 = lineSeries3;
  option.lineSeries4 = lineSeries4;
  // console.log("generateTempSurface");
  // console.log(option)
  return option;
};

const generatePUESurface = async function (option) {
  var option = option;
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    option.id
  );

  const xAxis = new DateTimeNumericAxis(wasmContext);
  const yAxis = new NumericAxis(wasmContext);

  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

  const lineSeries = new FastLineRenderableSeries(wasmContext, {
    stroke: "#F45B5B",
    strokeThickness: 4,
  });

  const tooltipModifier = new RolloverModifier(wasmContext);
  sciChartSurface.chartModifiers.add(tooltipModifier);
  sciChartSurface.chartModifiers.add(
    new ZoomPanModifier(),
    new MouseWheelZoomModifier()
  );

  sciChartSurface.renderableSeries.add(lineSeries);

  option.sciChartSurface = sciChartSurface;
  option.wasmContext = wasmContext;
  option.lineSeries = lineSeries;
  // console.log("generatePUESurface");
  // console.log(option)
  return option;
};

const drawTemperature = async (option, start) => {
  var o = option;
  // console.log(o);

  if (
    o.data1 == null &&
    o.data2 == null &&
    o.data3 == null &&
    o.data4 == null
  ) {
    o.data1 = new XyDataSeries(o.wasmContext, { dataSeriesName: "Server 1" });
    o.data2 = new XyDataSeries(o.wasmContext, { dataSeriesName: "Server 2" });
    o.data3 = new XyDataSeries(o.wasmContext, { dataSeriesName: "Server 3" });
    o.data4 = new XyDataSeries(o.wasmContext, { dataSeriesName: "Server 4" });
    $.ajax({
      url: `http://localhost:8000/api/rack/temperature_rack/?rack_id=${o.rack}&date_string=${start}`,
      method: "GET",
      async: true,
      success: function (response) {
        var degrees = response;
        var date = new Date();
        if (degrees.length != 0) {
          degrees.forEach(function (el, index) {
            date = new Date(el["time"]);
            o.time = date.getTime();
            if (el["server_id"] == 1) {
              o.data1.append(o.time / 1000 + 32400, el["temperature"]);
            } else if (el["server_id"] == 2) {
              o.data2.append(o.time / 1000 + 32400, el["temperature"]);
            } else if (el["server_id"] == 3) {
              o.data3.append(o.time / 1000 + 32400, el["temperature"]);
            } else {
              o.data4.append(o.time / 1000 + 32400, el["temperature"]);
            }
          });
        }
      },
      error: function (response) {
        alert("Get data failed");
      },
    });
  }

  // Assign these dataseries to the line/scatter renderableseries
  o.lineSeries1.dataSeries = o.data1;
  o.lineSeries2.dataSeries = o.data2;
  o.lineSeries3.dataSeries = o.data3;
  o.lineSeries4.dataSeries = o.data4;
};

const drawPUE = async (option, start) => {
  var o = option;

  if (o.data == null) {
    o.data = new XyDataSeries(o.wasmContext, { dataSeriesName: "Rack 1" });
    $.ajax({
      url: `http://localhost:8000/api/rack/pue_rack/?rack_id=${o.rack}&date_string=${start}`,
      method: "GET",
      async: true,
      success: function (response) {
        var degrees = response;
        var date = new Date();
        if (degrees.length != 0) {
          degrees.forEach(function (el, index) {
            date = new Date(el["time"]);
            o.time = date.getTime();
            o.data.append(o.time / 1000 + 32400, el["pue"]);
          });
        }
      },
      error: function (response) {
        alert("Get data failed");
      },
    });
  }

  // Assign these dataseries to the line/scatter renderableseries
  o.lineSeries.dataSeries = o.data;
};

const updateTemperature = (option, start) => {
  var o = option;
  // console.log(`update chart date: ${o.time}`)
  // Append another data-point to the chart. We use dataSeries.count()
  // to determine the current length before appending

  $.ajax({
    url: `http://localhost:8000/api/rack/temperature_rack/?rack_id=${o.rack}&date_string=${start}`,
    method: "GET",
    async: true,
    success: function (response) {
      var degrees = response;

      if (degrees.length != 0) {
        degrees.forEach(function (el, index) {
          var new_date = new Date(el["time"]);
          var new_time = new_date.getTime();
          // console.log(`before: ${time}, next: ${new_time}`);
          if (el["server_id"] == 1 && new_time > o.time) {
            o.data1.append(new_time / 1000 + 32400, el["temperature"]);
            o.time = new_time;
          } else if (el["server_id"] == 2 && new_time > o.time) {
            o.data2.append(new_time / 1000 + 32400, el["temperature"]);
            o.time = new_time;
          } else if (el["server_id"] == 3 && new_time > o.time) {
            o.data3.append(new_time / 1000 + 32400, el["temperature"]);
            o.time = new_time;
          } else if (el["server_id"] == 4 && new_time > o.time) {
            o.data4.append(new_time / 1000 + 32400, el["temperature"]);
            o.time = new_time;
          }

          // time.append(i, el["time"]);
        });
      }
    },
    error: function (response) {
      alert("Get data failed");
    },
  });
  drawTemperature(o);
};

const updatePUE = (option, start) => {
  var o = option;
  console.log(`update chart date: ${start}`);
  // Append another data-point to the chart. We use dataSeries.count()
  // to determine the current length before appending

  $.ajax({
    url: `http://localhost:8000/api/rack/pue_rack/?rack_id=${o.rack}&date_string=${start}`,
    method: "GET",
    async: true,
    success: function (response) {
      var degrees = response;

      if (degrees.length != 0) {
        degrees.forEach(function (el, index) {
          var new_date = new Date(el["time"]);
          var new_time = new_date.getTime();
          if (new_time > o.time) {
            o.data.append(new_time / 1000 + 32400, el["pue"]);
          }
        });
      }
    },
    error: function (response) {
      alert("Get data failed");
    },
  });
  drawPUE(o, start);
};

$("#btn-prev").click(function () {
  clearInterval(timer1);
  clearInterval(timer2);
  clearInterval(timer3);
  clearInterval(timer4);
  clearInterval(pueTimer1);
  clearInterval(pueTimer2);

  rack1Option = new chartOption("temperature-chart1", "1");
  rack2Option = new chartOption("temperature-chart2", "2");
  rack3Option = new chartOption("temperature-chart3", "3");
  rack4Option = new chartOption("temperature-chart4", "4");

  pue1Option = new pueOption("pue-chart1", "1");
  pue2Option = new pueOption("pue-chart2", "2");

  date = date - 1;
  if (date < 1) {
    month = month - 1;
    if (month < 1) {
      month = 12;
      date = 31;
      year = year - 1;
    } else if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
      date = 31;
    } else {
      date = 30;
    }
  }

  var prevdate = `${year}-${month}-${date}`;

  $("#datepicker").data("datepicker").selectDate(new Date(prevdate));
});

$("#btn-next").click(function () {
  clearInterval(timer1);
  clearInterval(timer2);
  clearInterval(timer3);
  clearInterval(timer4);
  clearInterval(pueTimer1);
  clearInterval(pueTimer2);

  rack1Option = new chartOption("temperature-chart1", "1");
  rack2Option = new chartOption("temperature-chart2", "2");
  rack3Option = new chartOption("temperature-chart3", "3");
  rack4Option = new chartOption("temperature-chart4", "4");

  pue1Option = new pueOption("pue-chart1", "1");
  pue2Option = new pueOption("pue-chart2", "2");

  date = date + 1;

  if (date == 32 && month in [1, 3, 5, 7, 8, 10, 12].includes(month)) {
    date = 1;
    month = month + 1;
    if (month == 12) {
      month = 1;
      year = year + 1;
    }
  } else if (date == 31 && [2, 4, 6, 9, 11].includes(month)) {
    date = 1;
    month = month + 1;
    if (month == 13) {
      month = 1;
      year = year + 1;
    }
  }
  var nextDay = `${year}-${month}-${date}`;
  $("#datepicker").data("datepicker").selectDate(new Date(nextDay));
});

$("#datepicker").datepicker({
  language: "ko",
  autoClose: true,
  onSelect: function (dateText) {
    changeDate(dateText);
  },
});

function changeDate(dateText) {
  clearInterval(timer1);
  clearInterval(timer2);
  clearInterval(timer3);
  clearInterval(timer4);
  console.log("selected");
  console.log(dateText);

  var now = new Date(dateText);
  year = now.getYear() + 1900;
  month = now.getMonth() + 1;
  date = now.getDate();

  rack1Option = new chartOption("temperature-chart1", "1");
  rack2Option = new chartOption("temperature-chart2", "2");
  rack3Option = new chartOption("temperature-chart3", "3");
  rack4Option = new chartOption("temperature-chart4", "4");
  pue1Option = new pueOption("pue-chart1", "1");
  pue2Option = new pueOption("pue-chart2", "2");

  generateTempSurface(rack1Option).then(function (option) {
    rack1Option = option;
    drawTemperature(rack1Option, dateText);
  });
  generateTempSurface(rack2Option).then(function (option) {
    rack2Option = option;
    drawTemperature(rack2Option, dateText);
  });
  generateTempSurface(rack3Option).then(function (option) {
    rack3Option = option;
    drawTemperature(rack3Option, dateText);
  });
  generateTempSurface(rack4Option).then(function (option) {
    rack4Option = option;
    drawTemperature(rack4Option, dateText);
  });
  generatePUESurface(pue1Option).then(function (option) {
    pue1Option = option;
    drawPUE(pue1Option, dateText);
  });
  generatePUESurface(pue2Option).then(function (option) {
    pue2Option = option;
    drawPUE(pue2Option, dateText);
  });
  if (dateText == today) {
    timer1 = setInterval(updateTemperature, 30000, rack1Option, dateText);
    timer2 = setInterval(updateTemperature, 30000, rack2Option, dateText);
    timer3 = setInterval(updateTemperature, 30000, rack3Option, dateText);
    timer4 = setInterval(updateTemperature, 30000, rack4Option, dateText);
    pueTimer1 = setInterval(updatePUE, 30000, pue1Option, dateText);
    pueTimer2 = setInterval(updatePUE, 30000, pue2Option, dateText);
  }
}
