/* global canvasOrginal, canvasInput, canvasOutput, inputImage, ctxOrginal, ctxOutput, photoData, rangeValue, method, ctxInput */

function _$(id) {
    return document.getElementById(id);
}

$photo = new function () {
    var canvasOrginal, canvasInput, canvasOutput,
        ctxOrginal, ctxInput, ctxOutput,
        inputImage, imageObject,
        photoData,
        outputPhotoData = [],
        inputRange, rangeValue = 50,
        method = {},
        functionName = "negatyw",
        funParm = null,
        render = true,
        combo = false;
    /**
     * Funkcja inicjujaca
     *
     * DO: ustawia dwa plutna ustawia zdarzenia click na elementach
     *
     */
    this.init = function () {


        canvasOrginal = _$("canvas-orginal");
        canvasInput = _$("canvas-input");
        canvasOutput = _$("canvas-output");
        inputImage = _$("photo-choser-input");
        inputRange = _$("range");

        if (canvasOrginal && canvasOrginal.getContext) {
            ctxOrginal = canvasOrginal.getContext("2d");
            ctxInput = canvasInput.getContext("2d");
            ctxOutput = canvasOutput.getContext("2d");

            inputImage.addEventListener('change', loadPhoto);
            inputRange.addEventListener('change', rangeChange);
            _$("orginal-show").addEventListener('mouseup', showOrginal);
            _$("photo-use").addEventListener('mouseup', changeCombo);

            var edit = document.getElementsByClassName('edit');

            for (var i = 0; i < edit.length; i++) {
                if (typeof edit[i] === "object") {
                    edit[i].addEventListener("click", transform);
                }
            }
        }
    };

    /**
     * Wczytuje zdjecie
     *
     * DO: ustawia rozmiar obu plucien na rozmiar zdjecia wlacza domyslna transformacje
     *
     * @returns {undefined}
     */
    function loadPhoto() {
        if (inputImage.files && inputImage.files[0]) {
            var FR = new FileReader();
            imageObject = new Image();
            FR.readAsDataURL(inputImage.files[0]);
        }
        FR.onload = function (e) {
            imageObject.src = e.target.result;
            imageObject.onload = function () {
                canvasOrginal.width = this.width;
                canvasOrginal.height = this.height;
                canvasInput.width = this.width;
                canvasInput.height = this.height;
                canvasOutput.width = this.width;
                canvasOutput.height = this.height;

                ctxOrginal.drawImage(imageObject, 0, 0);
                ctxInput.drawImage(imageObject, 0, 0);

                transform();
            };
        };
    }

    function showOrginal(event) {
        if (event.target.value === 'true') {
            canvasOrginal.style.display = "initial";
        } else {
            canvasOrginal.style.display = "none";
        }
    }

    function changeCombo(event) {
        combo = event.target.value === 'true';
    }

    function rangeChange(event) {
        rangeValue = parseInt(event.target.value);
        transform();
    }

    function getElementColor() {
        var rgb = _$("akcent").dataset.color;
        rgb = rgb.substring(4, rgb.length - 1)
            .replace(/ /g, '')
            .split(',');
        return rgb;
    }

    function transform(event) {
        preapareData();
        if (event) {
            var element = event.target;
            while (true) {
                if (element.classList.contains('edit')) {
                    break;
                } else if (element.parentNode) {
                    element = element.parentNode;
                } else {
                    break;
                }
            }

            var data = element.dataset.edit.split("-");

            functionName = data[0];
            funParm = data.length > 1 ? data[1] : null;
        }

        render = true;

        if (method.hasOwnProperty(functionName)) {
            method[functionName](funParm);
        }

        render && renderCanvas();

    }

    function preapareData() {
        if (combo) {
            photoData = ctxInput.getImageData(0, 0, canvasInput.width, canvasInput.height);
        } else {
            photoData = ctxOrginal.getImageData(0, 0, canvasOrginal.width, canvasOrginal.height);
        }


        var d = photoData.data,
            w = photoData.width,
            line = [];
        outputPhotoData = [];
        for (var i = 0, l = 0, j = 0; i < d.length; i += 4) {
            l = (++j) % w;
            line.push({r: d[i], g: d[i + 1], b: d[i + 2], a: d[i + 3]});
            if (!l) {
                outputPhotoData.push(line);
                line = [];
            }
        }
    }

    function renderCanvas() {
        for (var j = 0, id = 0; j < photoData.height; j++) {
            for (var i = 0; i < photoData.width; i++) {
                photoData.data[id] = outputPhotoData[j][i].r;
                photoData.data[id + 1] = outputPhotoData[j][i].g;
                photoData.data[id + 2] = outputPhotoData[j][i].b;
                photoData.data[id + 3] = outputPhotoData[j][i].a;
                id += 4;
            }
        }
        ctxOutput.putImageData(photoData, 0, 0);
        ctxInput.putImageData(photoData, 0, 0);
    }

    method["negatyw"] = function () {
        for (var i = 0; i < photoData.height; i++) {
            for (var j = 0; j < photoData.width; j++) {
                outputPhotoData[i][j].g = 255 - outputPhotoData[i][j].g;
                outputPhotoData[i][j].r = 255 - outputPhotoData[i][j].r;
                outputPhotoData[i][j].b = 255 - outputPhotoData[i][j].b;
            }
        }
    };


    method["szary"] = function () {
        var average, dark = rangeValue * 2.55;
        for (var i = 0; i < photoData.height; i++) {
            for (var j = 0; j < photoData.width; j++) {
                average = (outputPhotoData[i][j].r + outputPhotoData[i][j].g + outputPhotoData[i][j].b) / 3 - dark;
                average = average > 255 ? 255 : (average < 0 ? 0 : average);
                outputPhotoData[i][j].g = average;
                outputPhotoData[i][j].r = average;
                outputPhotoData[i][j].b = average;
            }
        }
    };


    method["sepia"] = function () {
        var sepy = rangeValue * 0.7;
        for (var i = 0; i < photoData.height - 1; i++) {
            for (var j = 0; j < photoData.width - 1; j++) {
                outputPhotoData[i][j].g += 2 * sepy;
                outputPhotoData[i][j].r += sepy;
            }
        }
    };

    method["kontur1"] = function () {
        var copy = JSON.parse(JSON.stringify(outputPhotoData));
        for (var i = 0; i < photoData.height - 1; i++) {
            for (var j = 0; j < photoData.width - 1; j++) {
                outputPhotoData[i][j].r = Math.abs(copy[i][j].r - copy[i + 1][j + 1].r) + Math.abs(copy[i + 1][j].r - copy[i][j + 1].r);
                outputPhotoData[i][j].g = Math.abs(copy[i][j].g - copy[i + 1][j + 1].g) + Math.abs(copy[i + 1][j].g - copy[i][j + 1].g);
                outputPhotoData[i][j].b = Math.abs(copy[i][j].b - copy[i + 1][j + 1].b) + Math.abs(copy[i + 1][j].b - copy[i][j + 1].b);
            }
        }

    };

    method["kontur2"] = function () {
        var x, y, copy = JSON.parse(JSON.stringify(outputPhotoData));
        for (var i = 1; i < photoData.height - 1; i++) {
            for (var j = 1; j < photoData.width - 1; j++) {
                x = (copy[i - 1][j + 1].r + 2 * copy[i][j + 1].r + copy[i + 1][j + 1].r) - (copy[i - 1][j - 1].r + 2 * copy[i][j - 1].r + copy[i + 1][j - 1].r);
                y = (copy[i + 1][j - 1].r + 2 * copy[i + 1][j].r + copy[i + 1][j + 1].r) - (copy[i - 1][j - 1].r + 2 * copy[i - 1][j].r + copy[i - 1][j + 1].r);
                outputPhotoData[i][j].r = Math.pow((x * x + y * y), 0.5);
                x = (copy[i - 1][j + 1].g + 2 * copy[i][j + 1].g + copy[i + 1][j + 1].g) - (copy[i - 1][j - 1].g + 2 * copy[i][j - 1].g + copy[i + 1][j - 1].g);
                y = (copy[i + 1][j - 1].g + 2 * copy[i + 1][j].g + copy[i + 1][j + 1].g) - (copy[i - 1][j - 1].g + 2 * copy[i - 1][j].g + copy[i - 1][j + 1].g);
                outputPhotoData[i][j].g = Math.pow((x * x + y * y), 0.5);
                x = (copy[i - 1][j + 1].b + 2 * copy[i][j + 1].b + copy[i + 1][j + 1].b) - (copy[i - 1][j - 1].b + 2 * copy[i][j - 1].b + copy[i + 1][j - 1].b);
                y = (copy[i + 1][j - 1].b + 2 * copy[i + 1][j].b + copy[i + 1][j + 1].b) - (copy[i - 1][j - 1].b + 2 * copy[i - 1][j].b + copy[i - 1][j + 1].b);
                outputPhotoData[i][j].b = Math.pow((x * x + y * y), 0.5);
            }
        }

    };

    method["progowanie"] = function (type) {
        type = parseInt(type);
        var average, limit = rangeValue * 2.55;
        for (var i = 0; i < photoData.height; i++) {
            for (var j = 0; j < photoData.width; j++) {
                average = (outputPhotoData[i][j].r + outputPhotoData[i][j].g + outputPhotoData[i][j].b) / 3;
                average = average > limit ? (type === 0 ? average : 255) : (type === 2 ? average : 0);
                outputPhotoData[i][j].g = average;
                outputPhotoData[i][j].r = average;
                outputPhotoData[i][j].b = average;
            }
        }
    };

    method["randMask"] = function () {
        mask(randomMask());
    };


    method["ownMask"] = function (size) {
        size = Math.pow(parseInt(size), 2);
        var maskData = [];
        for (var i = 1; i <= size; i++) {
            var val = Number(_$("maskInput" + i).value);
            if (!val) {
                val = 0;
            }
            maskData.push(val);
        }
        mask(maskData);

    };

    method["akcent"] = function () {
        var rgb = getElementColor();
        var colorA = rgbaToHsv({r: rgb[0], g: rgb[1], b: rgb[2]}),
            range = rangeValue * 2;

        var h1 = (colorA.h - range / 2 + 360) % 360,
            h2 = (colorA.h + range / 2 + 360) % 360,
            and = h1 <= h2;
        for (var i = 0; i < photoData.height; i++) {
            for (var j = 0; j < photoData.width; j++) {
                var color = rgbaToHsv($$.clone(outputPhotoData[i][j]));
                if ((and && color.h > h1 && color.h < h2) || (!and && (color.h > h1 || color.h < h2))) {
                    //don't change
                } else {
                    var ave = (outputPhotoData[i][j].r + outputPhotoData[i][j].g + outputPhotoData[i][j].b) / 3;
                    outputPhotoData[i][j].g = ave;
                    outputPhotoData[i][j].r = ave;
                    outputPhotoData[i][j].b = ave;
                }
            }
        }

    };

    method["lab"] = function () {
        var r = Math.random() * 255,
            g = Math.random() * 255,
            b = Math.random() * 255;

        for (var i = 0; i < photoData.height; i++) {
            for (var j = 0; j < photoData.width; j++) {
                outputPhotoData[i][j].g = (outputPhotoData[i][j].g + r) % 255;
                outputPhotoData[i][j].r = (outputPhotoData[i][j].r + g) % 255;
                outputPhotoData[i][j].b = (outputPhotoData[i][j].b + b) % 255;
            }
        }
    };


    method["pixel"] = function () {

        for (var i = 0; i < photoData.width; i += rangeValue) {
            for (var j = 0; j < photoData.height; j += rangeValue) {
                setAverage(i, j);
            }
        }
    };

    method["circle"] = function () {
        render = false;
        var step = Math.max(rangeValue, 5);
        ctxOutput.clearRect(0, 0, photoData.width, photoData.height);
        for (var i = 0; i < photoData.width; i += step) {
            for (var j = 0; j < photoData.height; j += step) {
                ctxOutput.fillStyle = setAverage(i, j);
                ctxOutput.beginPath();
                ctxOutput.arc(i + 0.5 * step, j + 0.5 * step, 0.5 * step, 0, Math.PI * 2, true);
                ctxOutput.closePath();
                ctxOutput.fill();
            }
        }
        ctxInput.putImageData(ctxOutput.getImageData(0, 0, canvasInput.width, canvasInput.height), 0, 0);
    };


    method["bit"] = function () {
        var color;
        for (var i = 0; i < photoData.height; i++) {
            for (var j = 0; j < photoData.width; j++) {
                color = outputPhotoData[i][j];
                outputPhotoData[i][j].r = Math.round(color.r / rangeValue) * rangeValue;
                outputPhotoData[i][j].g = Math.round(color.g / rangeValue) * rangeValue;
                outputPhotoData[i][j].b = Math.round(color.b / rangeValue) * rangeValue;
            }
        }
    };

    method["randpix"] = function () {
        var copy = JSON.parse(JSON.stringify(outputPhotoData));
        for (var i = 0; i < photoData.height; i++) {
            for (var j = 0; j < photoData.width; j++) {
                var y = i + Math.floor((2 * rangeValue) * Math.random()) - rangeValue;
                var x = j + Math.floor((2 * rangeValue) * Math.random()) - rangeValue;
                if (y < 0) y += photoData.height;
                if (x < 0) x += photoData.width;
                if (y >= photoData.height) y -= photoData.height;
                if (x >= photoData.width) x -= photoData.width;

                // console.log(i, j);

                var color = copy[y][x];
                outputPhotoData[i][j].r = color.r;
                outputPhotoData[i][j].g = color.g;
                outputPhotoData[i][j].b = color.b;
            }
        }
    };


    function setAverage(x, y, grey) {
        grey = grey || false;
        var r = 0, g = 0, b = 0,
            maxX = Math.min(x + rangeValue, photoData.width),
            maxY = Math.min(y + rangeValue, photoData.height),
            s = 0;

        for (var i = y; i < maxY; i++) {
            for (var j = x; j < maxX; j++) {
                r += outputPhotoData[i][j].r;
                g += outputPhotoData[i][j].g;
                b += outputPhotoData[i][j].b;
                s++;
            }
        }
        r = parseInt(r / s);
        g = parseInt(g / s);
        b = parseInt(b / s);
        for (i = y; i < maxY; i++) {
            for (j = x; j < maxX; j++) {
                outputPhotoData[i][j].r = r;
                outputPhotoData[i][j].g = g;
                outputPhotoData[i][j].b = b;
            }
        }
        if (grey) {
            var k = parseInt((r + g + b) / 3);
            r = k;
            g = k;
            b = k;
        }
        return "rgb( " + r + ", " + g + ", " + b + ")";
    }

    /**
     * Transformacja wedlug podanej maski
     *
     * DO: transformuje zdjecie wedlug danej maski przekazanej jako parametr
     *
     * @param {Array} mask
     * @returns jezeli maska nie jest to kwadratowa macierz o niepazystych ilosci elementow zwraca FALSE
     */
    function mask(mask) {
        if (!(Math.sqrt(mask.length) % 2))
            return false;

        var color,
            size = Math.sqrt(mask.length),
            margin = Math.floor(size / 2),
            sum = Math.abs(mask.reduce(function (pv, cv) {
                return pv + cv;
            }, 0)),
            copy = JSON.parse(JSON.stringify(outputPhotoData));

        sum = sum ? sum : 1;
        for (var i in mask) {
            mask[i] /= sum;
        }

        var y = photoData.height - margin,
            x = photoData.width - margin;
        for (var i = margin; i < y; i++) {
            for (var j = margin; j < x; j++) {
                color = getColor(j, i, mask, copy, margin);
                outputPhotoData[i][j].r = color.r;
                outputPhotoData[i][j].g = color.g;
                outputPhotoData[i][j].b = color.b;
            }
        }
    }


    /**
     * Pobiera kolor danego pixela
     *
     * DO: pobiera kolor danego pixele wedlug danej maski
     *
     * @param {int} x
     * @param {int} y
     * @param {array} mask
     * @param {array} copy
     * @param {int} margin
     * @returns {object} koolr
     */
    function getColor(x, y, mask, copy, margin) {
        var color = {r: 0, g: 0, b: 0};
        for (var i = y - margin, id = 0; i < y + margin + 1; i++) {
            for (var j = x - margin; j < x + margin + 1; j++) {
                color.r += mask[id] * copy[i][j].r;
                color.g += mask[id] * copy[i][j].g;
                color.b += mask[id] * copy[i][j].b;
                id++;
            }
        }
        return color;
    }

    /**
     * Zamienia kolor z RGB na VSH
     *
     * DO: zamiana notacji RGB na VSH
     *
     * @param {type} color
     * @returns {object} color
     */
    function rgbaToHsv(color) {
        color.r /= 255;
        color.g /= 255;
        color.b /= 255;
        var newColor = {h: 0, s: 0, v: 0},
            Cmax = Math.max(color.r, color.g, color.b),
            Cmin = Math.min(color.r, color.g, color.b),
            delta = Cmax - Cmin;

        if (delta === 0) {
            newColor.h = 0;
        } else if (color.r > Math.max(color.g, color.b)) {
            newColor.h = 60 * (((color.g - color.b) / delta) % 6);
        } else if (color.g > Math.max(color.r, color.b)) {
            newColor.h = 60 * (((color.b - color.r) / delta) + 2);
        } else {
            newColor.h = 60 * (((color.r - color.g) / delta) + 4);
        }

        while (newColor.h < 0) {
            newColor.h += 360;
        }

        newColor.s = Cmax ? (delta / Cmax) : 0;
        newColor.v = Cmax;
        return newColor;
    }

    /**
     * Zamienia kolor z VSH na RGB
     *
     * DO: zamiana notacji VSH na RGB
     *
     * @param {type} color
     * @returns {object} color
     */
    function hsvToRgba(color) {
        var h = color.h;
        var s = color.s;
        var v = color.v;
        var r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v, g = t, b = p;
                break;
            case 1:
                r = q, g = v, b = p;
                break;
            case 2:
                r = p, g = v, b = t;
                break;
            case 3:
                r = p, g = q, b = v;
                break;
            case 4:
                r = t, g = p, b = v;
                break;
            case 5:
                r = v, g = p, b = q;
                break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

};


colorpicker("akcent", function (el, color) {
    el.style.backgroundColor = color;
    el.dataset.color = color;
});

var mask = _$("mask-matrix");

for (var i = 0; i < 25; i++) {
    var element = document.createElement('input');
    element.id = 'maskInput' + (i + 1);
    element.className = 'mask-input';
    mask.appendChild(element);

}

var maskshow = document.getElementsByClassName('maskshow');
for (var i = 0; i < maskshow.length; i++) {
    maskshow[i].addEventListener('click', function (event) {
        event.stopPropagation();
        var size = event.target.dataset.size;
        _$("mask-action").dataset.edit = "ownMask-" + size;
        _$("mask-matrix").style.height = size * 50 + "px";
        _$("mask-matrix").style.width = size * 50 + "px";
        _$("mask").style.display = 'block';
    });
}


var switcher = document.getElementsByClassName('switcher');
for (var i = 0; i < switcher.length; i++) {
    switcher[i].addEventListener('mousedown', function (event) {
        var element = event.target;
        if (element.classList.contains('true')) {
            element.classList.remove('true');
            element.classList.add('false');
            element.value = false;
        } else {
            element.classList.remove('false');
            element.classList.add('true');
            element.value = true;
        }
    });
}


document.addEventListener('click', function (event) {
    var toHide = document.getElementsByClassName('hide-child');
    for (var i = 0; i < toHide.length; i++) {
        if (event.path.indexOf(toHide[i]) === -1) {
            toHide[i].children[0].style.display = 'none';
        }
    }
    var toHide = document.getElementsByClassName('hide');
    for (var i = 0; i < toHide.length; i++) {
        if (event.path.indexOf(toHide[i]) === -1) {
            toHide[i].style.display = 'none';
        }
    }
});


$photo.init();

