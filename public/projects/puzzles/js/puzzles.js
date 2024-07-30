/* global $$, $puzzles */
$puzzles = new (function () {
    var area,
        src,
        x,
        y,
        imgWidth,
        imgHeight,
        divWidth,
        divHeight,
        mouseY,
        mouseX,
        puzzles = [],
        dragElement,
        returnElement,
        isMove = false,
        size = 5,
        frame = '/projects/puzzles/image/frame' + size + '.png',
        leyPuzzles = 0;
    this['newGame'] = function (img, nr) {
        $$.addEvent(window, 'mouseup', moveStop);
        $$.addEvent(window, 'mousemove', mousePoss);
        area = $$('#puzzleArea');

        y = window.innerHeight - 75;
        x = window.innerWidth - 25;
        //area.height(y);
        area.width(x);

        if (img === 'KOM') {
            $$('#select').fadeOut(300, function () {
                $$('#puzzleArea').fadeIn(300);
            });

            var reader = new FileReader();
            var file = $$('#image');

            reader.onload = function (e) {
                src = e.target.result;
                imageInfo();
            };
            reader.readAsDataURL(file.files[0]);
        } else if (img === 'URL') {
            $$('#select').fadeOut(300, function () {
                $$('#puzzleArea').fadeIn(300);
            });
            src = $$('#photoURL').value;
            imageInfo();
        } else {
            $$('#sample').fadeOut(300, function () {
                $$('#puzzleArea').fadeIn(300);
            });

            src = '/projects/puzzles/image/img' + (nr || 1) + '.jpg';
            //src = "img/img"+(nr||1)+".jpg";
            imageInfo();
        }
    };

    function prepareDivs() {
        for (var i = 0; i < 25; i++) {
            var k = document.createElement('DIV');
            k.id = 'puzzle' + (i + 1);
            area.appendChild(k);
        }
        for (var i = 0, t = 0, l = 0; i < 25; i++) {
            l = i % 5;
            if (i && !l) {
                t++;
            }
            var div = $$('#puzzle' + (i + 1)),
                a = Math.random() * 120 - 60,
                max = Math.max(divWidth, divHeight),
                ranX = Math.random() * (x - max - 10) + 5,
                ranY = Math.random() * (y - max / 2);

            div.addClass('puzzle');
            rotateDiv(div, a);
            div.addEvent('mousedown', moveStart);

            div.css({
                top: ranY + 'px',
                left: ranX + 'px',
                background:
                    'url(' +
                    src +
                    ') -' +
                    l * divWidth +
                    'px -' +
                    t * divHeight +
                    'px',
                height: divHeight + 'px',
                width: divWidth + 'px',
            });
            puzzles.push(
                new PuzzlesElement(div, l * divWidth, t * divHeight, ranX, ranY, a),
            );
        }
    }

    function moveStart(e) {
        var id = Number(e.target.id.replace(/\D/g, ''));
        if (!puzzles[id - 1].check) {
            isMove = true;
            dragElement = id;
            puzzles[dragElement - 1].el.css({cursor: 'move', zIndex: 9, opacity: 1});
            rotateDiv(puzzles[dragElement - 1].el, 0);
            moveDiv();
        }
    }

    function moveDiv() {
        if (isMove) {
            puzzles[dragElement - 1].el.css({
                top: mouseY - divHeight / 2 - 60 + 'px',
                left: mouseX - divWidth / 2 + 'px',
            });
            puzzles[dragElement - 1].curr.y = mouseY - divHeight / 2 - 60;
            puzzles[dragElement - 1].curr.x = mouseX - divWidth / 2;
            window.setTimeout(moveDiv, 50);
        }
    }

    function moveStop(e) {
        if (isMove) {
            isMove = false;
            var div = puzzles[dragElement - 1];
            var d = getPos();
            puzzles[dragElement - 1].el.css({
                cursor: 'auto',
                zIndex: 'initial',
                opacity: 0.8,
            });
            if (
                Math.abs(mouseX - d.x - divWidth / 2 - div.pass.x) < 10 &&
                Math.abs(mouseY - d.y - divHeight / 2 - div.pass.y) < 10
            ) {
                div.check = true;
                div.el.css({
                    top: div.pass.y + 'px',
                    left: div.pass.x + 'px',
                    opacity: 1,
                });
                $$('#puzzleAreaLay').appendChild(area.removeChild(div.el));
                if (++leyPuzzles === size * size) {
                    showMSG('Brawo! Udało Ci się ułożyć wszystkie puzzle', 1);
                    leyPuzzles = 0;
                    puzzles = [];
                }
            } else {
                returnElement = dragElement;
                rotateDiv(
                    puzzles[dragElement - 1].el,
                    puzzles[dragElement - 1].angle,
                );
                returnDiv(div);
            }
        }
    }

    function getPos() {
        var el = $$('#puzzleAreaLay');
        for (
            var lx = 0, ly = 0;
            el != null;
            lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent
        );
        return {x: lx, y: ly};
    }

    function returnDiv(div) {
        div.step.x = (div.ran.x - div.curr.x) / 5;
        div.step.y = (div.ran.y - div.curr.y) / 5;
        animation();
    }

    function animation() {
        var moveStop = true;
        var div = puzzles[returnElement - 1];
        if (Math.abs(div.ran.x - div.curr.x) > 2 * Math.abs(div.step.x)) {
            moveStop = false;
            div.curr.x += div.step.x;
        } else {
            div.curr.x = div.ran.x;
        }

        if (Math.abs(div.ran.y - div.curr.y) > 2 * Math.abs(div.step.y)) {
            moveStop = false;
            div.curr.y += div.step.y;
        } else {
            div.curr.y = div.ran.y;
        }
        div.el.css({left: div.curr.x + 'px', top: div.curr.y + 'px'});

        if (!moveStop) {
            window.setTimeout(animation, 20);
        }
    }

    function rotateDiv(div, deg) {
        div.style.webkitTransform = 'rotate(' + deg + 'deg)';
        div.style.mozTransform = 'rotate(' + deg + 'deg)';
        div.style.msTransform = 'rotate(' + deg + 'deg)';
        div.style.oTransform = 'rotate(' + deg + 'deg)';
        div.style.transform = 'rotate(' + deg + 'deg)';
    }

    function imageInfo() {
        var img = new Image();

        img.onload = function () {
            imgWidth = img.width;
            imgHeight = img.height;
            if (imgWidth > x || imgHeight > y) {
                $$.delay(function () {
                    $$('#select').show();
                    $$('#puzzleArea').hide();
                    showMSG('Zbyt wielki rozmiar obrazka!', 0);
                }, 1000);
            } else {
                $$('#puzzleAreaLay')
                    .width(imgWidth + 0.01)
                    .height(imgHeight + 0.01)
                    .css('backgroundImage', 'url(' + frame + ') ')
                    .show();
                $$('#imageView').src = src;
                $$('#imageView').height = (imgWidth / imgHeight) * 200;
                divHeight = imgHeight / 5;
                divWidth = imgWidth / 5;
                prepareDivs();
            }
        };
        img.src = src;
    }

    function mousePoss(a) {
        mouseX = a.clientX;
        mouseY = a.clientY;
    }
})();

function imageExists() {
    var img = new Image();
    img.onload = function () {
        $$('.URL').hide();
        $puzzles.newGame('URL');
    };
    img.onerror = function () {
        showMSG('Nie znaleziono obarazka o podanym URL', 0);
    };
    img.src = $$('#photoURL').value;
}

function showMSG(mesage, ok) {
    $$('.MSG')
        .fadeIn()
        .setText(mesage)
        .removeClass('ok')
        .removeClass('error')
        .addClass(ok ? 'ok' : 'error');
}

function reset() {
    $$('#puzzleArea').fadeOut(300, function () {
        $$('#select').fadeIn(300);
        $$('#puzzleAreaLay').empty();
    });
    $$('#sample').hide();
    $$('.MSG').hide();
    $$('#imageView').src = '';
}

function PuzzlesElement(el, x, y, ranX, ranY, a) {
    this.el = el;
    this.pass = new Point(x, y);
    this.curr = new Point();
    this.step = new Point();
    this.ran = new Point(ranX, ranY);
    this.angle = a;
    this.check = false;
}

function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}
