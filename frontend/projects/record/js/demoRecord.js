/* global $$ */


var canvasWidth = 700,
    canvasHeight = 500;

var canvasP,
    ctxP,
    mouseX = canvasWidth / 2,
    mouseY = canvasHeight / 2,
    num = 20,
    r = 5,
    f = 0.8,
    planets = [];

function planet() {
    canvasP = document.getElementById("planet");
    canvasP.height = canvasHeight;
    canvasP.width = canvasWidth;
    canvasP.addEventListener("mousemove", mousePoss);
    prepareP();
    if (canvasP && canvasP.getContext) {
        ctxP = canvasP.getContext("2d");
        ctxP.fillStyle = "rgb(0, 0, 0)";
        ctxP.fillRect(0, 0, canvasWidth, canvasHeight);

        setInterval(drawP, 1000 / 60);

    }

}

function mousePoss(evt) {
    var rect = canvasP.getBoundingClientRect();
    mouseX = evt.clientX - rect.left;
    mouseY = evt.clientY - rect.top;
}

function drawP() {
    ctxP.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctxP.fillRect(0, 0, canvasWidth, canvasHeight);

    ctxP.beginPath();
    ctxP.fillStyle = "#17B70E";
    ctxP.arc(mouseX, mouseY, 1, 0, 2 * Math.PI);
    ctxP.fill();
    for (var i = 0; i < num; i++) {
        ctxP.beginPath();
        ctxP.fillStyle = planets[i].color;
        ctxP.arc(planets[i].poss.x, planets[i].poss.y, planets[i].r, 0, 2 * Math.PI);
        ctxP.fill();

        /*
         *  Gravitation
         */
        planets[i].v.y += 9.81 * 0.01;

        /*
         *  Mouse force
         */
        var force = getForce(planets[i]);

        planets[i].v.x += force.x;
        planets[i].v.y += force.y;

        /*
         * Collision with border
         */

        if (planets[i].poss.x - planets[i].r + planets[i].v.x <= 0 || planets[i].poss.x + planets[i].r + planets[i].v.x >= canvasWidth)
            planets[i].v.x *= -f;
        if (planets[i].poss.y - planets[i].r + planets[i].v.y <= 0 || planets[i].poss.y + planets[i].r + planets[i].v.y >= canvasHeight)
            planets[i].v.y *= -f;

        /*
         *  Change possition
         */
        planets[i].poss.x += planets[i].v.x;
        planets[i].poss.y += planets[i].v.y;

    }
}

function getForce(p) {
    var r = distance(p.poss, {x: mouseX, y: mouseY});
    var force = -0.15 / r * r;
    return {x: force * (p.poss.x - mouseX) / r, y: force * (p.poss.y - mouseY) / r};
}

function distance(a, b) {
    if (typeof a === "object" && typeof b === "object") {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    } else {
        return Math.abs(a - b);
    }
}


function prepareP() {
    for (var i = 0; i < num; i++) {
        planets.push(new Planet(
            rand(2 * r, canvasWidth) + r,
            rand(2 * r, canvasHeight) + r,
            "rgb(" + int(rand(255))
            + ", " + int(rand(255))
            + ", " + int(rand(255)) + ")",
            r
        ));
    }
}

function int(val) {
    return parseInt(val);
}

function rand(start, stop) {
    if (typeof stop === "undefined") {
        stop = start;
        start = 0;
    }
    return Math.random() * (stop - start) + start;
}

function Planet(x, y, color, r) {
    this.poss = new Point(x, y);
    this.v = new Point(rand(1, 3), rand(1, 3));
    this.r = r;
    this.color = color;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}


planet();