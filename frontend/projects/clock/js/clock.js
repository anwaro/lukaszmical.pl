function Clock(el, type) {
    if (type === "apple") {
        var apple = new Apple(el);
        apple.click();
        setInterval(function () {
            apple.click();
        }, 1000);
    } else if (type === "kors") {
        var kors = new Kors(el);
        kors.click();
        setInterval(function () {
            kors.click();
        }, 1000);
    }


}

function Apple(el) {
    this.width = 240;
    this.height = 280;
    this.canvas = el;
    this.canvas.height = this.height;
    this.canvas.width = this.width;
    this.ctx = this.canvas.getContext("2d");
    this.time = null;
    this.rface = 90;

    this.click = function () {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.time = new Date();
        this.drawFace();
        this.drawDigital();
        this.drawHands();
    };

    this.drawHands = function () {
        var s = this.time.getSeconds(),
            mi = this.time.getMinutes(),
            h = this.time.getHours();


        var hangle = h / 12 + mi / 720 + s / 43200,
            miangle = mi / 60 + s / 3600,
            sangle = s / 60;


        this.ctx.beginPath();
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.arc(this.width / 2, this.height / 2, 4, 0, 2 * Math.PI);
        this.ctx.fill();

        this.line(0, -40, 3, hangle, "#FFFFFF");
        this.line(-15, -50, 6, hangle, "#FFFFFF");

        this.line(0, -40, 3, miangle, "#FFFFFF");
        this.line(-15, -80, 6, miangle, "#FFFFFF");

        this.line(17, -90, 2, sangle, "#49AAE0");


        this.ctx.beginPath();
        this.ctx.fillStyle = "#49AAE0";
        this.ctx.arc(this.width / 2, this.height / 2, 3, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.fillStyle = "#000000";
        this.ctx.arc(this.width / 2, this.height / 2, 1, 0, 2 * Math.PI);
        this.ctx.fill();

    };

    this.line = function (y1, y2, w, a, c) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = c;
        this.ctx.translate(this.width / 2, this.height / 2);
        this.ctx.rotate(a * 2 * Math.PI);
        this.ctx.moveTo(0, y1);
        this.ctx.lineTo(0, y2);
        this.ctx.lineWidth = w;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
        this.ctx.restore();

    };

    this.drawFace = function () {

        this.ctx.beginPath();
        this.ctx.fillStyle = "#EC0000";
        this.ctx.arc(this.width / 2, this.height / 2 - this.rface - 10, 5, 0, 2 * Math.PI);
        this.ctx.fill();

        var w, h;

        for (var i = 0; i < 60; i++) {

            this.ctx.save();
            this.ctx.beginPath();
            if (!(i % 5)) {
                w = 3;
                h = 7;
                this.ctx.fillStyle = "#FFFFFF";
            } else {
                w = 1;
                h = 6;
                this.ctx.fillStyle = "#5D5D5D";
            }

            this.ctx.translate(this.width / 2, this.height / 2);
            this.ctx.rotate(i * Math.PI / 30);
            this.ctx.rect(-w / 2, -this.rface, w, h);
            this.ctx.fill();
            this.ctx.restore();
        }

    };

    this.drawDigital = function () {

        this.ctx.save();
        this.ctx.translate(this.width / 2, this.height / 2);

        this.ctx.font = "bold 22px Courier New";
        this.ctx.fillStyle = '#FFFFFF';

        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "top";
        this.ctx.fillText("12", 0, -this.rface + 12);


        this.ctx.textAlign = "right";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("3", this.rface - 14, 0);

        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "bottom";
        this.ctx.fillText("6", 0, this.rface - 12);

        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("9", -this.rface + 14, 0);
        this.ctx.restore();

    };
}

function Kors(el) {

    this.width = 240;
    this.height = 240;
    this.canvas = el;
    this.canvas.height = this.height;
    this.canvas.width = this.width;
    this.ctx = this.canvas.getContext("2d");
    this.time = null;
    this.rface = 90;

    this.click = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.time = new Date();
        this.drawFace();
        this.drawHands();
    };


    this.drawHands = function () {
        var s = this.time.getSeconds(),
            mi = this.time.getMinutes(),
            h = this.time.getHours();

        var hangle = h / 12 + mi / 720 + s / 43200,
            miangle = mi / 60 + s / 3600,
            sangle = s / 60;


        this.ctx.beginPath();
        this.ctx.fillStyle = "#D6BD81";
        this.ctx.arc(this.width / 2, this.height / 2, 4, 0, 2 * Math.PI);
        this.ctx.fill();

        this.line(0, -50, 6, hangle, 1);

        this.line(0, -this.width / 2 + 12, 4, miangle, 2);

        this.line(17, -this.width / 2 + 10, 2, sangle, 3);


        this.ctx.beginPath();
        this.ctx.fillStyle = "#D6BD86";
        this.ctx.arc(this.width / 2, this.height / 2, 3, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.fillStyle = "#000000";
        this.ctx.arc(this.width / 2, this.height / 2, 1, 0, 2 * Math.PI);
        this.ctx.fill();
    };

    this.line = function (y1, y2, w, a) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#D6BD81";
        this.ctx.translate(this.width / 2, this.height / 2);
        this.ctx.rotate(a * 2 * Math.PI);
        this.ctx.moveTo(0, y1);
        this.ctx.lineTo(0, y2);
        this.ctx.lineWidth = w;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
        this.ctx.restore();

    };

    this.drawFace = function () {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#262626";
        this.ctx.arc(this.width / 2, this.height / 2, this.width / 2 + 2, 0, 2 * Math.PI);
        this.ctx.fill();

        var h = 28;

        for (var i = 5; i < 60; i += 5) {

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.fillStyle = "#D6BD81";


            this.ctx.translate(this.width / 2, this.height / 2);
            this.ctx.rotate(i * Math.PI / 30);
            this.ctx.rect(-4 / 2, -this.width / 2 + 10, 4, h);
            this.ctx.fill();
            this.ctx.restore();
        }
        this.ctx.save();
        this.ctx.translate(this.width / 2, this.height / 2);
        this.ctx.fillStyle = "#D6BD81";

        this.ctx.beginPath();
        this.ctx.rect(-6, -this.width / 2 + 10, 4, h);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.rect(2, -this.width / 2 + 10, 4, h);
        this.ctx.fill();
        this.ctx.font = "12px Courier New";

        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "top";
        this.ctx.fillText("MICHAEL KORS", 0, -this.rface + 50);
        this.ctx.restore();
    };
}

Clock(document.getElementById("clock1"), "apple");
Clock(document.getElementById("clock2"), "kors");
