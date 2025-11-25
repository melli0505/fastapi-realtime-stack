function toggleSidebar() {
  console.log($("#sidebar").hasClass("active"));
  if ($("#sidebar").hasClass("active") == true) {
    $("#sidebar")[0].classList.remove("active");
  } else {
    $("#sidebar")[0].toggleClass("active");
  }
}

function l1OnClick() {
  var server1 = $("#l1-s1").val();
  var server2 = $("#l1-s2").val();
  var server3 = $("#l1-s3").val();
  var server4 = $("#l1-s4").val();

  $.ajax({
    method: "GET",
    url: `/api/data/load-rack1?s1=${server1}&s2=${server2}&s3=${server3}&s4=${server4}`,
    success: {},
    error: (e) => {
      console.log(e);
    },
  });
}

function l2OnClick() {
  var server1 = $("#l2-s1").val();
  var server2 = $("#l2-s2").val();
  var server3 = $("#l2-s3").val();
  var server4 = $("#l2-s4").val();

  $.ajax({
    method: "GET",
    url: `/api/data/load-rack2?s1=${server1}&s2=${server2}&s3=${server3}&s4=${server4}`,
    success: {},
    error: (e) => {
      console.log(e);
    },
  });
}

function f1OnClick() {
  var server1 = $("#f1-s1").val();
  var server2 = $("#f1-s2").val();
  var server3 = $("#f1-s3").val();
  var server4 = $("#f1-s4").val();

  $.ajax({
    method: "GET",
    url: `/api/data/fan-rack1?s1=${server1}&s2=${server2}&s3=${server3}&s4=${server4}`,
    success: {},
    error: (e) => {
      console.log(e);
    },
  });
}

function f2OnClick() {
  var server1 = $("#f2-s1").val();
  var server2 = $("#f2-s2").val();
  var server3 = $("#f2-s3").val();
  var server4 = $("#f2-s4").val();

  $.ajax({
    method: "GET",
    url: `/api/data/fan-rack2?s1=${server1}&s2=${server2}&s3=${server3}&s4=${server4}`,
    success: {},
    error: (e) => {
      console.log(e);
    },
  });
}

function pumpOnClick() {
  var speed = $("#pump").val();

  $.ajax({
    method: "GET",
    url: `/api/data/water-pump?speed=${speed}`,
    success: {},
    error: (e) => {
      console.log(e);
    },
  });
}

function compressorOnClick() {
  var speed = $("#compressor").val();

  $.ajax({
    method: "GET",
    url: `/api/data/water-compressor?speed=${speed}`,
    success: {},
    error: (e) => {
      console.log(e);
    },
  });
}
