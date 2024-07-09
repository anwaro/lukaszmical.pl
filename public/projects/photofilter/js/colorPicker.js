var colorPicker = {
    canvas: '',
    ctx: '',
    height: '',
    width: '',
    img: '',
    colorRgba: 'rgba(255,0,0,0)',
    colorRgbaObj: {r: 255, g: 0, b: 0, a: 1},
    colorHsv: '',
    colorHex: '',
    element: '',

    install: function (opt) {
        colorPicker.canvas = document.getElementById('colorPicker');
        colorPicker.element = opt.element
            ? document.getElementById(opt.element)
            : false;
        window.addEventListener('DOMContentLoaded', colorPicker.loadImg);
    },

    loadImg: function () {
        colorPicker.img = document.createElement('img');
        colorPicker.img.onload = function () {
            colorPicker.height = this.height;
            colorPicker.width = this.width;
            colorPicker.init();
        };

        colorPicker.img.onerror = function () {
            this.src = '/projects/photofilter/image/color.png';
        };

        colorPicker.img.src = colorPicker.getImageSrc();
    },

    getImageSrc: function () {
        return '/projects/photofilter/image/color.png';
    },

    init: function () {
        if (colorPicker.canvas && colorPicker.canvas.getContext) {
            colorPicker.canvas.addEventListener('click', colorPicker.getColor);
            colorPicker.canvas.height = colorPicker.height;
            colorPicker.canvas.width = colorPicker.width;
            colorPicker.ctx = colorPicker.canvas.getContext('2d');
            colorPicker.ctx.drawImage(colorPicker.img, 0, 0);
        }
    },

    getColor: function (e) {
        var rect = colorPicker.canvas.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top,
            color = colorPicker.ctx.getImageData(x, y, 1, 1).data;
        colorPicker.colorRgba =
            'rgba(' +
            color[0] +
            ',' +
            color[1] +
            ',' +
            color[2] +
            ',' +
            color[3] / 255 +
            ')';
        colorPicker.colorRgbaObj = {
            r: color[0],
            g: color[1],
            b: color[2],
            a: color[3] / 255,
        };
        colorPicker.colorPick();
    },

    colorPick: function () {
        if (colorPicker.element) {
            colorPicker.element.style.backgroundColor = colorPicker.colorRgba;
        }
    },
};
