function mvEnergy() {
  window.location.href = "/energy";
}
function mvServerTemperature() {
  window.location.href = "/server";
}
function mvcontainmentTemperature() {
  window.location.href = "/containment";
}
function mvHardware() {
  window.location.href = "/hardware";
}
// click outisde offcanvas
$(document).mouseup(function (e) {
  var containment = $("#sidebar");
  if (!containment.is(e.target) && containment.has(e.target).length === 0) {
    if ($("#sidebar").hasClass("active")) {
      $("#sidebar")[0].classList.toggle("active");
    }
  }
});
