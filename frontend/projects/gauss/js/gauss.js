(function () {

    var countRand = document.getElementById("count-rand");
    var countIter = document.getElementById("count-itaration");
    var buttonStart = document.getElementById("app-start");
    var histogram = document.getElementById("histogram");
    var progress = document.getElementById("progress");

    for (var i = 0; i < 70; i++) {
        var bar = document.createElement("div");
        bar.className += ' bar';
        bar.id = 'bar' + (i + 1);

        var barBg = document.createElement("div");
        barBg.className += ' bar-bg';

        barBg.appendChild(bar);
        histogram.appendChild(barBg);
    }

    buttonStart.disabled = false;

    function update_progress(_i, _count) {
        progress.style.width = (_i * 100 / _count) + "%";
    }

    buttonStart.addEventListener("click", function () {
        this.disabled = true;


        var data = [];
        var bars = [];
        for (var i = 0; i < 70; i++) {
            var bar = document.getElementById("bar" + (i + 1));

            bars.push(bar);
            data.push(0);
        }

        function update_histogram(_data, _bars) {
            var max = Math.max.apply(null, _data);
            for (var i = 0; i < _data.length; i++) {
                _bars[i].style.height = (_data[i] * 380 / max) + "px";
            }
        }

        var count = Math.pow(10, parseInt(countIter.value));
        var rand = parseInt(countRand.value);

        var mod = count > 1000 ? 100 : 10;

        update_progress(0, count);

        var i = 0;
        (function loop() {
            i++;
            var val = 0;
            for (var j = 0; j < rand; j++) {
                val += Math.random();
            }
            val /= rand;

            data[Math.floor(val * 70)]++;
            if (i % mod === 0) {
                update_progress(i, count);
                update_histogram(data, bars);
            }
            if (i < count) {
                setTimeout(loop, 0);
            } else {
                update_progress(count, count);
                update_histogram(data, bars);
                document.getElementById("app-start").disabled = false;

            }
        })();
    });
})();