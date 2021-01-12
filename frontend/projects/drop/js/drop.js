var canvas;
var ctx;

var winX;
var winY;

function init() {
    canvas = document.getElementById('drop');
    resize();
    ctx = canvas.getContext('2d');
    requestAnimationFrame(draw);
}

function draw() {
    requestAnimationFrame(draw);
    ctx.fillStyle = "#4d9dff";
    ctx.fillRect(0, 0, winX+1, winY+1)
}

function resize() {
    canvas.width = winX = window.innerWidth;
    canvas.height = winY = window.innerHeight;
}









