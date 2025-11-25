var day = new Date();
var month = day.getMonth() + 1;
if (month < 10) {
  month = "0" + month;
}
var date = day.getDate();
if (date < 10) {
  date = "0" + date;
}

var today = day.getFullYear() + "-" + month + "-" + date;
var tomorrow = day.getFullYear() + "-" + month + "-" + date;

var today_date = new Date(today);
var tomorrow_date = new Date(today);
tomorrow_date.setDate(tomorrow_date.getDate() + 1);

const offset = new Date().getTimezoneOffset() * 60000;

var rack_id = 1;

var timer = null;

$(document).ready(() => {
  $("#datepicker1").val(today);
  $("#datepicker2").val(today);
  $.ajax({
    url: `/api/rack/outer-temp-date?rack_id=${rack_id}&start=${
      today_date.toISOString().split(".")[0]
    }&end=${tomorrow_date.toISOString().split(".")[0]}`,
    method: "GET",
    success: (data) => {
      outerTempChart.data.datasets[0].data = [];
      outerTempChart.data.datasets[1].data = [];
      outerTempChart.data.datasets[2].data = [];
      outerTempChart.data.datasets[3].data = [];
      var recent = [0, 0, 0, 0];
      console.log(data);
      data["data"].forEach((el) => {
        if (el["server_id"] == data["ids"][0]) {
          outerTempChart.data.datasets[0].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
          recent[0] = el["temperature"];
        }
        if (el["server_id"] == data["ids"][1]) {
          outerTempChart.data.datasets[1].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
          recent[1] = el["temperature"];
        }
        if (el["server_id"] == data["ids"][2]) {
          outerTempChart.data.datasets[2].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
          recent[2] = el["temperature"];
        }
        if (el["server_id"] == data["ids"][3]) {
          outerTempChart.data.datasets[3].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
          recent[3] = el["temperature"];
        }
      });
    },
  });
  $.ajax({
    url: `/api/rack/inner-temp-date?rack_id=${rack_id}&start=${
      today_date.toISOString().split(".")[0]
    }&end=${tomorrow_date.toISOString().split(".")[0]}`,
    method: "GET",
    success: (data) => {
      innerTempChart.data.datasets[0].data = [];
      innerTempChart.data.datasets[1].data = [];
      innerTempChart.data.datasets[2].data = [];
      innerTempChart.data.datasets[3].data = [];
      var recent = [0, 0, 0, 0];
      console.log(data);
      data["data"].forEach((el) => {
        if (el["server_id"] == data["ids"][0]) {
          innerTempChart.data.datasets[0].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
          recent[0] = el["temperature"];
        }
        if (el["server_id"] == data["ids"][1]) {
          innerTempChart.data.datasets[1].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
          recent[1] = el["temperature"];
        }
        if (el["server_id"] == data["ids"][2]) {
          innerTempChart.data.datasets[2].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
          recent[2] = el["temperature"];
        }
        if (el["server_id"] == data["ids"][3]) {
          innerTempChart.data.datasets[3].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
          recent[3] = el["temperature"];
        }
      });

      server1Chart.data.datasets[0].data = recent[0] != 0 ? [recent[0]] : [-1];
      server2Chart.data.datasets[0].data = recent[1] != 0 ? [recent[1]] : [-1];
      server3Chart.data.datasets[0].data = recent[2] != 0 ? [recent[2]] : [-1];
      server4Chart.data.datasets[0].data = recent[3] != 0 ? [recent[3]] : [-1];
      console.log(recent);
      outerTempChart.update();
      innerTempChart.update();
      server1Chart.update();
      server2Chart.update();
      server3Chart.update();
      server4Chart.update();
    },
    error: (e) => {
      console.log(e);
    },
  });
  $.ajax({
    url: `/api/rack/load-date?rack_id=${rack_id}&start=${
      today_date.toISOString().split(".")[0]
    }&end=${tomorrow_date.toISOString().split(".")[0]}`,
    method: "GET",
    success: (data) => {
      data["data"].forEach((el) => {
        if (el["server_id"] == data["ids"][0])
          loadChart.data.datasets[0].data.push({
            x: new Date(el["time"]),
            y: el["load"],
          });
        if (el["server_id"] == data["ids"][1])
          loadChart.data.datasets[1].data.push({
            x: new Date(el["time"]),
            y: el["load"],
          });
        if (el["server_id"] == data["ids"][2])
          loadChart.data.datasets[2].data.push({
            x: new Date(el["time"]),
            y: el["load"],
          });
        if (el["server_id"] == data["ids"][3])
          loadChart.data.datasets[3].data.push({
            x: new Date(el["time"]),
            y: el["load"],
          });

        console.log(el);
      });
      console.log(data);
      loadChart.update();
    },
    error: (e) => {
      console.log(e);
    },
  });

  timer = setInterval(updateData, 60000);
});

function next_rack() {
  rack_id == 2 ? (rack_id = 1) : (rack_id = 2);
  $("#rack-id").text(`Rack ${rack_id - 1}`);
  setData();
}

function setData() {
  var start = $("#datepicker1").val();
  var end = $("#datepicker2").val();

  if (start == "" || end == "") alert("Please select both of dates.");
  else {
    var start_day = new Date(start).toISOString().split(".")[0];
    var end_day = new Date(end);
    end_day.setDate(end_day.getDate() + 1);
    end_day = end_day.toISOString().split(".")[0];
    var recent = [0, 0, 0, 0];
    console.log(rack_id);
    $.ajax({
      url: `/api/rack/outer-temp-date?rack_id=${rack_id}&start=${start_day}&end=${end_day}`,
      method: "GET",
      success: (data) => {
        outerTempChart.data.datasets[0].data = [];
        outerTempChart.data.datasets[1].data = [];
        outerTempChart.data.datasets[2].data = [];
        outerTempChart.data.datasets[3].data = [];
        data["data"].forEach((el) => {
          if (el["server_id"] == data["ids"][0])
            outerTempChart.data.datasets[0].data.push({
              x: new Date(el["time"]),
              y: el["temperature"],
            });
          if (el["server_id"] == data["ids"][1])
            outerTempChart.data.datasets[1].data.push({
              x: new Date(el["time"]),
              y: el["temperature"],
            });
          if (el["server_id"] == data["ids"][2])
            outerTempChart.data.datasets[2].data.push({
              x: new Date(el["time"]),
              y: el["temperature"],
            });
          if (el["server_id"] == data["ids"][3])
            outerTempChart.data.datasets[3].data.push({
              x: new Date(el["time"]),
              y: el["temperature"],
            });
        });
        console.log(data);
        outerTempChart.update();
      },
      error: (e) => {
        console.log(e);
      },
    });

    $.ajax({
      url: `/api/rack/inner-temp-date?rack_id=${rack_id}&start=${start_day}&end=${end_day}`,
      method: "GET",
      success: (data) => {
        innerTempChart.data.datasets[0].data = [];
        innerTempChart.data.datasets[1].data = [];
        innerTempChart.data.datasets[2].data = [];
        innerTempChart.data.datasets[3].data = [];
        data["data"].forEach((el) => {
          if (el["server_id"] == data["ids"][0]) {
            innerTempChart.data.datasets[0].data.push({
              x: new Date(el["time"]),
              y: el["temperature"],
            });
            recent[0] = el["temperature"];
          }
          if (el["server_id"] == data["ids"][1]) {
            innerTempChart.data.datasets[1].data.push({
              x: new Date(el["time"]),
              y: el["temperature"],
            });
            recent[1] = el["temperature"];
          }
          if (el["server_id"] == data["ids"][2]) {
            innerTempChart.data.datasets[2].data.push({
              x: new Date(el["time"]),
              y: el["temperature"],
            });
            recent[2] = el["temperature"];
          }
          if (el["server_id"] == data["ids"][3]) {
            innerTempChart.data.datasets[3].data.push({
              x: new Date(el["time"]),
              y: el["temperature"],
            });
            recent[3] = el["temperature"];
          }
        });
        console.log(data);
        innerTempChart.update();

        server1Chart.data.datasets[0].data =
          recent[0] != 0 ? [recent[0]] : [-1];
        server2Chart.data.datasets[0].data =
          recent[1] != 0 ? [recent[1]] : [-1];
        server3Chart.data.datasets[0].data =
          recent[2] != 0 ? [recent[2]] : [-1];
        server4Chart.data.datasets[0].data =
          recent[3] != 0 ? [recent[3]] : [-1];
        server1Chart.update();
        server2Chart.update();
        server3Chart.update();
        server4Chart.update();
      },
      error: (e) => {
        console.log(e);
      },
    });
    $.ajax({
      url: `/api/rack/load-date?rack_id=${rack_id}&start=${start_day}&end=${end_day}`,
      method: "GET",
      success: (data) => {
        loadChart.data.datasets[0].data = [];
        loadChart.data.datasets[1].data = [];
        loadChart.data.datasets[2].data = [];
        loadChart.data.datasets[3].data = [];
        data["data"].forEach((el) => {
          if (el["server_id"] == data["ids"][0])
            loadChart.data.datasets[0].data.push({
              x: new Date(el["time"]),
              y: el["load"],
            });
          if (el["server_id"] == data["ids"][1])
            loadChart.data.datasets[1].data.push({
              x: new Date(el["time"]),
              y: el["load"],
            });
          if (el["server_id"] == data["ids"][2])
            loadChart.data.datasets[2].data.push({
              x: new Date(el["time"]),
              y: el["load"],
            });
          if (el["server_id"] == data["ids"][3])
            loadChart.data.datasets[3].data.push({
              x: new Date(el["time"]),
              y: el["load"],
            });
        });
        console.log(data);
        loadChart.update();
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}

function updateData() {
  if (
    outerTempChart.data.datasets[0].data[
      outerTempChart.data.datasets[0].data.length - 1
    ]
  )
    var outerTempStart = new Date(
      outerTempChart.data.datasets[0].data[
        outerTempChart.data.datasets[0].data.length - 1
      ]["x"] - offset
    );
  else var outerTempStart = new Date($("#datepicker1").val());

  if (
    innerTempChart.data.datasets[0].data[
      innerTempChart.data.datasets[0].data.length - 1
    ]
  )
    var innerTempStart = new Date(
      innerTempChart.data.datasets[0].data[
        innerTempChart.data.datasets[0].data.length - 1
      ]["x"] - offset
    );
  else var innerTempStart = new Date($("#datepicker1").val());

  if (
    loadChart.data.datasets[0].data[loadChart.data.datasets[0].data.length - 1]
  )
    var loadstart = new Date(
      loadChart.data.datasets[0].data[
        loadChart.data.datasets[0].data.length - 1
      ]["x"] - offset
    );
  else var loadstart = new Date($("#datepicker1").val());

  var end = new Date($("#datepicker2").val());

  outerTempStart.setSeconds(outerTempStart.getSeconds() + 30);
  innerTempStart.setSeconds(outerTempStart.getSeconds() + 30);
  loadstart.setSeconds(loadstart.getSeconds() + 30);
  end.setDate(end.getDate() + 1);
  var outer_temp_start_day = outerTempStart.toISOString().split(".")[0];
  var inner_temp_start_day = innerTempStart.toISOString().split(".")[0];
  var load_start_day = loadstart.toISOString().split(".")[0];
  var end_day = end.toISOString().split(".")[0];

  $.ajax({
    url: `/api/rack/outer-temp-date?rack_id=${rack_id}&start=${outer_temp_start_day}&end=${end_day}`,
    method: "GET",
    success: (data) => {
      data["data"].forEach((el) => {
        if (el["server_id"] == data["ids"][0])
          outerTempChart.data.datasets[0].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
        if (el["server_id"] == data["ids"][1])
          outerTempChart.data.datasets[1].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
        if (el["server_id"] == data["ids"][2])
          outerTempChart.data.datasets[2].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
        if (el["server_id"] == data["ids"][3])
          outerTempChart.data.datasets[3].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
      });
      console.log(data);
      outerTempChart.update();
    },
    error: (e) => {
      console.log(e);
    },
  });
  $.ajax({
    url: `/api/rack/inner-temp-date?rack_id=${rack_id}&start=${inner_temp_start_day}&end=${end_day}`,
    method: "GET",
    success: (data) => {
      data["data"].forEach((el) => {
        if (el["server_id"] == data["ids"][0])
          innerTempChart.data.datasets[0].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
        if (el["server_id"] == data["ids"][1])
          innerTempChart.data.datasets[1].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
        if (el["server_id"] == data["ids"][2])
          innerTempChart.data.datasets[2].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
        if (el["server_id"] == data["ids"][3])
          innerTempChart.data.datasets[3].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
      });
      console.log(data);
      innerTempChart.update();
    },
    error: (e) => {
      console.log(e);
    },
  });
  $.ajax({
    url: `/api/rack/load-date?rack_id=${rack_id}&start=${load_start_day}&end=${end_day}`,
    method: "GET",
    success: (data) => {
      data["data"].forEach((el) => {
        if (el["server_id"] == data["ids"][0])
          loadChart.data.datasets[0].data.push({
            x: new Date(el["time"]),
            y: el["load"],
          });
        if (el["server_id"] == data["ids"][1])
          loadChart.data.datasets[1].data.push({
            x: new Date(el["time"]),
            y: el["load"],
          });
        if (el["server_id"] == data["ids"][2])
          loadChart.data.datasets[2].data.push({
            x: new Date(el["time"]),
            y: el["load"],
          });
        if (el["server_id"] == data["ids"][3])
          loadChart.data.datasets[3].data.push({
            x: new Date(el["time"]),
            y: el["load"],
          });
      });
      console.log(data);
      loadChart.update();
    },
    error: (e) => {
      console.log(e);
    },
  });
}

function resetTemperature1() {
  // reload temperature chart
  innerTempChart.resetZoom();
}
function resetTemperature2() {
  // reload temperature chart
  outerTempChart.resetZoom();
}
function resetLoad() {
  // reload load chart
  loadChart.resetZoom();
}

// _________________________________ Chart Setting _________________________________

const server1Chartx = document.getElementById("server1");
const server2Chartx = document.getElementById("server2");
const server3Chartx = document.getElementById("server3");
const server4Chartx = document.getElementById("server4");
const innerTempChartx = document.getElementById("inner-temperature");
const outerTempChartx = document.getElementById("outer-temperature");
const loadChartx = document.getElementById("load");

var server1Chart = new Chart(server1Chartx, {
  type: "doughnut",
  data: {
    labels: [
      // 'Temperature',
    ],
    datasets: [
      {
        label: "Recent",
        data: [],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(255, 240, 240)"],
        hoverOffset: 4,
      },
    ],
  },
  options: {
    plugins: {},
  },
  plugins: [
    {
      id: "text",
      beforeDraw: function (chart, a, b) {
        var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;

        ctx.restore();
        var fontSize = (height / 120).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";

        var text = Math.round(chart.data.datasets[0].data * 10) / 10 + "°C",
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 1.9;

        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    },
  ],
});
var server2Chart = new Chart(server2Chartx, {
  type: "doughnut",
  data: {
    labels: [
      // 'Temperature',
    ],
    datasets: [
      {
        label: "Recent",
        data: [],
        backgroundColor: ["rgb(54, 162, 235)", "rgb(240, 250, 255)"],
        hoverOffset: 4,
      },
    ],
  },
  options: {
    plugins: {},
  },
  plugins: [
    {
      id: "text",
      beforeDraw: function (chart, a, b) {
        var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;

        ctx.restore();
        var fontSize = (height / 120).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";

        var text = Math.round(chart.data.datasets[0].data * 10) / 10 + "°C",
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 1.9;

        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    },
  ],
});
var server3Chart = new Chart(server3Chartx, {
  type: "doughnut",
  data: {
    labels: [
      // 'Temperature',
    ],
    datasets: [
      {
        label: "Recent",
        data: [],
        backgroundColor: ["rgb(173, 235, 47)", "rgb(243, 255, 227)"],
        hoverOffset: 4,
      },
    ],
  },
  options: {
    plugins: {},
  },
  plugins: [
    {
      id: "text",
      beforeDraw: function (chart, a, b) {
        var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;

        ctx.restore();
        var fontSize = (height / 120).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";

        var text = Math.round(chart.data.datasets[0].data * 10) / 10 + "°C",
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 1.9;

        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    },
  ],
});
var server4Chart = new Chart(server4Chartx, {
  type: "doughnut",
  data: {
    labels: [
      // 'Temperature',
    ],
    datasets: [
      {
        label: "Recent",
        data: [],
        backgroundColor: ["rgb(255, 240, 100)", "rgb(255, 250, 229)"],
        hoverOffset: 4,
      },
    ],
  },
  options: {
    plugins: {},
  },
  plugins: [
    {
      id: "text",
      beforeDraw: function (chart, a, b) {
        var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;

        ctx.restore();
        var fontSize = (height / 120).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";

        var text = Math.round(chart.data.datasets[0].data * 10) / 10 + "°C",
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 1.9;

        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    },
  ],
});

var innerTempChart = new Chart(innerTempChartx, {
  type: "line",
  data: {
    datasets: [
      {
        label: "Server 1",
        data: [],
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
        backgroundColor: "rgb(255, 240, 240, 25%)",
        fill: "start",
      },
      {
        label: "Server 2",
        data: [],
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
        backgroundColor: "rgb(240, 250, 255, 25%)",
        fill: "start",
      },
      {
        label: "Server 3",
        data: [],
        borderColor: "rgb(173, 255, 47)",
        borderWidth: 1,
        backgroundColor: "rgb(243, 255, 227, 25%)",
        fill: "start",
      },
      {
        label: "Server 4",
        data: [],
        borderColor: "rgb(255, 240, 100)",
        borderWidth: 1,
        backgroundColor: "rgb(255, 250, 229, 25%)",
        fill: "start",
      },
    ],
  },
  options: {
    scales: {
      x: {
        type: "time",
        ticks: {
          stepSize: 60,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },

    plugins: {
      tooltip: {
        enabled: true,
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          drag: {
            enabled: true,
          },
          mode: "xy",
        },
      },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
});

var outerTempChart = new Chart(outerTempChartx, {
  type: "line",
  data: {
    datasets: [
      {
        label: "Server 1",
        data: [],
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
        backgroundColor: "rgb(255, 240, 240, 25%)",
        fill: "start",
      },
      {
        label: "Server 2",
        data: [],
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
        backgroundColor: "rgb(240, 250, 255, 25%)",
        fill: "start",
      },
      {
        label: "Server 3",
        data: [],
        borderColor: "rgb(173, 255, 47)",
        borderWidth: 1,
        backgroundColor: "rgb(243, 255, 227, 25%)",
        fill: "start",
      },
      {
        label: "Server 4",
        data: [],
        borderColor: "rgb(255, 240, 100)",
        borderWidth: 1,
        backgroundColor: "rgb(255, 250, 229, 25%)",
        fill: "start",
      },
    ],
  },
  options: {
    scales: {
      x: {
        type: "time",
        ticks: {
          stepSize: 60,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },

    plugins: {
      tooltip: {
        enabled: true,
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          drag: {
            enabled: true,
          },
          mode: "xy",
        },
      },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
});

var loadChart = new Chart(loadChartx, {
  type: "line",
  data: {
    datasets: [
      {
        label: "Server 1",
        data: [],
        borderColor: "rgb(225, 69, 102)",
        borderWidth: 1,
        backgroundColor: "rgb(255, 240, 240, 35%)",
        fill: "start",
      },
      {
        label: "Server 2",
        data: [],
        borderColor: "rgb(24, 132, 205)",
        borderWidth: 1,
        backgroundColor: "rgb(240, 250, 255, 35%)",
        fill: "start",
      },
      {
        label: "Server 3",
        data: [],
        borderColor: "rgb(143, 225, 17)",
        borderWidth: 1,
        backgroundColor: "rgb(243, 255, 227, 35%)",
        fill: "start",
      },
      {
        label: "Server 2",
        data: [],
        borderColor: "rgb(225, 210, 70)",
        borderWidth: 1,
        backgroundColor: "rgb(255, 250, 229, 35%)",
        fill: "start",
      },
    ],
  },
  options: {
    scales: {
      x: {
        type: "time",
        ticks: {
          stepSize: 60,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },

    plugins: {
      tooltip: {
        enabled: true,
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          drag: {
            enabled: true,
          },
          mode: "xy",
        },
      },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
});
