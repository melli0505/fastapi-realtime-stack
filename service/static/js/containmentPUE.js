function resetPUE() {
  // reload PUE chart
  pueChart.resetZoom();
}
function resetVolt() {
  // reload voltage chart
  voltChart.resetZoom();
}
function resetCurrent() {
  // reload current chart
  curChart.resetZoom();
}
function resetPower() {
  // reload power chart
  pwrChart.resetZoom();
}
function resetPF() {
  // reload pf chart
  pfChart.resetZoom();
}

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

const offset = new Date().getTimezoneOffset() * 60000;

var timer = null;

$(document).ready(() => {
  $("#datepicker1").val(today);
  $("#datepicker2").val(today);
  var start_day = new Date(today);
  var end_day = new Date(today);
  end_day.setDate(day.getDate() + 1);
  $.ajax({
    url:
      "/api/containment/pue-date?start=" +
      start_day.toISOString().split(".")[0] +
      "&end=" +
      end_day.toISOString().split(".")[0],
    method: "GET",
    success: (data) => {
      data.forEach((el) => {
        voltChart.data.datasets[0].data.push({
          x: new Date(el["time"]),
          y: el["voltage"],
        });
        curChart.data.datasets[0].data.push({
          x: new Date(el["time"]),
          y: el["current"],
        });
        pwrChart.data.datasets[0].data.push({
          x: new Date(el["time"]),
          y: el["power"],
        });
        pueChart.data.datasets[0].data.push({
          x: new Date(el["time"]),
          y: el["energy"],
        });
        pfChart.data.datasets[0].data.push({
          x: new Date(el["time"]),
          y: el["pf"],
        });
      });
      console.log(data);
      pueChart.update();
      curChart.update();
      voltChart.update();
      pwrChart.update();
      pfChart.update();
    },
    error: (e) => {
      console.log(e);
    },
  });

  var con1 = [0, 0];
  var con2 = [0, 0];
  $.ajax({
    url: "/api/containment/pue-compare",
    method: "GET",
    success: (data) => {
      data.forEach((el) => {
        if (el["con_id"] == 1) {
          if (el["date"] == today)
            con1[1] = el["last_energy"] - el["first_energy"];
          else con1[0] = el["last_energy"] - el["first_energy"];
        } else {
          if (el["date"] == today)
            con2[1] = el["last_energy"] - el["first_energy"];
          else con2[0] = el["last_energy"] - el["first_energy"];
        }
      });
      console.log(con1, con2);
      conChart1.data.datasets[0].data = con1;
      conChart2.data.datasets[0].data = con2;

      conChart1.update();
      conChart2.update();
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
    console.log(end_day);

    $.ajax({
      url: "/api/containment/pue-date?start=" + start_day + "&end=" + end_day,
      method: "GET",
      success: (data) => {
        voltChart.data.datasets[0].data = [];
        curChart.data.datasets[0].data = [];
        pwrChart.data.datasets[0].data = [];
        pueChart.data.datasets[0].data = [];
        pfChart.data.datasets[0].data = [];
        data.forEach((el) => {
          voltChart.data.datasets[0].data.push({
            x: new Date(el["time"]),
            y: el["voltage"],
          });
          curChart.data.datasets[0].data.push({
            x: new Date(el["time"]),
            y: el["current"],
          });
          pwrChart.data.datasets[0].data.push({
            x: new Date(el["time"]),
            y: el["power"],
          });
          pueChart.data.datasets[0].data.push({
            x: new Date(el["time"]),
            y: el["energy"],
          });
          pfChart.data.datasets[0].data.push({
            x: new Date(el["time"]),
            y: el["pf"],
          });
        });
        console.log(data);
        pueChart.update();
        curChart.update();
        voltChart.update();
        pwrChart.update();
        pfChart.update();
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}

function updateData() {
  if (pueChart.data.datasets[0].data[pueChart.data.datasets[0].data.length - 1])
    var start = new Date(
      pueChart.data.datasets[0].data[pueChart.data.datasets[0].data.length - 1][
        "x"
      ] - offset
    );
  else var start = new Date($("#datepicker1").val());
  var end = new Date($("#datepicker2").val());

  console.log(start);

  start.setSeconds(start.getSeconds() + 30);
  end.setDate(end.getDate() + 1);

  var start_day = start.toISOString().split(".")[0];
  var end_day = end.toISOString().split(".")[0];

  $.ajax({
    url: "/api/containment/pue-date?start=" + start_day + "&end=" + end_day,
    method: "GET",
    success: (data) => {
      data.forEach((el) => {
        voltChart.data.datasets[0].data.push({
          x: new Date(el["time"]),
          y: el["voltage"],
        });
        curChart.data.datasets[0].data.push({
          x: new Date(el["time"]),
          y: el["current"],
        });
        pwrChart.data.datasets[0].data.push({
          x: new Date(el["time"]),
          y: el["power"],
        });
        pueChart.data.datasets[0].data.push({
          x: new Date(el["time"]),
          y: el["energy"],
        });
        pfChart.data.datasets[0].data.push({
          x: new Date(el["time"]),
          y: el["pf"],
        });
      });
      console.log(data);
      pueChart.update();
      curChart.update();
      voltChart.update();
      pwrChart.update();
      pfChart.update();
    },
    error: (e) => {
      console.log(e);
    },
  });
}

const con1Chartx = document.getElementById("containment1");
const con2Chartx = document.getElementById("containment2");
const pueChartx = document.getElementById("pueChart");
const voltChartx = document.getElementById("voltageChart");
const curChartx = document.getElementById("currentChart");
const pwrChartx = document.getElementById("powerChart");
const pfChartx = document.getElementById("pfChart");

var conChart1 = new Chart(con1Chartx, {
  type: "bar",
  data: {
    labels: ["Yesterday", "Today"],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: ["rgb(255, 240, 240)", "rgb(255, 99, 132)"],
        hoverOffset: 4,
      },
    ],
  },
  options: {
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
    },
  },
});

var conChart2 = new Chart(con2Chartx, {
  type: "bar",
  data: {
    labels: ["Yesterday", "Today"],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: ["rgb(240, 250, 255)", "rgb(54, 162, 235)"],
        hoverOffset: 4,
      },
    ],
  },
  options: {
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
    },
  },
});

var pueChart = new Chart(pueChartx, {
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
          stepSize: 5,
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
});

var voltChart = new Chart(voltChartx, {
  type: "line",
  data: {
    labels: [],
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
          stepSize: 300,
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
});

var curChart = new Chart(curChartx, {
  type: "line",
  data: {
    labels: [],
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
          stepSize: 5,
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
});

var pwrChart = new Chart(pwrChartx, {
  type: "line",
  data: {
    labels: [],
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
          stepSize: 5,
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
});

var pfChart = new Chart(pfChartx, {
  type: "line",
  data: {
    labels: [],
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
          stepSize: 5,
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
});
