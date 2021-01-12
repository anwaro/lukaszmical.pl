M = {};

S = {
    hAxis: 30, h0: 0,
    vAxis: 30, v0: 0,
    dval_x: 30, dx_px: 30,
    dval_y: 30, dy_px: 30,
    fun: "x",
    xmin: 0, xmax: 10,
    ymin: 3e8, ymax: -3e8,
    gradY: 10, gradX: 10,
    mar_x: 70, mar_y: 50,
    o_x: " ", o_y: " "
};

C = {};



M.init = function () {
    document.getElementById("draw").onclick = function () {

        var x = parseInt(document.getElementById("x").value),
            y = parseInt(document.getElementById("y").value);

        S.x = C.canv.width = x < 300 ? 300 : (x > 1500 ? 1500 : x);
        S.y = C.canv.height = y < 300 ? 300 : (y > 1500 ? 1500 : y);

        C.ctx.clearRect(0, 0, S.x, S.y);

        S.fun = M.preperFunction(document.getElementById("function").value);
        var min = parseFloat(document.getElementById("xmin").value.replace(",", ".")),
            max = parseFloat(document.getElementById("xmax").value.replace(",", ".")),
            g_x = parseInt(document.getElementById("g_x").value),
            g_y = parseInt(document.getElementById("g_y").value),
            m_x = parseInt(document.getElementById("m_x").value),
            m_y = parseInt(document.getElementById("m_y").value);

        if (max < min) {
            min = 0;
            max = 10;
        }
        S.xmin = min;
        S.xmax = max;

        S.gradX = g_x < 3 ? 3 : (g_x > 20 ? 20 : g_x);
        S.gradY = g_y < 3 ? 3 : (g_y > 20 ? 20 : g_y);

        S.mar_x = m_x < 50 ? 50 : (m_x > 100 ? 100 : m_x);
        S.mar_y = m_y < 50 ? 50 : (m_y > 100 ? 100 : m_y);

        S.ymin = 3e8;
        S.ymax = -3e8;


        S.o_x = document.getElementById("o_x").value;
        S.o_y = document.getElementById("o_y").value;

        M.draw();
    };
    C.canv = document.getElementById("mathCanvas");
    S.y = C.canv.height = 500;
    S.x = C.canv.width = 600;
    S.hAxis = S.y - 30;
    C.canv.style.backgroundColor = "silver";

    C.ctx = C.canv.getContext("2d");
    M.draw();
};

M.draw = function () {


    M.fun();
    M.axis(3, S.x - 20, S.hAxis, "h");
    M.axis(20, S.y - 3, S.vAxis, "v");

    M.writeInfoAxis();
    M.drawFunction();

    document.getElementById("down").href = C.canv.toDataURL();
};


M.axis = function (p1, p2, z, hor) {
    C.ctx.beginPath();
    C.ctx.fillStyle = "black";
    C.ctx.strokeStyle = "black";
    C.ctx.lineWidth = 0.5;

    if (hor === "h") {
        C.ctx.moveTo(p1, z);
        C.ctx.lineTo(p2, z);

        C.ctx.moveTo(p2, z + 4);
        C.ctx.lineTo(p2 + 6, z);
        C.ctx.lineTo(p2, z - 4);
        C.ctx.lineTo(p2, z + 4);
        C.ctx.stroke();
    } else {
        C.ctx.moveTo(z, p1);
        C.ctx.lineTo(z, p2);
        C.ctx.moveTo(z + 4, p1);
        C.ctx.lineTo(z, p1 - 6);
        C.ctx.lineTo(z - 4, p1);
        C.ctx.lineTo(z + 4, p1);
        C.ctx.stroke();
    }
};

M.fun = function () {

    var l = S.xmax - S.xmin;

    S.dval_x = l / S.gradX;

    var lx = S.x - S.mar_x;

    S.kx = lx / l;

    S.dx_px = (lx * S.dval_x) / l;

    if (S.xmax > 0 && S.xmin > 0) {
        S.vAxis = S.mar_x;
        S.v0 = S.xmin;
        S.poss0X = S.vAxis - S.xmin * S.dx_px
    } else if (S.xmax < 0 && S.xmin < 0) {
        S.vAxis = S.mar_x;
        S.v0 = S.xmax;
        S.poss0X = S.vAxis - S.xmax * S.dx_px
    } else {
        S.poss0X = S.vAxis = Math.abs((S.xmin / l) * (S.x - 2 * S.mar_x)) + S.mar_x;
        S.v0 = 0;
    }

    /////////////////////////////////////////////////

    var val, arr = [];


    for (var x = S.xmin; x <= S.xmax; x += 0.001 * Math.abs(S.xmax - S.xmin)) {
        try {
            val = eval(S.fun);
            if (val > 1e11) throw "Too large number";
            if (val < -1e11) throw "Too small number";
            if (S.ymax < val) S.ymax = val;
            if (S.ymin > val) S.ymin = val;
        } catch (err) {
            console.log(err);
        }
    }

    var ly = S.y - 2 * S.mar_y;

    l = S.ymax - S.ymin;

    S.dval_y = l / S.gradY;


    S.ky = ly / l;
    S.dy_px = (ly * S.dval_y) / l;


    if (S.ymax > 0 && S.ymin > 0) {
        S.hAxis = S.y - S.mar_y;
        S.h0 = S.ymin;
        S.poss0Y = S.hAxis + S.ymin * S.dy_px
    } else if (S.ymax < 0 && S.ymin < 0) {
        S.hAxis = S.mar_y;
        S.h0 = S.ymax;
        S.poss0Y = S.hAxis + S.ymax * S.dy_px
    } else {
        S.poss0Y = S.hAxis = (S.ymax / l) * (S.y - 2 * S.mar_y) + S.mar_y;
        S.h0 = 0;
    }

    M.grad("h");
    M.grad("v");

};

M.drawFunction = function () {
    var possX = S.mar_x + (S.xmin - 10 - S.xmin) * S.kx,
        x = S.xmin;

    var possY = S.mar_y + (S.ymax - eval(S.fun)) * S.ky;

    C.ctx.beginPath();
    C.ctx.fillStyle = "blue";
    C.ctx.strokeStyle = "blue";
    C.lineWidth = 0.5;

    C.ctx.moveTo(possX, possY);
    for (var x = S.xmin - 10; x <= S.xmax + 5; x += 0.001 * Math.abs(S.xmax - S.xmin)) {
        try {
            if (eval(S.fun) > 1e11) throw "Too large value";
            if (eval(S.fun) < -1e11) throw "Too small value";

            possX = S.mar_x + (x - S.xmin) * S.kx;

            possY = S.mar_y + (S.ymax - eval(S.fun)) * S.ky;
            //console.log(x+" "+eval(S.fun));
            C.ctx.lineTo(possX, possY);
        } catch (err) {
            console.log(err);
        }
    }
    C.ctx.stroke();

};

M.preperFunction = function (fun) {
    var fun_nam = {
        "abs": "Math.abs",
        "acos": "Math.acos",
        "asin": "Math.asin",
        "atan": "Math.atan",
        "atan2": "Math.atan2",
        "cos": "Math.cos",
        "exp": "Math.exp",
        "floor": "Math.floor",
        "log": "Math.log",
        "pow": "Math.pow",
        "rand": "Math.random()",
        "round": "Math.round",
        "sin": "Math.sin",
        "sqrt": "Math.sqrt",
        "tan": "Math.tan",
        "PI": "Math.PI",
        "pi": "Math.PI",
        "Pi": "Math.PI"
    };
    for (var key in fun_nam) {
        var re = new RegExp(key, 'g');
        fun = fun.replace(re, fun_nam[key]);
    }
    return fun;
};


M.grad = function (type) {
    C.ctx.beginPath();
    C.ctx.fillStyle = "black";
    C.ctx.strokeStyle = "black";
    C.ctx.font = '10pt Calibri';
    C.ctx.fillStyle = 'black';
    C.lineWidth = 0.5;
    if (type === "h") {
        var dt = S.dval_x,
            pdl = S.dx_px;
        C.ctx.textAlign = 'center';
        C.ctx.textBaseline = "top";
        for (var i = S.vAxis + pdl, t = S.v0 + dt; i < S.x - 20; i += pdl) {
            C.ctx.moveTo(i, S.hAxis - 5);
            C.ctx.lineTo(i, S.hAxis + 5);
            C.ctx.stroke();
            C.ctx.fillText(M.fN(t, dt), i, S.hAxis + 12);
            t += dt;
        }
        for (var i = S.vAxis - pdl, t = -(S.v0 + dt); i > 0; i -= pdl) {
            C.ctx.moveTo(i, S.hAxis - 5);
            C.ctx.lineTo(i, S.hAxis + 5);
            C.ctx.stroke();
            C.ctx.fillText(-1 * M.fN(-t, dt), i, S.hAxis + 12);
            t -= dt;
        }
    } else {
        var dt = S.dval_y,
            pdl = S.dy_px;
        C.ctx.textAlign = 'end';
        C.ctx.textBaseline = "middle";
        for (var i = S.hAxis + pdl, t = Math.abs(S.h0) + dt; i < S.y; i += pdl) {
            C.ctx.moveTo(S.vAxis - 5, i);
            C.ctx.lineTo(S.vAxis + 5, i);
            C.ctx.stroke();
            C.ctx.fillText(-1 * M.fN(t, dt), S.vAxis - 12, i);
            t += dt;
        }
        for (var i = S.hAxis - pdl, t = -(S.h0 + dt); i > 20; i -= pdl) {
            C.ctx.moveTo(S.vAxis - 5, i);
            C.ctx.lineTo(S.vAxis + 5, i);
            C.ctx.stroke();
            C.ctx.fillText(M.fN(-t, dt), S.vAxis - 12, i);
            t -= dt;
        }
    }
};

M.fN = function (l, t) {
    if (t >= 0.1) return l.toFixed(2);
    else {
        var k = 0,
            copy = l;
        while (k < 18) {
            copy *= 10;
            k++;
            if (copy > 1) {
                if (10 * copy - 10 * Math.floor(copy) < 5) return l.toFixed(k);
                else {
                    var licz = 0;
                    while (Math.round(10 * copy) == 10 * Math.round(copy)) {
                        copy *= 10;
                        k++;
                    }
                    return l.toFixed(k + 2);
                }
            }
        }
        return l.toFixed(k + 2);
    }
};

M.writeInfoAxis = function () {
    C.ctx.font = '14pt Calibri';
    C.ctx.fillStyle = 'black';
    C.ctx.textAlign = 'center';
    C.ctx.textBaseline = "top";

    C.ctx.fillText(S.o_x, S.x / 2, S.hAxis + 25);

    C.ctx.save();
    //C.ctx.translate(0, S.y);
    C.ctx.rotate(-Math.PI / 2);
    C.ctx.textAlign = "center";
    C.ctx.fillText(S.o_y, -S.y / 2, 3);
    C.ctx.restore();
};


M.init();

