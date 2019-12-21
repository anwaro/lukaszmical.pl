/* global SET, ENGINE */

/**
 *
 *    Skrypt rysujacy interfejs oreaz rezultat działania programu
 *
 *    Łukaz Micał
 *
 **/
var CANV = CANV || {};

CANV.init = function () {
    CANV.canv = document.getElementById("climatModel");
    CANV.all = document.getElementById("all");
    CANV.cont = document.getElementById("control");

    CANV.ctx = CANV.canv.getContext("2d");
};

CANV.draw = function () {
    CANV.ctx.clearRect(0, 0, SET.x, SET.y);
    CANV.drawStatElement();
    CANV.drawAtmosfer();
    ENGINE.cal();
};


CANV.drawStatElement = function () {
    for (var i = 0; i < SET.x + 60; i += 60) {
        CANV.ctx.drawImage(SET.img[SET.ground], i, SET.y - 47, 60, 47);
    }
    CANV.ctx.drawImage(SET.img[7], 0, -50, 300, 100);
};

CANV.drawAtmosfer = function () {
    var h = (400 - SET.nemStratum * 20 + 20) / SET.nemStratum,
        w = 0;

    CANV.drawArrowDown(50, 100 + 0.5 * h - 10, 80, 30, "yellow", SET.sun);
    CANV.drawArrowTop(3, 100 + 0.5 * h - 10, SET.x - 100, 50, "orange", SET.IR[0].przech + "%");

    for (var i = 0, k = 100; i < SET.nemStratum; i++, k += (h + 20)) {


        CANV.ctx.fillStyle = "rgba(228, 228, 228, 0.32)";
        CANV.ctx.beginPath();
        CANV.ctx.rect(0, k, SET.x, h);
        CANV.ctx.closePath();
        CANV.ctx.fill();

        for (var j = 0; j < 1e3; j++) {
            CANV.ctx.beginPath();
            CANV.ctx.arc(SET.ran[j + i] * SET.x, k + SET.ran[j + i + 1] * h, 1, 0, 2 * Math.PI, false);
            CANV.ctx.fillStyle = "rgba(76, 56, 218, 0.61)";
            CANV.ctx.fill();

        }
        var wid = 50 + ((i + 1) / SET.nemStratum) * 25;
        w += 1.1 * wid;
        if (i + 1 !== SET.nemStratum) {
            CANV.drawArrowDown(k + 0.5 * h, k + 1.5 * h, 80, 30 - 2 * i, "yellow", SET.Vis[i].przech + "%");
            CANV.drawArrowTop(k + 0.5 * h, k + 1.5 * h, SET.x - 100 - w, wid, "orange", SET.IR[i + 1].przech + "%");
            CANV.drawArrowDown(k + 0.5 * h, k + 1.5 * h, SET.x - 100 - w + 2 * wid, 20, "orange", ((SET.IR[i + 1].przech - SET.IR[i].przech) / 2).toFixed(2) + "%");
        } else {
            CANV.drawArrowDown(k + 0.5 * h, SET.y - 50, 80, 30 - 2 * i, "yellow", SET.Vis[i].przech + "%");
            CANV.drawArrowTop(k + 0.5 * h, SET.y - 30, SET.x - 100 - w, wid, "orange", "100%");
            CANV.drawArrowDown(k + 0.5 * h, SET.y - 30, SET.x - 100 - w + 2 * wid, 20, "orange", ((100 - SET.IR[i].przech) / 2).toFixed(2) + "%");
        }

    }
    CANV.drawArrowTop(50, SET.y - 130, 180, 25, "yellow", (100 - SET.Vis[SET.nemStratum - 1].przech).toFixed(2) + "%");
};


CANV.drawArrowDown = function (y1, y2, x, w, c, text) {
    CANV.ctx.beginPath();
    CANV.ctx.moveTo(x - w, y1);
    CANV.ctx.lineTo(x + w, y1);
    CANV.ctx.lineTo(x + w, y1 + 0.75 * (y2 - y1));
    CANV.ctx.lineTo(x + 2 * w, y1 + 0.75 * (y2 - y1));
    CANV.ctx.lineTo(x, y2);
    CANV.ctx.lineTo(x - 2 * w, y1 + 0.75 * (y2 - y1));
    CANV.ctx.lineTo(x - w, y1 + 0.75 * (y2 - y1));
    CANV.ctx.moveTo(x - w, y1);
    CANV.ctx.fillStyle = c;
    CANV.ctx.strokeStyle = c;
    CANV.ctx.fill();
    CANV.ctx.stroke();

    CANV.ctx.font = '16pt Calibri';
    CANV.ctx.fillStyle = 'black';
    CANV.ctx.textAlign = 'center';
    CANV.ctx.textBaseline = "top";
    CANV.ctx.fillText(text, x, y1);
};

CANV.drawArrowTop = function (y1, y2, x, w, c, text) {
    CANV.ctx.beginPath();
    CANV.ctx.moveTo(x - w, y2);
    CANV.ctx.lineTo(x + w, y2);
    CANV.ctx.lineTo(x + w, y2 - 0.75 * (y2 - y1));
    CANV.ctx.lineTo(x + 1.5 * w, y2 - 0.75 * (y2 - y1));
    CANV.ctx.lineTo(x, y1);
    CANV.ctx.lineTo(x - 1.5 * w, y2 - 0.75 * (y2 - y1));
    CANV.ctx.lineTo(x - w, y2 - 0.75 * (y2 - y1));
    CANV.ctx.moveTo(x - w, y2);
    CANV.ctx.fillStyle = c;
    CANV.ctx.strokeStyle = c;
    CANV.ctx.fill();
    CANV.ctx.stroke();

    CANV.ctx.font = '16pt Calibri';
    CANV.ctx.fillStyle = 'black';
    CANV.ctx.textAlign = 'center';
    CANV.ctx.textBaseline = "top";
    CANV.ctx.fillText(text, x, y1 + 10);
};