/* global $$, canvas, canvas2, input, ctx, ctx2 */

$photo = new function () {
    var canvas, canvas2,
        ctx, ctx2,
        input,
        Im,
        photoData,
        newPhoto = [],
        step = 25;


    this.init = function () {
        canvas = document.getElementById("photoCanvas");
        canvas2 = document.getElementById("photoHide");
        input = document.querySelector("#photo");
        if (canvas && canvas.getContext) {
            ctx = canvas.getContext("2d");
            ctx2 = canvas2.getContext("2d");
            input.addEventListener('change', loadPhoto);
            document.querySelector("#range").addEventListener('change', transform);
            document.querySelector("#pixel").addEventListener('change', transform);
            document.querySelector("#circle").addEventListener('change', transform);
            document.querySelector("#dots").addEventListener('change', transform);
        }
    };

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

    function transform() {
        photoData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
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
        step = parseInt(document.getElementById("range").value);

        if (document.querySelector("#pixel").checked) {

            for (var i = 0; i < photoData.width; i += step) {
                for (var j = 0; j < photoData.height; j += step) {
                    setAverage(i, j);
                }
            }
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
        } else if (document.querySelector("#circle").checked) {
            step = Math.max(step, 5);
            ctx.clearRect(0, 0, photoData.width, photoData.height);
            for (var i = 0; i < photoData.width; i += step) {
                for (var j = 0; j < photoData.height; j += step) {
                    ctx.fillStyle = setAverage(i, j);
                    ctx.beginPath();
                    ctx.arc(i + 0.5 * step, j + 0.5 * step, 0.5 * step, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.fill();
                }
            }
        } else if (document.querySelector("#dots").checked) {
            step = 5;//Math.max(step , 5);
            var c;
            ctx.clearRect(0, 0, photoData.width, photoData.height);
            for (var i = 0; i < photoData.width; i += step) {
                for (var j = 0; j < photoData.height; j += step) {
                    c = (255 - setAverage(i, j, true)) * 0.2;
                    ctx.fillStyle = "black";
                    for (var s = 0; s < c; s++) {
                        ctx.beginPath();
                        ctx.arc(i + Math.random() * step, j + Math.random() * step, 0.5, 0, Math.PI * 2, true);
                        ctx.closePath();
                        ctx.fill();
                    }
                }
            }
        }


    }

    function setAverage(x, y, avg) {
        avg = avg || 0;
        var r = 0, g = 0, b = 0, a = 0,
            maxX = Math.min(x + step, photoData.width),
            maxY = Math.min(y + step, photoData.height),
            s = 0;

        for (var i = y; i < maxY; i++) {
            for (var j = x; j < maxX; j++) {
                r += newPhoto[i][j].r;
                g += newPhoto[i][j].g;
                b += newPhoto[i][j].b;
                a += newPhoto[i][j].a;
                s++;
            }
        }
        r /= s;
        g /= s;
        b /= s;
        a /= s;
        for (var i = y; i < maxY; i++) {
            for (var j = x; j < maxX; j++) {
                newPhoto[i][j].r = r;
                newPhoto[i][j].g = g;
                newPhoto[i][j].b = b;
                newPhoto[i][j].a = a;
            }
        }
        var k = parseInt((r + g + b) / 3);
        return avg ? k : "rgb( " + parseInt(r) + ", " + parseInt(g) + ", " + parseInt(b) + ")";
    }

};

$photo.init();
