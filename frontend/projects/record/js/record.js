_record = function (canv, sett) {

    var buffor = [];

    var send = [];

    var nrSend = 0;

    var name = makeId();

    var canvas;

    var pause = true;

    var recording = false;

    var maxBufforSize = 5;

    var timeStart;

    var timeRecording = 0;

    var timeLastFrame;

    var time;

    var fps = 10;

    var settings;

    var loop;

    var url = "/projects/ajax";

    this.start = function () {
        if (!recording) {
            pause = false;
            recording = true;
            timeStart = (new Date()).getTime();
            loop = setInterval(saveFrame, 1000 / fps);
        }
    };

    this.stop = function () {
        recording = false;
        pause = true;
        clearInterval(loop);
    };

    this.pause = function () {
        pause = true;
        clearInterval(loop);
    };

    this.getVideo = function () {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                console.log(xhttp.responseText);
            }
        };
        xhttp.open("POST", url + "Video", true);
        xhttp.setRequestHeader("Content-Type",
            "application/x-www-form-urlencoded");
        xhttp.send("name=" + name);

    };

    function init(canv, sett) {
        canvas = canv;
        settings = sett;
        return this;
    }

    function saveFrame() {
        if (recording && !pause) {
            buffor.push(canvas.toDataURL());
            if (buffor.length >= maxBufforSize) {
                send.push(buffor);
                buffor = [];
                sendData();
            }
        }
    }

    function sendData() {
        var toSend = send.shift();
        var data = {name: name, photo: toSend};
        console.log("Poszła paczka nr " + nrSend);
        ajax(data);

        nrSend++;
    }

    function ajax(data) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                console.log("Zapisano paczke " + xhttp.responseText);
            }
        };
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-Type",
            "application/x-www-form-urlencoded");
        xhttp.send("data=" +
            encodeURIComponent(JSON.stringify(data)) + "&number=" + nrSend);
    }

    function makeId() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 25; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    init(canv, sett);
};

function Record(c, s) {
    return new _record(c, s);
}