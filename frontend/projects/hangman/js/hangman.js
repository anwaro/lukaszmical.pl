hangman = new function () {
    let photo, url, wordDiv, alph, word, info, newGame, load, check = 0, fail = 0, lock = 0;
    const alp = "AĄBCĆDEĘFGHIJKLŁMNOÓPRSTUVWYZŹŻ".split("");


    this.init = function () {
        photo = $$("#photo");
        wordDiv = $$("#wordDiv");
        alph = $$("#alphabet");
        info = $$('#info');
        newGame = $$('#new');
        load = $$("#load");

        newGame.onclick = reset;

        url = "/assets/hangman/image/";
        //load.hide();
        newGame.css("background", "url(" + url + "new.jpg)");
        photo.show();
        start();
    };

    function start() {
        load.show();
        lock = 1;
        photo.css("background", "url(" + url + "s0.jpg)");
        prepareAlph();
        getWord();
    }

    function reset() {
        fail = 0;
        check = 0;
        newGame.hide();
        info.hide();
        wordDiv.empty();
        start();

    }

    function prepareAlph() {
        alph.empty();
        for (let i in alp) {
            const but = document.createElement("button");
            but.value = alp[i];
            but.innerHTML = alp[i];
            but.onclick = butClick;
            alph.appendChild(but);
        }
    }

    function prepareWord() {
        for (let i in word.split("")) {
            const div = $$("<div>");
            div.addClass("word").addClass("off");
            wordDiv.appendChild(div);

        }
        lock = 0;
        load.hide();
    }

    function butClick(evt) {
        if (fail < 10 && check !== word.length && !lock) {
            evt.target.onclick = function () {
            };
            const val = evt.target.value;


            if (word.indexOf(evt.target.value) !== -1) {
                const block = document.getElementsByClassName("word");
                for (let i = 0; i < word.length; i++) {
                    if (word[i] === val) {
                        check++;
                        $$(block[i]).addClass("ok")
                            .setText(val);
                    }
                }

                $$(evt.target).addClass("ok");
                checkWin();
            } else {
                $$(evt.target).addClass("fail");

                setFail();
            }
        }
    }

    function setFail() {
        fail++;
        if (fail < 10) {
            photo.css("background", "url(" + url + "s" + fail + ".jpg)");
        } else {
            const block = document.getElementsByClassName("word");
            for (let i = 0; i < word.length; i++) {
                const bl = $$(block[i]);
                if (!bl.hasClass('ok')) {
                    $$(block[i]).addClass("fail").setText(word[i]);
                }
            }

            photo.css("background", "url(" + url + "s10.jpg)");
            info.css("background", "url(" + url + "over.jpg)")
                .show();
            newGame.show();
        }
    }

    function checkWin() {
        if (check === word.length) {
            info.css("background", "url(" + url + "win.jpg)")
                .show();
            newGame.show();
        }
    }

    function getWord() {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                word = xhttp.responseText.toUpperCase();
                prepareWord();
            }
        };
        xhttp.open("GET", "/api/projects/hangman");
        xhttp.send();
    }
};

hangman.init();
