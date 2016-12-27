$(function () {
    var count = 0;
    $("input").on("change", function () {
        count++;
        var tag = `<mesh geometry="cube" position="${count * 2.2},0,0" color="${this.value}"/>`;
        gr("#main")("mesh").first().append(tag);
    });
})