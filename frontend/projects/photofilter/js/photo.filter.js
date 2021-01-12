/* global ctx2, canvas2, canvas, input, $$, ctx, colorPicker */

window._c = function (ar) {
    console.log(ar);
};

$photo = new function () {
    var canvas, canvas2,
        ctx,
        ctx2,
        input,
        Im,
        photoData,
        newPhoto = [],
        filter,
        dark = 0,
        sepy = 30;

    /**
     * Funkcja inicjujaca
     *
     * DO: ustawia dwa plutna ustawia zdarzenia click na elementach
     *
     */
    this.init = function () {
        canvas = document.getElementById("photoCanvas");
        canvas2 = document.getElementById("photoHide");
        input = document.getElementById("photo");
        if (canvas && canvas.getContext) {
            ctx = canvas.getContext("2d");
            ctx2 = canvas2.getContext("2d");
            input.addEventListener('change', loadPhoto);

            var inputs = document.getElementsByTagName("input");
            for (var i = 0; i < inputs.length; i++) {
                var r = inputs[i];
                if (typeof r === "object" && r.type === "radio" && r.name === "filter") {
                    $$.addEvent(r, 'click', transform);
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
        if (input.files && input.files[0]) {
            var FR = new FileReader();
            Im = new Image();
            FR.readAsDataURL(input.files[0]);
        }
        FR.onload = function (e) {
            Im.src = e.target.result;
            document.getElementById("img").src = e.target.result;
            Im.onload = function () {
                canvas.width = this.width;
                canvas.height = this.height;
                canvas2.width = this.width;
                canvas2.height = this.height;
                ctx2.drawImage(Im, 0, 0);
                transform();
            };
        };
    }

    /**
     * Pobiera bierzacy zaznaczony filter
     *
     * DO: sprawdza ktory filter jest zaznaczony
     *
     * @returns {undefined}
     */
    function getOption() {

        var radios = document.getElementsByName('filter');
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                filter = radios[i].value;
                break;
            }
        }

    }

    /**
     * Transformuje zdjecie
     *
     * DO: w zaleznosci od zaznaczonego typu transformuje w odpowiedni sposob zdjecie
     *
     */
    function transform() {
        photoData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
        getOption();

        var d = photoData.data,
            w = photoData.width,
            line = [];
        newPhoto = [];
        for (var i = 0, l = 0, j = 0; i < d.length; i += 4) {
            l = (++j) % w;
            line.push({r: d[i], g: d[i + 1], b: d[i + 2], a: d[i + 3]});
            if (!l) {
                newPhoto.push(line);
                line = [];
            }
        }
        setFilter();

        for (var j = 0, id = 0; j < photoData.height; j++) {
            for (var i = 0; i < photoData.width; i++) {
                photoData.data[id] = newPhoto[j][i].r;
                photoData.data[id + 1] = newPhoto[j][i].g;
                photoData.data[id + 2] = newPhoto[j][i].b;
                photoData.data[id + 3] = newPhoto[j][i].a;
                id += 4;
            }
        }
        ctx.putImageData(photoData, 0, 0);
    }


    /**
     * Ustawia filter
     *
     * Przygotowuje tablice pixeli {newPhoto} w odpowiedni sposob zmodyfikowanych
     *
     * @returns {undefined}
     */
    function setFilter() {
        if (filter === "negatyw") {
            for (var i = 0; i < photoData.height; i++) {
                for (var j = 0; j < photoData.width; j++) {
                    newPhoto[i][j].g = 255 - newPhoto[i][j].g;
                    newPhoto[i][j].r = 255 - newPhoto[i][j].r;
                    newPhoto[i][j].b = 255 - newPhoto[i][j].b;
                }
            }
        } else if (filter === "szarosc") {
            var s = 0;
            for (var i = 0; i < photoData.height; i++) {
                for (var j = 0; j < photoData.width; j++) {
                    s = (newPhoto[i][j].r + newPhoto[i][j].g + newPhoto[i][j].b) / 3 - dark;
                    s = s > 255 ? 255 : (s < 0 ? 0 : s);
                    newPhoto[i][j].g = s;
                    newPhoto[i][j].r = s;
                    newPhoto[i][j].b = s;
                }
            }
        } else if (filter === "sepia") {
            for (var i = 0; i < photoData.height - 1; i++) {
                for (var j = 0; j < photoData.width - 1; j++) {
                    newPhoto[i][j].g += 2 * sepy;
                    newPhoto[i][j].r += sepy;
                }
            }
        } else if (filter === "kontur") {
            var copy = JSON.parse(JSON.stringify(newPhoto));
            for (var i = 0; i < photoData.height - 1; i++) {
                for (var j = 0; j < photoData.width - 1; j++) {
                    newPhoto[i][j].r = Math.abs(copy[i][j].r - copy[i + 1][j + 1].r) + Math.abs(copy[i + 1][j].r - copy[i][j + 1].r);
                    newPhoto[i][j].g = Math.abs(copy[i][j].g - copy[i + 1][j + 1].g) + Math.abs(copy[i + 1][j].g - copy[i][j + 1].g);
                    newPhoto[i][j].b = Math.abs(copy[i][j].b - copy[i + 1][j + 1].b) + Math.abs(copy[i + 1][j].b - copy[i][j + 1].b);
                }
            }
        } else if (filter === "kontur-2") {
            var x, y, copy = JSON.parse(JSON.stringify(newPhoto));
            for (var i = 1; i < photoData.height - 1; i++) {
                for (var j = 1; j < photoData.width - 1; j++) {
                    x = (copy[i - 1][j + 1].r + 2 * copy[i][j + 1].r + copy[i + 1][j + 1].r) - (copy[i - 1][j - 1].r + 2 * copy[i][j - 1].r + copy[i + 1][j - 1].r);
                    y = (copy[i + 1][j - 1].r + 2 * copy[i + 1][j].r + copy[i + 1][j + 1].r) - (copy[i - 1][j - 1].r + 2 * copy[i - 1][j].r + copy[i - 1][j + 1].r);
                    newPhoto[i][j].r = Math.pow((x * x + y * y), 0.5);
                    x = (copy[i - 1][j + 1].g + 2 * copy[i][j + 1].g + copy[i + 1][j + 1].g) - (copy[i - 1][j - 1].g + 2 * copy[i][j - 1].g + copy[i + 1][j - 1].g);
                    y = (copy[i + 1][j - 1].g + 2 * copy[i + 1][j].g + copy[i + 1][j + 1].g) - (copy[i - 1][j - 1].g + 2 * copy[i - 1][j].g + copy[i - 1][j + 1].g);
                    newPhoto[i][j].g = Math.pow((x * x + y * y), 0.5);
                    x = (copy[i - 1][j + 1].b + 2 * copy[i][j + 1].b + copy[i + 1][j + 1].b) - (copy[i - 1][j - 1].b + 2 * copy[i][j - 1].b + copy[i + 1][j - 1].b);
                    y = (copy[i + 1][j - 1].b + 2 * copy[i + 1][j].b + copy[i + 1][j + 1].b) - (copy[i - 1][j - 1].b + 2 * copy[i - 1][j].b + copy[i - 1][j + 1].b);
                    newPhoto[i][j].b = Math.pow((x * x + y * y), 0.5);
                }
            }
        } else if (filter === "progowanie") {
            var s = 0, k = 0;
            r = $$("#rangeProg").value;
            var p = document.getElementsByName("prog");

            for (var i = 0; i < p.length; i++) {
                if (p[i].checked === true) {
                    k = parseInt(p[i].value);
                }
            }
            console.log(k)
            for (var i = 0; i < photoData.height; i++) {
                for (var j = 0; j < photoData.width; j++) {
                    s = (newPhoto[i][j].r + newPhoto[i][j].g + newPhoto[i][j].b) / 3;
                    //s=s>r?255:0;
                    s = s > r ? (k === 1 ? s : 255) : (k === -1 ? s : 0);
                    newPhoto[i][j].g = s;
                    newPhoto[i][j].r = s;
                    newPhoto[i][j].b = s;
                }
            }
        } else if (filter === "randmaska") {
            mask(randomMask());
        } else if (filter === "wlasna3x3") {
            var ownMask = [];
            for (var i = 1; i <= 9; i++) {
                var val = Number($$("#m" + i).value);
                if (!val) {
                    val = 0;
                }
                ownMask.push(val);
            }
            mask(ownMask);
        } else if (filter === "wlasna5x5") {
            var ownMask = [];
            for (var i = 1; i <= 25; i++) {
                var val = Number($$("#n" + i).value);
                if (!val) {
                    val = 0;
                }
                ownMask.push(val);
            }
            mask(ownMask);
        } else if (filter === "akcent") {
            var c = rgbaToHsv(colorPicker.colorRgbaObj),
                r = $$("#rangeAccent").value;
            colorAccent(c, r);
        } else if (filter === "bit") {
            var color;
            for (var i = 0; i < photoData.height; i++) {
                for (var j = 0; j < photoData.width; j++) {
                    color = newPhoto[i][j];
                    newPhoto[i][j].g = Math.round(color.g / 50) * 50;
                    newPhoto[i][j].r = Math.round(color.r / 50) * 50;
                    newPhoto[i][j].b = Math.round(color.b / 50) * 50;
                }
            }

        } else if (filter === "lab") {
            var r = Math.random() * 255,
                g = Math.random() * 255,
                b = Math.random() * 255;

            for (var i = 0; i < photoData.height; i++) {
                for (var j = 0; j < photoData.width; j++) {
                    newPhoto[i][j].g = (newPhoto[i][j].g + r) % 255;
                    newPhoto[i][j].r = (newPhoto[i][j].r + g) % 255;
                    newPhoto[i][j].b = (newPhoto[i][j].b + b) % 255;
                }
            }
        }


    }

    /**
     * Filter akcentu kolorystycznego
     *
     * DO: jeżeli kolor pixelu nalezy do przedzialu podanego w argumentach funkcji pozostaje
     *      niezmieniony w innym przypadku zamieniany jest na odcień szarości
     *
     * @param {object} colorA kolor akcentu
     * @param {int} r przdział akceptacji koloru
     * @returns {undefined}
     */
    function colorAccent(colorA, r) {
        var h1 = (colorA.h - r / 2 + 360) % 360,
            h2 = (colorA.h + r / 2 + 360) % 360,
            and = h1 <= h2;
        for (var i = 0; i < photoData.height; i++) {
            for (var j = 0; j < photoData.width; j++) {
                var color = rgbaToHsv($$.clone(newPhoto[i][j]));
                if ((and && color.h > h1 && color.h < h2) || (!and && (color.h > h1 || color.h < h2))) {
                    //don't change
                } else {
                    var ave = (newPhoto[i][j].r + newPhoto[i][j].g + newPhoto[i][j].b) / 3;
                    newPhoto[i][j].g = ave;
                    newPhoto[i][j].r = ave;
                    newPhoto[i][j].b = ave;
                }
            }
        }

    }


    /**
     * Transformacja wedlug podanej maski
     *
     * DO: transformuje zdjecie wedlug danej maski przekazanej jako parametr
     *
     * @param {array} mask
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
            copy = JSON.parse(JSON.stringify(newPhoto));

        sum = sum ? sum : 1;
        for (var i in mask) {
            mask[i] /= sum;
        }

        var y = photoData.height - margin,
            x = photoData.width - margin;
        for (var i = margin; i < y; i++) {
            for (var j = margin; j < x; j++) {
                color = getColor(j, i, mask, copy, margin);
                newPhoto[i][j].r = color.r;
                newPhoto[i][j].g = color.g;
                newPhoto[i][j].b = color.b;
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

var bl = {
    showMatrix3: "mask3x3",
    showMatrix5: "mask5x5",
    accent: "pickColor",
    progButton: "prog"
};


$$('html').addEventListener("click", function () {
    var m3 = $$('#mask3x3'),
        m5 = $$('#mask5x5'),
        p = $$("#prog"),
        c = $$('#pickColor');


    if (!m3.isHidden()) {
        m3.fadeOut(200);
    }
    if (!m5.isHidden()) {
        m5.fadeOut(200);
    }
    if (!c.isHidden()) {
        c.fadeOut(200);
    }
    if (!p.isHidden()) {
        p.fadeOut(200);
    }
});

$$('#showMatrix3').addEventListener("click", function (e) {
    e.stopPropagation();
    if ($$('#mask3x3').isHidden()) {
        $$('#mask3x3').fadeIn(200);
    }
});
$$('#showMatrix5').addEventListener("click", function (e) {
    e.stopPropagation();
    if ($$('#mask5x5').isHidden()) {
        $$('#mask5x5').fadeIn(200);
    }
});

$$('#accent').addEventListener("click", function (e) {
    e.stopPropagation();
    if ($$('#pickColor').isHidden()) {
        $$('#pickColor').fadeIn(200);
    }
});

$$('#progButton').addEventListener("click", function (e) {
    e.stopPropagation();
    if ($$('#prog').isHidden()) {
        $$('#prog').fadeIn(200);
    }
});


$photo.init();
colorPicker.install({element: "accent"});
