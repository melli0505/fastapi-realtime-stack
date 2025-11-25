$("#datepicker1").datepicker({
  language: "ko",
  autoClose: true,
  format: "Y/m/d",
  todayHighlight: true,
  onSelect: function (dateText) {
    var after = $("#datepicker2").val();
    if (after != "") {
      if (new Date(dateText) > new Date(after)) {
        alert("Invalid period");
        $("#datepicker1").val("");
      }
    }
    console.log("datepicker selected");
    console.log(dateText);
  },
});
$("#datepicker2").datepicker({
  language: "ko",
  autoClose: true,
  format: "Y/m/d",
  todayHighlight: true,
  onSelect: function (dateText) {
    var before = $("#datepicker1").val();
    if (before != "") {
      if (new Date(dateText) < new Date(before)) {
        alert("Invalid period");
        $("#datepicker2").val("");
      }
    }
    console.log("datepicker selected");
    console.log(dateText);
  },
});
