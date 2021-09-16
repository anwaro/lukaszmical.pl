$$div = new function () {
    var divs = [],
        id = [],
        box = [],
        divSize = 100,
        isMove = false,
        url = "https://c2.staticflickr.com/6/5447/9001563192_c745c5d275.jpg";

    this.init = function () {
        alldiv = $$("#allDivs");
        alldiv.addEventListener("click", initAnimation, false);
        $$("#reset").addEventListener("click", reset, false);
        for (var i in alldiv.childNodes) {
            if (alldiv.childNodes[i].tagName === "DIV") {
                box.push(alldiv.childNodes[i]);
                id.push(box.length);
            }
        }

        for (var i = 0, t = 0, l = 0; i < box.length; i++) {
            l = i % 5;
            if (i && !l) {
                t++;
            }
            var div = $$("#div" + (i + 1));
            div.css({
                top: (t * divSize) + "px",
                left: (l * divSize) + "px",
                background: "url(" + url + ") -" + (l * divSize) + "px -" + (t * divSize) + "px"
            });
            divs.push(new Box(div, l * divSize, t * divSize));
        }
    };

    function initAnimation() {
        if (!isMove) {
            isMove = true;
            var z = randomize(id);
            for (var i = 0, t = 0, l = 0; i < box.length; i++) {
                l = i % 5;
                if (i && !l) {
                    t++;
                }
                var div = divs[z[i] - 1];

                div.direction.x = l * divSize;
                div.direction.y = t * divSize;
                //div.current = div.old;
                div.step.x = (div.direction.x - div.current.x) / 50;
                div.step.y = (div.direction.y - div.current.y) / 50;
            }
            animation();
        }
    }

    function reset() {
        if (!isMove) {
            isMove = true;
            for (var i = 0; i < box.length; i++) {
                var div = divs[i];
                div.direction.x = div.old.x;
                div.direction.y = div.old.y;
                div.step.x = (div.direction.x - div.current.x) / 50;
                div.step.y = (div.direction.y - div.current.y) / 50;
            }
            animation();
        }
    }

    function animation() {
        var moveStop = true;
        for (var i = 0; i < divs.length; i++) {
            var div = divs[i];
            if (Math.abs(div.direction.x - div.current.x) > 2 * Math.abs(div.step.x)) {
                moveStop = false;
                div.current.x += div.step.x;
            } else {
                div.current.x = div.direction.x;
            }

            if (Math.abs(div.direction.y - div.current.y) > 2 * Math.abs(div.step.y)) {
                moveStop = false;
                div.current.y += div.step.y;
            } else {
                div.current.y = div.direction.y;
            }
            div.el.css({left: div.current.x + "px", top: div.current.y + "px"});

        }
        if (moveStop) {
            isMove = false;
            //initAnimation();
        } else {
            window.setTimeout(animation, 20);
        }
    }

    function randomize(b) {
        var n = [], a = JSON.parse(JSON.stringify(b));
        while (a.length) {
            var ran = Math.floor(Math.random() * a.length);
            n.push(a[ran]);
            a.splice(ran, 1);
        }
        return n;
    }
};

function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

function Box(el, x, y) {
    this.el = el;
    this.old = new Point(x, y);
    this.direction = new Point();
    this.current = new Point(x, y);
    this.step = new Point();
}

$$div.init();
