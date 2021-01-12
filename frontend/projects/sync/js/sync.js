let width = 300;
let height = 300;
let angle = 0;
let dA = 1;
let canvas, ctx;


function init() {
    height = window.innerHeight;
    width = window.innerWidth;
    canvas = document.getElementById("sync");
    document.getElementById("speed")
        .addEventListener("change", (event) => {
            dA = parseFloat(event.target.value) * Math.PI;
        });
    canvas.width = width;
    canvas.height = height;
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        setInterval(loop, 50);
    }
}

function scroll(event) {

}

function loop() {
    angle += dA;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    ctx.save();

    ctx.translate(width / 2, height / 2);
    ctx.beginPath();
    ctx.rotate(angle);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "white";
    ctx.arc(0, 0, 300, 0, 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.arc(0, 0, 300, Math.PI, Math.PI + 0.2);
    ctx.stroke();
    ctx.restore();
}

init();
