var canvas;
var ctx;
var width;
var height;
var row;
var col;
var size;
var margin;
var cells;
var button;
var loop;
var sizeTotal;

function int(val) {
    return parseInt(val);
}

function float(val) {
    return parseFloat(val);
}

function nextGeneration() {
    var newData = [];
    for (var i = 0; i < row; i++) {
        newData.push([]);
        for (var j = 0; j < col; j++) {
            newData[i].push(lifeStatus(j, i));
        }
    }
    return newData;
}

function lifeStatus(x, y) {
    var sum = val(x - 1, y - 1) + val(x, y - 1) + val(x + 1, y - 1) +
        val(x - 1, y) + val(x + 1, y) +
        val(x - 1, y + 1) + val(x, y + 1) + val(x + 1, y + 1);
    if (val(x, y)) {
        return (sum == 2 || sum == 3) ? 1 : 0;
    } else {
        return sum == 3 ? 1 : 0;
    }
}

function val(x, y) {
    if (x < 0 || x >= col || y < 0 || y >= row) return 0;
    return cells[y][x];
}

function drawCell(x, y) {
    ctx.fillStyle = '#000';
    ctx.fillRect(x * sizeTotal + margin, y * sizeTotal + margin, size, size);
}


function render() {
    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            val(j, i) && drawCell(j, i)
        }
    }

    cells = nextGeneration();
}

function setData() {
    cells = [];
    var line;
    for (var i = 0; i < row; i++) {
        line = [];
        for (var j = 0; j < col; j++) {
            line.push(Math.round(Math.random()));
        }
        cells.push(line);
    }
}

function initVariable() {
    size = value($$("#size"), 1, 10);
    col = value($$("#col"), 10, 500);
    row = value($$("#row"), 10, 500);
    margin = value($$("#margin"), 0, 10);
    sizeTotal = 2 * margin + size;
    width = sizeTotal * col;
    height = sizeTotal * row;
    console.log(height, width);
    canvas.height = height;
    canvas.width = width;
    setData();
}

function value(el, min, max) {
    var val = int(el.value);
    val = val < min ? min : val;
    el.value = val > max ? max : val;
    return val > max ? max : val;
}


function reset() {
    loop && clearInterval(loop);
    initVariable();
    loop = setInterval(render, 1000 / 60);
}

function initLife() {
    canvas = $$("#life");
    ctx = canvas.getContext("2d");
    $$("#reset").addEvent("click", reset);
}


initLife();