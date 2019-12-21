var ctx;
var canvas;
var mouse = {x: 0, y: 0};
var points = [];

var winX, winY, gradient;

var maxRange = 2000;
var maxForce = 100;
var countX = 50;
var countY = 50;
var size = 1;

var minX = 0.1;
var minY = 0.1;
var maxX = 0.9;
var maxY = 0.9;
var marginX = 100;
var marginY = 100;

var imageObject;
var inputImage;
var imageProgress;
var pr1;
var pr2;
var progressSteps = 2500;
var progressCurr = 0;

var canvasVirtual = document.createElement('canvas');
var ctxVirtual = canvasVirtual.getContext("2d");
var photoData = [];
var pixelSize = 10,
    pixelPhotoSize;
var pixelCount = 24000;
var maxPixelCount = 45000;

var offsetX = 0;
var offsetY = 0;

var exp = false;
var smooth = false;

var fps = [];
var elFps;
var elParticle;
var poss;


function init() {
    initPhoto();
    initCanvas();
    initGradient();

    generatePoint();
    initSetting();
    setInterval(stat, 1000);
    window.requestAnimationFrame(draw);
}

function initPhoto() {
    inputImage = document.getElementById('image');
    inputImage.addEventListener('change', loadPhoto);

    imageProgress = document.getElementById('progress');
    pr1 = document.getElementById('pr-1');
    pr2 = document.getElementById('pr-2');

    elFps = document.getElementById('fps');
    elParticle = document.getElementById('particle');

}


function initCanvas() {
    canvas = document.getElementById('grid');
    window.addEventListener('resize', resizeWindow);
    canvas.addEventListener('mousemove', mouseMove);
    canvas.style.cursor = 'none';
    resizeWindow();
    ctx = canvas.getContext("2d");
}

function initGradient() {
    gradient = ctx.createRadialGradient(100, 100, 100, 100, 100, 0);
    gradient.addColorStop(0, "#0b1216");
    gradient.addColorStop(0.7, "#15292f");
    gradient.addColorStop(0.9, "#19393e");
    gradient.addColorStop(1, "#30767b");
}

function generatePoint() {
    points = [];
    var _minX = minX * winX;
    var _maxX = maxX * winX;
    var _minY = minY * winY;
    var _maxY = maxY * winY;
    var dx = (_maxX - _minX) / countX;
    var dy = (_maxY - _minY) / countY;
    var cx = 0, cy = 0;
    var _cX = 255 / countX;
    var _cY = 255 / countY;
    for (var i = _minX; i < _maxX; i += dx, cx += _cX) {
        for (var j = _minY; j < _maxY; j += dy, cy += _cY) {
            points.push(getPoint(i, j, randColor(cx, cy)));
        }
        cy = 0;
    }
}

function randColor(c1, c2, c3) {
    c3 = 105;
    return "rgb(" + parseInt(c3) + ", " + parseInt(255 - c2) + ", " + parseInt(c1) + ")";
}


function stat() {
    var dT = fps[0] - fps[fps.length - 1];
    elFps.innerHTML = "Frame rate: " + Math.floor(1000 * fps.length / dT) + " fps";
    elParticle.innerHTML = "Particle: " + points.length;
}

function draw() {
    ctx.fillStyle = "#0b1216";
    ctx.fillRect(0, 0, winX, winY);

    ctx.save();
    ctx.translate(mouse.x - 100, mouse.y - 100);
    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 200);
    ctx.restore();


    for (var i = 0; i < points.length; i++) {
        // points[i][1] = getNewPoss(points[i]);
        poss = setNewPoss(i);

        ctx.fillStyle = points[i][3];
        ctx.beginPath();
        ctx.fillRect(poss[0], poss[1], pixelSize, pixelSize);
        ctx.fill();
    }
    fps.unshift((new Date).getTime());
    fps.splice(20);
    window.requestAnimationFrame(draw);
}

function mouseMove(a) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = a.clientX - rect.left;
    mouse.y = a.clientY - rect.top;
}

function resizeWindow() {
    winX = window.innerWidth;
    winY = window.innerHeight;
    canvas.width = winX;
    canvas.height = winY;
}


function getPoint(x, y, color) {
    return [
        [x, y], // base
        [x, y], // current
        [x, y], // destination
        color
    ]
}

function dist(point) {
    return Math.sqrt(
        (mouse.x - point[0][0]) * (mouse.x - point[0][0]) +
        (mouse.y - point[0][1]) * (mouse.y - point[0][1])
    );
}


function setNewPoss(i) {
    var dis = dist(points[i]);

    if (dis > maxRange && !smooth) {
        return points[i][0];
    }
    dis = -(maxForce / maxRange) * dis + maxForce;
    var angle = Math.atan2(mouse.x - points[i][0][0], points[i][0][1] - mouse.y) + 2.5 * Math.PI;

    points[i][1] = exp ? [winX / 2 + Math.cos(angle) * dis, winY / 2 + Math.sin(angle) * dis]
        : [points[i][0][0] + Math.cos(angle) * dis, points[i][0][1] + Math.sin(angle) * dis];

    if (smooth) {
        points[i][2][0] += (points[i][1][0] - points[i][2][0]) * 0.3;
        points[i][2][1] += (points[i][1][1] - points[i][2][1]) * 0.3;
    }
    return smooth ? points[i][2] : points[i][1];
}


function calculatePhotoSize(photoX, photoY) {
    var _winX = winX - marginX;
    var _winY = winY - marginY;


    var photoRatio = photoX / photoY;
    var winRatio = _winX / _winY;

    if (winRatio < photoRatio) {
        pixelSize = Math.floor(Math.min(photoX, _winX) / Math.sqrt(pixelCount * photoRatio));
        pixelPhotoSize = Math.floor(photoX / Math.sqrt(pixelCount * photoRatio));
    } else {
        pixelSize = Math.floor(Math.min(photoY, _winY) / Math.sqrt(pixelCount / photoRatio));
        pixelPhotoSize = Math.floor(photoY / Math.sqrt(pixelCount / photoRatio));
    }

    if ((photoX / pixelPhotoSize) * (photoY / pixelPhotoSize) > maxPixelCount) {
        pixelCount /= 1.2;
        calculatePhotoSize(photoX, photoY);
    }

}


function loadPhoto() {
    imageProgress.parentNode.classList.remove('end');
    if (inputImage.files && inputImage.files[0]) {
        setTimeout(readImage, 500);
    } else {
        imageProgress.parentNode.classList.add('end');
    }
}


function readImage() {
    var FR = new FileReader();
    imageObject = new Image();

    FR.onload = function (e) {
        imageObject.src = e.target.result;
        imageObject.onload = function () {
            setProgress(200, true);
            canvasVirtual.width = this.width;
            canvasVirtual.height = this.height;
            ctxVirtual.drawImage(imageObject, 0, 0);
            calculatePhotoSize(this.width, this.height);
            setTimeout(prepareDataPixel, 1000);
        };
    };
    FR.readAsDataURL(inputImage.files[0]);
}

function prepareDataPixel() {

    photoData = ctxVirtual.getImageData(0, 0, canvasVirtual.width, canvasVirtual.height);

    offsetX = winX - photoData.width / pixelPhotoSize * pixelSize;
    offsetY = winY - photoData.height / pixelPhotoSize * pixelSize;
    points = [];

    var prog = 2300 / (photoData.width / pixelPhotoSize);
    var i = 0;

    (function loop() {
        for (var j = 0; j < photoData.height; j += pixelPhotoSize) {
            points.push(getPoint(
                Math.round(offsetX / 2 + i / pixelPhotoSize * pixelSize),
                Math.round(offsetY / 2 + j / pixelPhotoSize * pixelSize),
                setAveragePixel(i, j)
            ));
        }
        i += pixelPhotoSize;
        if (i < photoData.width) {
            setProgress(prog, false);
            setTimeout(loop, 10);
        } else {
            setProgress(2500, true);
            loadEnded();
        }
    })();

}

function setAveragePixel(x, y) {
    var _x, _y;
    var r = 0,
        g = 0,
        b = 0,
        a = 0,
        maxX = Math.min(x + pixelPhotoSize, photoData.width),
        maxY = Math.min(y + pixelPhotoSize, photoData.height),
        s = 0;

    for (var i = y; i < maxY; i++) {
        _y = i * 4 * photoData.width;
        for (var j = x; j < maxX; j++) {
            _x = _y + j * 4;

            r += photoData.data[_x];
            g += photoData.data[_x + 1];
            b += photoData.data[_x + 2];
            a += photoData.data[_x + 3];
            s++;
        }
    }
    r = parseInt(r / s);
    g = parseInt(g / s);
    b = parseInt(b / s);
    a = parseInt(a / s);
    return "rgba( " + r + ", " + g + ", " + b + ", " + a + ")";

}


function loadEnded() {
    imageProgress.parentNode.classList.add('end');
    setTimeout(function () {
        setProgress(0, true);
    }, 500);
}

function setProgress(pr, force) {
    if (force) {
        progressCurr = pr;
    } else {
        progressCurr += pr;
    }
    pr = parseInt(progressCurr / progressSteps * 100);
    imageProgress.style.height = pr + "%";
    pr1.innerHTML = pr + "%";
    pr2.innerHTML = pr + "%";

}


window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || function (callback) {
            window.setTimeout(callback, 1000 / 30)
        };
})();


//SETTINGS
function initSetting() {
    var i, action = document.getElementsByClassName('action');
    var input = document.getElementsByClassName('input-action');

    for (i = 0; i < action.length; i++) {
        action[i].addEventListener('click', inputAction);
    }
    for (i = 0; i < input.length; i++) {
        input[i].addEventListener('input', inputAction);
        var variable = input[i].dataset.var;
        var value = window[variable];
        input[i].value = parseInt(value);
        document.getElementById(variable).innerHTML = value;
    }
}

function inputAction() {
    var fun = window[this.dataset.action];
    if (typeof fun === "function") {
        fun(this);
    }
}

function openSettings() {
    mouse.x = winX / 2;
    mouse.y = winY / 2;
    document.body.classList.add('open');
}

function closeSettings() {
    document.body.classList.remove('open');
}

function toggle(el) {
    var variable = el.dataset.var;
    window[variable] = !window[variable];
}

function setValue(el) {
    var variable = el.dataset.var;
    var value = el.value;
    window[variable] = parseInt(value);
    document.getElementById(variable).innerHTML = value;
}

init();
