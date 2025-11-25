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

var start_day = new Date(today);
var end_day = new Date(today);
end_day.setDate(day.getDate() + 1);

const offset = new Date().getTimezoneOffset() * 60000;

var timer = null;

$(document).ready(() => {
  $("#datepicker1").val(today);
  $("#datepicker2").val(today);
  $.ajax({
    url: `/api/containment/temp-date?start=${
      start_day.toISOString().split(".")[0]
    }&end=${end_day.toISOString().split(".")[0]}`,
    method: "GET",
    success: (data) => {
      var recent = [0, 0];
      data.forEach((el) => {
        if (el["containment_id"] == 1) {
          tempChart.data.datasets[0].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
          recent[0] = el["temperature"];
        } else {
          tempChart.data.datasets[1].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
          recent[1] = el["temperature"];
        }
        console.log(el);
      });
      containment1Chart.data.datasets[0].data =
        recent[0] != 0 ? [recent[0]] : [-1];
      containment2Chart.data.datasets[0].data =
        recent[1] != 0 ? [recent[1]] : [-1];
      tempChart.update();
      containment1Chart.update();
      containment2Chart.update();
    },
  });
  timer = setInterval(updateData, 60000);
});

function setData() {
  var start = $("#datepicker1").val();
  var end = $("#datepicker2").val();

  if (start == "" || end == "") alert("Please select both of dates.");
  else {
    var start_day = new Date(start).toISOString().split(".")[0];
    var end_day = new Date(end);
    end_day.setDate(end_day.getDate() + 1);
    end_day = end_day.toISOString().split(".")[0];
    $.ajax({
      url: `/api/containment/temp-date?start=${start_day}&end=${end_day}`,
      method: "GET",
      success: (data) => {
        tempChart.data.datasets[0].data = [];
        tempChart.data.datasets[1].data = [];
        var recent = [0, 0];
        data.forEach((el) => {
          if (el["containment_id"] == 1) {
            tempChart.data.datasets[0].data.push({
              x: new Date(el["time"]),
              y: el["temperature"],
            });
            recent[0] = el["temperature"];
          } else {
            tempChart.data.datasets[1].data.push({
              x: new Date(el["time"]),
              y: el["temperature"],
            });
            recent[1] = el["temperature"];
          }
        });
        containment1Chart.data.datasets[0].data =
          recent[0] != 0 ? [recent[0]] : [-1];
        containment2Chart.data.datasets[0].data =
          recent[1] != 0 ? [recent[1]] : [-1];
        tempChart.update();
        containment1Chart.update();
        containment2Chart.update();
      },
    });
  }
}

function updateData() {
  if (
    tempChart.data.datasets[0].data[tempChart.data.datasets[0].data.length - 1]
  )
    var start = new Date(
      tempChart.data.datasets[0].data[
        tempChart.data.datasets[0].data.length - 1
      ]["x"] - offset
    );
  else var start = new Date($("#datepicker1").val());
  var end = new Date($("#datepicker2").val());

  console.log(start);

  start.setSeconds(start.getSeconds() + 30);
  end.setDate(end.getDate() + 1);

  var start_day = start.toISOString().split(".")[0];
  var end_day = end.toISOString().split(".")[0];
  $.ajax({
    url: `/api/containment/temp-date?start=${start_day}&end=${end_day}`,
    method: "GET",
    success: (data) => {
      data.forEach((el) => {
        if (el["containment_id"] == 1) {
          tempChart.data.datasets[0].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
        } else {
          tempChart.data.datasets[1].data.push({
            x: new Date(el["time"]),
            y: el["temperature"],
          });
        }
      });
      tempChart.update();
    },
    error: (e) => {
      console.log(e);
    },
  });
}

function resetTemp() {
  // reload load chart
  tempChart.resetZoom();
}

var server_id = 1;
const containment1Chartx = document.getElementById("containment1");
const containment2Chartx = document.getElementById("containment2");
const tempChartx = document.getElementById("temperature");

var containment1Chart = new Chart(containment1Chartx, {
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
var containment2Chart = new Chart(containment2Chartx, {
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

var tempChart = new Chart(tempChartx, {
  type: "line",
  data: {
    datasets: [
      {
        label: "containment 1",
        data: [],
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
        backgroundColor: "rgb(255, 240, 240, 25%)",
        fill: "start",
      },
      {
        label: "containment 2",
        data: [],
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
        backgroundColor: "rgb(240, 250, 255, 25%)",
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
