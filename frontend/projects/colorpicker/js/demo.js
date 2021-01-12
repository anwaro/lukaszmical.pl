var output = document.querySelector("#rgb");
colorpicker("picker", function (el, color) {
    el.style.background = color;
    output.value = color;
});