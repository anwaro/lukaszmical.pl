/* global $$ */

var imgWidth,
    imgHeight,
    divHeight,
    divWidth,
    area,
    areaLey,
    lx = 3,
    ly = 3,
    x,
    y,
    divs = [],
    empty,
    lock = false;

function newGame(type, nr) {
    $$.addEvent(window, 'keyup', keypress);
    area = $$('#puzzleArea');
    areaLey = $$('#puzzleAreaLay');

    y = window.innerHeight - 75;
    x = window.innerWidth - 25;
    area.width(x);

    if (type === 'KOM') {
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
    } else if (type === 'URL') {
        $$('#select').fadeOut(300, function () {
            $$('#puzzleArea').fadeIn(300);
        });
        src = $$('#photoURL').value;
        imageInfo();
    } else {
        $$('#sample').fadeOut(300, function () {
            $$('#puzzleArea').fadeIn(300);
        });

        src = '/projects/jigsaw/image/img' + (nr || 1) + '.jpg';
        //src = "img/img"+(nr||1)+".jpg";
        imageInfo();
    }
}

function prepareDivs() {
    for (var j = 0, k = 0; j < ly; j++) {
        for (var i = 0; i < lx; i++) {
            k++;
            var div = $$('<div>');
            //div.id = "block"+i+"-"+j;
            div.addClass('block')
                .height(divHeight)
                .width(divWidth)
                .css(
                    'background',
                    'url(' +
                        src +
                        ') -' +
                        i * divWidth +
                        'px -' +
                        j * divHeight +
                        'px',
                );

            divs.push(new JigsawElement(div, k));
        }
    }

    divs.pop();
    divs = shuffle(divs);
    for (var j = 0, k = 0; j < ly; j++) {
        for (var i = 0; i < ly && k < divs.length; i++) {
            divs[k].currNum = k + 1;
            divs[k].el.css({left: i * divWidth + 'px', top: j * divHeight + 'px'});
            areaLey.appendChild(divs[k].el);
            k++;
        }
    }
}

function imageInfo() {
    var img = new Image();

    img.onload = function () {
        imgWidth = img.width;
        imgHeight = img.height;
        if (imgWidth > x) {
            $$.delay(function () {
                $$('#select').show();
                $$('#puzzleArea').hide();
                showMSG('Zbyt wielki rozmiar obrazka!', 0);
            }, 1000);
        } else {
            $$('#puzzleAreaLay')
                .width(imgWidth + 0.01 + lx * 2)
                .height(imgHeight + 0.01 + ly * 2)
                .show();
            $$('#imageView').src = src;
            $$('#imageView').height = (imgWidth / imgHeight) * 200;
            $$('#imageView').show();
            divHeight = imgHeight / ly;
            divWidth = imgWidth / lx;
            empty = ly * lx;
            prepareDivs();
        }
    };
    img.src = src;
}

function keypress(evt) {
    switch (evt.keyCode) {
        case 37: // ←
            if (empty % lx) move(empty + 1, -1, 0);
            evt.stopPropagation();
            break;
        case 39: // →
            if ((empty - 1) % lx) move(empty - 1, 1, 0);
            evt.stopPropagation();
            break;
        case 40: // ↓
            if (empty - lx > 0) move(empty - lx, 0, 1);
            evt.stopPropagation();
            break;
        case 38: // ↑
            if (empty + lx <= lx * ly) move(empty + lx, 0, -1);
            evt.stopPropagation();
            break;
    }
}

function move(elNum, dx, dy) {
    if (!lock) {
        var ele = getElement(elNum);
        var currNum = ele.currNum;
        ele.currNum = empty;
        empty = currNum;
        var top = parseFloat(ele.el.css('top'));
        var left = parseFloat(ele.el.css('left'));
        ele.el.css({
            left: left + dx * divWidth + 'px',
            top: top + dy * divHeight + 'px',
        });
        lock = true;
        if (checkWin()) {
            showMSG('Brawo! Udało Ci się ułożyć wszystkie elementy', 1);
        } else {
            setTimeout(function () {
                lock = false;
            }, 110);
        }
    }
}

function checkWin() {
    var win = true;
    for (var i = 0; i < divs.length; i++) {
        if (divs[i].currNum !== divs[i].passNum) {
            win = false;
        }
    }
    return win;
}

function getElement(elNum) {
    for (var i = 0; i < divs.length; i++) {
        if (divs[i].currNum === elNum) {
            return divs[i];
        }
    }
}

function shuffle(o) {
    for (
        var j, x, i = o.length;
        i;
        j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
    );
    return o;
}

function imageExists() {
    var img = new Image();
    img.onload = function () {
        $$('.URL').hide();
        newGame('URL');
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
    $$('#imageView').hide();

    divs = [];
    lock = false;
}

document.querySelector('#reset').addEventListener('click', reset);
document.querySelector('#select1').addEventListener('click', () => {
    // console.log($$('.URL'));
    $$('.URL').hide();
    $$('#image').click();
});
document.querySelector('#select2').addEventListener('click', () => {
    $$('.URL').fadeIn();
});

document.querySelector('#select3').addEventListener('click', () => {
    $$('.URL').hide();
    $$('#select').fadeOut(300, function () {
        $$('#sample').fadeIn(300);
    });
});

document.querySelector('#confirmURL').addEventListener('click', imageExists);
document.querySelector('#message').addEventListener('click', (el) => {
    $$(el.currentTarget).fadeOut();
});
document.querySelector('#image').addEventListener('change', () => {
    newGame('KOM');
});

function JigsawElement(el, num) {
    this.el = el;
    this.passNum = num;
    this.currNum = 0;
}
