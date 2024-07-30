let ctx;
let canvas;
const mouse = {x: 0, y: 0};
let points = [];

let winX, winY, gradient;

const settings = {
    ['maxRange']: 2000,
    ['maxForce']: 100,
    ['countX']: 50,
    ['countY']: 50,
    ['pixelCount']: 24000,
    ['maxPixelCount']: 45000,
    ['exp']: false,
    ['smooth']: false,
};

const size = 1;

const minX = 0.1;
const minY = 0.1;
const maxX = 0.9;
const maxY = 0.9;
const marginX = 100;
const marginY = 100;

let imageObject;
let inputImage;
let imageProgress;
let pr1;
let pr2;
const progressSteps = 2500;
let progressCurr = 0;

const canvasVirtual = document.createElement('canvas');
const ctxVirtual = canvasVirtual.getContext('2d');
let photoData = [];
let pixelSize = 10,
    pixelPhotoSize;

let offsetX = 0;
let offsetY = 0;

const fps = [];
let elFps;
let elParticle;
let poss;

const actionsMap = {
    ['closeSettings']: closeSettings,
    ['openSettings']: openSettings,
    ['setValue']: setValue,
    ['loadPhoto']: loadPhoto,
    ['generatePoint']: generatePoint,
    ['toggle']: toggle,
};

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
    ctx = canvas.getContext('2d');
}

function initGradient() {
    gradient = ctx.createRadialGradient(100, 100, 100, 100, 100, 0);
    gradient.addColorStop(0, '#0b1216');
    gradient.addColorStop(0.7, '#15292f');
    gradient.addColorStop(0.9, '#19393e');
    gradient.addColorStop(1, '#30767b');
}

function generatePoint() {
    points = [];
    const _minX = minX * winX;
    const _maxX = maxX * winX;
    const _minY = minY * winY;
    const _maxY = maxY * winY;
    const dx = (_maxX - _minX) / settings.countX;
    const dy = (_maxY - _minY) / settings.countY;
    let cx = 0,
        cy = 0;
    const _cX = 255 / settings.countX;
    const _cY = 255 / settings.countY;
    for (let i = _minX; i < _maxX; i += dx, cx += _cX) {
        for (let j = _minY; j < _maxY; j += dy, cy += _cY) {
            points.push(getPoint(i, j, randColor(cx, cy)));
        }
        cy = 0;
    }
}

function randColor(c1, c2, c3) {
    c3 = 105;
    return 'rgb(' + int(c3) + ', ' + int(255 - c2) + ', ' + int(c1) + ')';
}

function stat() {
    const dT = fps[0] - fps[fps.length - 1];
    elFps.innerHTML = 'Frame rate: ' + Math.floor((1000 * fps.length) / dT) + ' fps';
    elParticle.innerHTML = 'Particle: ' + points.length;
}

function draw() {
    ctx.fillStyle = '#0b1216';
    ctx.fillRect(0, 0, winX, winY);

    ctx.save();
    ctx.translate(mouse.x - 100, mouse.y - 100);
    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 200);
    ctx.restore();

    for (let i = 0; i < points.length; i++) {
        // points[i][1] = getNewPoss(points[i]);
        poss = setNewPoss(i);

        ctx.fillStyle = points[i][3];
        ctx.beginPath();
        ctx.fillRect(poss[0], poss[1], pixelSize, pixelSize);
        ctx.fill();
    }
    fps.unshift(new Date().getTime());
    fps.splice(20);
    window.requestAnimationFrame(draw);
}

function mouseMove(a) {
    const rect = canvas.getBoundingClientRect();
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
        color,
    ];
}

function dist(point) {
    return Math.sqrt(
        (mouse.x - point[0][0]) * (mouse.x - point[0][0]) +
            (mouse.y - point[0][1]) * (mouse.y - point[0][1]),
    );
}

function setNewPoss(i) {
    let dis = dist(points[i]);

    if (dis > settings.maxRange && !settings.smooth) {
        return points[i][0];
    }
    dis = -(settings.maxForce / settings.maxRange) * dis + settings.maxForce;
    const angle =
        Math.atan2(mouse.x - points[i][0][0], points[i][0][1] - mouse.y) +
        2.5 * Math.PI;

    points[i][1] = settings.exp
        ? [winX / 2 + Math.cos(angle) * dis, winY / 2 + Math.sin(angle) * dis]
        : [
              points[i][0][0] + Math.cos(angle) * dis,
              points[i][0][1] + Math.sin(angle) * dis,
          ];

    if (settings.smooth) {
        points[i][2][0] += (points[i][1][0] - points[i][2][0]) * 0.3;
        points[i][2][1] += (points[i][1][1] - points[i][2][1]) * 0.3;
    }
    return settings.smooth ? points[i][2] : points[i][1];
}

function calculatePhotoSize(photoX, photoY) {
    const _winX = winX - marginX;
    const _winY = winY - marginY;

    const photoRatio = photoX / photoY;
    const winRatio = _winX / _winY;

    if (winRatio < photoRatio) {
        pixelSize = Math.floor(
            Math.min(photoX, _winX) / Math.sqrt(settings.pixelCount * photoRatio),
        );
        pixelPhotoSize = Math.floor(
            photoX / Math.sqrt(settings.pixelCount * photoRatio),
        );
    } else {
        pixelSize = Math.floor(
            Math.min(photoY, _winY) / Math.sqrt(settings.pixelCount / photoRatio),
        );
        pixelPhotoSize = Math.floor(
            photoY / Math.sqrt(settings.pixelCount / photoRatio),
        );
    }

    if (
        (photoX / pixelPhotoSize) * (photoY / pixelPhotoSize) >
        settings.maxPixelCount
    ) {
        settings.pixelCount /= 1.2;
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
    const FR = new FileReader();
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
    photoData = ctxVirtual.getImageData(
        0,
        0,
        canvasVirtual.width,
        canvasVirtual.height,
    );

    offsetX = winX - (photoData.width / pixelPhotoSize) * pixelSize;
    offsetY = winY - (photoData.height / pixelPhotoSize) * pixelSize;
    points = [];

    const prog = 2300 / (photoData.width / pixelPhotoSize);
    let i = 0;

    (function loop() {
        for (let j = 0; j < photoData.height; j += pixelPhotoSize) {
            points.push(
                getPoint(
                    Math.round(offsetX / 2 + (i / pixelPhotoSize) * pixelSize),
                    Math.round(offsetY / 2 + (j / pixelPhotoSize) * pixelSize),
                    setAveragePixel(i, j),
                ),
            );
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
    let _x, _y;
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;
    let maxX = Math.min(x + pixelPhotoSize, photoData.width);
    let maxY = Math.min(y + pixelPhotoSize, photoData.height);
    let s = 0;

    for (let i = y; i < maxY; i++) {
        _y = i * 4 * photoData.width;
        for (let j = x; j < maxX; j++) {
            _x = _y + j * 4;

            r += photoData.data[_x];
            g += photoData.data[_x + 1];
            b += photoData.data[_x + 2];
            a += photoData.data[_x + 3];
            s++;
        }
    }
    r = int(r / s);
    g = int(g / s);
    b = int(b / s);
    a = int(a / s);
    return 'rgba( ' + r + ', ' + g + ', ' + b + ', ' + a + ')';
}

function int(value) {
    if (typeof value === 'string') {
        value = parseInt(value);
    }
    return Math.round(value);
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
    pr = int((progressCurr / progressSteps) * 100);
    imageProgress.style.height = pr + '%';
    pr1.innerHTML = pr + '%';
    pr2.innerHTML = pr + '%';
}

//SETTINGS
function initSetting() {
    let i;
    const action = document.getElementsByClassName('action');
    const input = document.getElementsByClassName('input-action');

    for (i = 0; i < action.length; i++) {
        action[i].addEventListener('click', inputAction);
    }
    for (i = 0; i < input.length; i++) {
        input[i].addEventListener('input', inputAction);
        const variable = input[i].dataset.var;
        const value = settings[variable];
        input[i].value = int(value);
        document.getElementById(variable).innerHTML = value;
    }
}

function inputAction() {
    const fun = actionsMap[this.dataset.action];
    if (typeof fun === 'function') {
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
    const variable = el.dataset.var;
    settings[variable] = !settings[variable];
}

function setValue(el) {
    const variable = el.dataset.var;
    const value = el.value;
    settings[variable] = int(value);
    document.getElementById(variable).innerHTML = value;
}

init();
