$math = new function () {

    var canvas, ctx,
        fun, data = [],
        stringFile = "",
        x, y,
        labelActive = true,
        scrollActive = false,
        lineActive = false,
        pointActive = true,
        minX, maxX, stepX, labX = 0,
        minY, maxY, stepY, labY = 0,
        descx, descy, margin = 40,
        mouseX, mouseY,
        label = false,
        proces = false,
        dataType = "fun",
        sepPoint = ";",
        sepXY = ","
    ;

    this.init = function () {
        canvas = document.querySelector("#mathCanvas");
        if (!canvas) {
            return;
        }
        canvas.height = 500;
        canvas.width = 600;
        ctx = canvas.getContext("2d");
        document.getElementById("draw").addEventListener("click", draw);
        canvas.addEventListener("mousemove", mousePossition);
        canvas.addEventListener("mouseover", function () {
            label = true;
        });
        canvas.addEventListener("mouseleave", function () {
            label = false;
        });
        intMathCode();
        canvas.addEventListener("wheel", scrollCanv);
        document.getElementById("data-function").addEventListener("change", changeData);
        document.getElementById("data-file").addEventListener("change", changeData);
        document.getElementById("file").addEventListener("change", loadData);
        document.getElementById("label").addEventListener('change', changeActive);
        document.getElementById("scroll").addEventListener('change', changeActive);
        document.getElementById("point").addEventListener('change', changeActive);
        document.getElementById("line").addEventListener('change', changeActive);
        draw();
        setInterval(drawLabel, 1000 / 30);
    };


    function changeActive() {
        labelActive = document.getElementById("label").checked;
        scrollActive = document.getElementById("scroll").checked;
        pointActive = document.getElementById("point").checked;
        lineActive = document.getElementById("line").checked;
        setTimeout(draw, 10);
    }

    function intMathCode() {
        var input = document.getElementById('function');
        var parent = input.parentNode;
        mathcode(input, parent);
    }

    function changeData() {
        var file1 = document.querySelector(".d-file1"),
            file2 = document.querySelector(".d-file2"),
            fun1 = document.querySelector(".d-fun1"),
            fun2 = document.querySelector(".d-fun2"),
            fun3 = document.querySelector(".d-fun3");
        if (file1.classList.contains("off")) {
            fun1.classList.add("off");
            fun2.classList.add("off");
            fun3.classList.add("off");
            file1.classList.remove("off");
            file2.classList.remove("off");
            dataType = "file";
            proces = true;
        } else {
            file1.classList.add("off");
            file2.classList.add("off");
            fun1.classList.remove("off");
            fun2.classList.remove("off");
            fun3.classList.remove("off");
            dataType = "fun";
            proces = false;
        }
    }

    function drawLabel() {
        ctx.clearRect(0, 0, x, y);
        if (label && !proces && labelActive) {
            var width = x - 2 * margin,
                height = y - 2 * margin,
                dX = width / (maxX - minX),
                dY = height / (maxY - minY);


            var valX = (mouseX - margin) / dX + minX;
            var valY = getFunctionValue(valX);

            var labelX = "x: " + fixNumber(valX, stepX / 10);
            var labelY = "y: " + fixNumber(valY, stepY / 10);

            var size = (labelX.length > labelY.length ? labelX.length + 2 : labelY.length + 2) * 10;

            var posX = margin + (valX - minX) * dX;
            var posY = margin + (maxY - valY) * dY;

            labX += (posX - labX) * 0.15;
            labY += (posY - labY) * 0.15;

            labX = isNaN(labX) ? 0 : labX;
            labY = isNaN(labY) ? 0 : labY;

            let labPosX = labX + 10 + size < x ? labX + 10 : x - size - 5;
            let labPosY = labY - 65 < 5 ? 5 : labY - 65;

            ctx.beginPath();
            ctx.fillStyle = "rgba(0, 122, 126, 0.6)";
            ctx.strokeStyle = "rgba(0, 122, 126, 0.6)";
            ctx.lineWidth = 3;
            ctx.fillRect(labPosX, labPosY, size, 60);

            ctx.moveTo(posX, posY);
            ctx.lineTo(labPosX + 2, labPosY + 60);
            ctx.stroke();

            ctx.beginPath();
            ctx.font = '17pt Calibri';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'left';
            ctx.textBaseline = "top";
            ctx.fillText("x: " + fixNumber(valX, stepX / 10), labPosX + 10, labPosY);
            ctx.fillText("y: " + fixNumber(valY, stepY / 10), labPosX + 10, labPosY + 25);

            ctx.beginPath();
            ctx.arc(posX, posY, 2, 0, Math.PI * 2, true);
            ctx.fill();


        }
    }

    function draw() {
        proces = true;
        if (dataType === "fun") {
            prepareDataFromFunction();
        } else {
            prepareDataFromFile();
        }

        ctx.clearRect(0, 0, x, y);

        drawAxis();
        drawGraph();
        axisDesc();

        document.getElementById("down").href = canvas.toDataURL();

        canvas.style.background = "url(" + canvas.toDataURL() + ")";


        ctx.clearRect(0, 0, x, y);
        proces = false;
    }

    function mousePossition(a) {
        var rect = canvas.getBoundingClientRect();
        mouseX = a.clientX - rect.left;
        mouseY = a.clientY - rect.top;
    }

    function scrollCanv(e) {
        if (!proces && scrollActive) {
            e.preventDefault();
            minX = parseFloat(document.querySelector("#xmin").value.replace(",", "."));
            maxX = parseFloat(document.querySelector("#xmax").value.replace(",", "."));
            document.querySelector("#xmin").value = fixNumber(e.deltaY > 0 ? (minX + stepX * 0.6 * (mouseX / x)) : (minX - stepX * 0.6 * (mouseX / x)), stepX / 10);
            document.querySelector("#xmax").value = fixNumber(e.deltaY > 0 ? (maxX - stepX * 0.6 * (1 - mouseX / x)) : (maxX + stepX * 0.6 * (1 - mouseX / x)), stepX / 10);
            draw();
        }
    }

    function prepareDataFromFunction() {
        getOptionFromFunction();
        if (!checkFunction()) {
            functionSyntaxError();
            return 0;
        }
        stepX = fixStep(maxX - minX);

        data = [];
        var line = [], val;
        for (var x = minX; x <= maxX; x += 0.0001 * Math.abs(maxX - minX)) {
            val = eval(fun);
            if (val < 1e10 && val > -1e10) {
                if (maxY < val)
                    maxY = val;
                if (minY > val)
                    minY = val;
                line.push(new Point(x, val));

            } else {
                if (line.length > 1) {
                    data.push(line);
                }
                line = [];
            }
        }
        if (line.length > 1) {
            data.push(line);
        }
        if (maxY === minY) {
            maxY += 5;
            minY -= 5;
        }
        stepY = fixStep(maxY - minY);

    }

    function getFunctionValue(x) {
        var val = 0;
        try {
            val = eval(fun);
        } catch (e) {
            return val;
        }
        return val;
    }

    function prepareDataFromFile() {
        getOptionFromFile();

        var d = stringFile.split(sepPoint),
            dF = [];

        for (var i = 0; i < d.length; i++) {
            if (d[i].indexOf(sepXY) > -1) {
                var k = d[i].split(sepXY);
                dF.push([Number(k[0]), Number(k[1])]);
            }
        }
        quick_sort(dF);

        maxX = maxValue(dF, 0);
        minX = minValue(dF, 0);
        maxY = maxValue(dF, 1);
        minY = minValue(dF, 1);
        if (maxY === minY) {
            maxY += 5;
            minY -= 5;
        }
        if (maxX === minX) {
            maxX += 5;
            minX -= 5;
        }
        let line = [];
        data = [];
        for (var i = 0; i < dF.length; i++) {
            line.push(new Point(dF[i][0], dF[i][1]));
        }
        data.push(line);

        stepY = fixStep(maxY - minY);
        stepX = fixStep(maxX - minX);

    }

    function maxValue(array, k) {
        var val = array[0][k];
        for (var i = 0; i < array.length; i++) {
            val = val < array[i][k] ? array[i][k] : val;
        }
        return val;
    }

    function minValue(array, k) {
        var val = array[0][k];
        for (var i = 0; i < array.length; i++) {
            val = val > array[i][k] ? array[i][k] : val;
        }
        return val;
    }

    function loadData() {
        var reader = new FileReader();
        var file = document.getElementById("file").files[0];

        reader.onload = function (e) {
            stringFile = e.target.result.replace(/(\r\n|\n|\r)/gm, "");
        };
        reader.readAsText(file);
    }

    function partition(array, begin, end, pivot) {
        var piv = array[pivot][0];
        array.swap(pivot, end - 1);
        var store = begin;
        var ix;
        for (ix = begin; ix < end - 1; ++ix) {
            if (array[ix][0] <= piv) {
                array.swap(store, ix);
                ++store;
            }
        }
        array.swap(end - 1, store);

        return store;
    }

    function qsort(array, begin, end) {
        if (end - 1 > begin) {
            var pivot = begin + Math.floor(Math.random() * (end - begin));

            pivot = partition(array, begin, end, pivot);

            qsort(array, begin, pivot);
            qsort(array, pivot + 1, end);
        }
    }

    function quick_sort(array) {
        qsort(array, 0, array.length);
    }

    function drawGraph() {
        ctx.beginPath();

        var width = x - 2 * margin,
            height = y - 2 * margin,
            dX = width / (maxX - minX),
            dY = height / (maxY - minY);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 4;

        if (lineActive) {
            ctx.moveTo(margin + (data[0][0].x - minX) * dX, margin + (maxY - data[0][0].y) * dY);
            for (var i in data) {
                for (var j in data[i]) {
                    ctx.lineTo(margin + (data[i][j].x - minX) * dX, margin + (maxY - data[i][j].y) * dY);
                }
            }
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.fillStyle = "blue";

        if (pointActive) {
            for (var i in data) {
                for (var j in data[i]) {
                    ctx.beginPath();
                    ctx.arc(margin + (data[i][j].x - minX) * dX, margin + (maxY - data[i][j].y) * dY, 1, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }
    }

    function drawAxis() {
        var width = x - 2 * margin,
            height = y - 2 * margin,
            dX = width / (maxX - minX),
            dY = height / (maxY - minY),
            axisY = (-minX) * dX,
            axisX = maxY * dY;

        axisX = axisX < 0 ? 0 : (axisX > height ? height : axisX);
        axisY = axisY < 0 ? 0 : (axisY > width ? width : axisY);

        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.fillStyle = 'black';
        ctx.font = 'margin/2pt Calibri';
        ctx.lineWidth = 0.5;
        ctx.moveTo(margin / 2, axisX + margin);
        ctx.lineTo(x - margin / 2, axisX + margin);
        ctx.lineTo(x - margin / 2 - 5, axisX + margin + 3);
        ctx.lineTo(x - margin / 2 - 5, axisX + margin - 3);
        ctx.lineTo(x - margin / 2, axisX + margin);

        ctx.moveTo(axisY + margin, y - margin / 2);
        ctx.lineTo(axisY + margin, margin / 2);
        ctx.lineTo(axisY + margin + 3, margin / 2 + 5);
        ctx.lineTo(axisY + margin - 3, margin / 2 + 5);
        ctx.lineTo(axisY + margin, margin / 2);
        ctx.stroke();

        if (maxY > 0) {
            for (var i = 0; i < maxY + stepY; i += stepY) {
                if (i >= minY) {
                    ctx.moveTo(axisY + margin - 5, margin + (maxY - i) * dY);
                    ctx.lineTo(axisY + margin + 5, margin + (maxY - i) * dY);
                    ctx.stroke();
                    ctx.fillText(fixNumber(i, stepY), axisY + margin - 20, margin + (maxY - i) * dY);
                }
            }
        }
        if (minY < 0) {
            for (var i = 0; i > minY - stepY; i -= stepY) {
                if (i < maxY) {
                    ctx.moveTo(axisY + margin - 5, margin + (maxY - i) * dY);
                    ctx.lineTo(axisY + margin + 5, margin + (maxY - i) * dY);
                    ctx.stroke();
                    ctx.fillText(fixNumber(i, stepY), axisY + margin - 20, margin + (maxY - i) * dY);
                }
            }
        }
        if (maxX > 0) {
            for (var i = 0; i < maxX + stepX; i += stepX) {
                if (i >= minX) {
                    ctx.moveTo(margin + (i - minX) * dX, axisX + margin - 5);
                    ctx.lineTo(margin + (i - minX) * dX, axisX + margin + 5);
                    ctx.stroke();
                    ctx.fillText(fixNumber(i, stepX), margin + (i - minX) * dX, axisX + margin + 18);
                }
            }
        }
        if (minX < 0) {
            for (var i = 0; i > minX - stepX; i -= stepX) {
                if (i < maxX) {
                    ctx.moveTo(margin + (i - minX) * dX, axisX + margin - 5);
                    ctx.lineTo(margin + (i - minX) * dX, axisX + margin + 5);
                    ctx.stroke();
                    ctx.fillText(fixNumber(i, stepX), margin + (i - minX) * dX, axisX + margin + 18);
                }
            }
        }
    }

    function fixNumber(i, l) {
        if (i === 0)
            return 0;
        var k = 0;
        while (l < 1) {
            l *= margin / 2;
            k++;
        }
        return i.toFixed(k + 1);
    }

    function fixStep(s) {
        s /= 8;
        var l = 1;
        if (s < 1) {
            while (s < 1) {
                s *= margin / 2;
                l *= margin / 2;
            }
            s = round(s) / l;
        } else if (s < margin / 2) {
            s = round(s);
        } else {
            while (s > margin / 2) {
                s /= margin / 2;
                l *= margin / 2;
            }
            s = round(s) * l;
        }
        return s;
    }

    function axisDesc() {
        ctx.font = '14pt Calibri';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = "top";
        ctx.fillText(descx, x / 2, y + 16 - margin);
        ctx.save();
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "center";
        ctx.fillText(descy, -y / 2, 2);
        ctx.restore();
    }

    function round(s) {
        return Math.floor(s);
    }

    function preperFunction(fun) {
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
                "Pi": "Math.PI",
                "E": "Math.E",
                "e": "Math.E"
            },
            expr = [
                [/(\d+|x|e|\(.+\))(\^|\*\*)(\d+|x|e|\(.+\))/g, "pow($1, $3)"]
            ];
        for (var i = 0; i < expr.length; i++) {
            fun = fun.replace(expr[i][0], expr[i][1]);
        }

        for (var key in fun_nam) {
            var re = new RegExp(key, 'g');
            fun = fun.replace(re, fun_nam[key]);
        }
        document.querySelector("#out-fun")
        document.querySelector("#out-fun").innerHTML = fun;
        document.querySelector("#out-fun").style.background = '#C7FFC7';
        return fun;
    }

    function getOptionFromFunction() {
        x = parseInt(document.querySelector("#x").value);
        y = parseInt(document.querySelector("#y").value);

        x = canvas.width = x < 300 ? 300 : (x > 1500 ? 1500 : x);
        y = canvas.height = y < 300 ? 300 : (y > 1500 ? 1500 : y);

        maxY = -9E10;
        minY = 9E10;

        descx = document.querySelector("#descx").value;
        descy = document.querySelector("#descy").value;

        fun = preperFunction(document.querySelector("#function").value);
        minX = parseFloat(document.querySelector("#xmin").value.replace(",", "."));
        maxX = parseFloat(document.querySelector("#xmax").value.replace(",", "."));

        if (maxX <= minX) {
            minX = 0;
            maxX = 10;
        }
    }

    function getOptionFromFile() {
        x = parseInt(document.querySelector("#x").value);
        y = parseInt(document.querySelector("#y").value);


        x = canvas.width = x < 300 ? 300 : (x > 1500 ? 1500 : x);
        y = canvas.height = y < 300 ? 300 : (y > 1500 ? 1500 : y);

        maxY = -9E10;
        minY = 9E10;

        descx = document.querySelector("#descx").value;
        descy = document.querySelector("#descy").value;

        sepPoint = document.querySelector("#point-seperator").value;
        sepXY = document.querySelector("#xy-seperator").value;

    }

    function checkFunction() {
        try {
            var x = 6;
            val = eval(fun);
        } catch (e) {
            return false;
        }
        return true;
    }

    function functionSyntaxError() {
        document.querySelector("#out-fun").style.background = "#FFC7C7";
    }
};

Array.prototype.swap = function (a, b) {
    var tmp = this[a];
    this[a] = this[b];
    this[b] = tmp;
};

function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

$math.init();

