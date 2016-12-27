$(function () {
  var i = 0;
  $("input").on("change", function () {
    console.log(i);
    i++;
    var tag = `<mesh geometry="cube" position="${i * 2.2},0,0" color="${this.value}"/>`
    gr("#main")("mesh").append(tag);
  });
});