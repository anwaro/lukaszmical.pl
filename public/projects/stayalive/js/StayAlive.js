/*
 * Draw curve
 */

$$StayAlive = new (function () {
    const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Phone/i.test(
            navigator.userAgent,
        );
    let canvas,
        ctx,
        game,
        mouseX = 100,
        mouseY = 300;
    const player = new Player(4, 5);
    let life = false,
        mines = [],
        snow = [],
        tail = [],
        shield = new Shield(-1, 0),
        canvasWidth,
        canvasHeight,
        startTime,
        prevTime,
        currentTime,
        startVelocity = 2,
        currentVeocity = 2;
    const deltaVelocity = 2e-4,
        music = {
            load: 0,
            switcher: 1,
            ready: '',
            play: '',
            bonus: '',
            bang: '',
            crash: '',
        };
    let score,
        highScore,
        startButton,
        infoElement,
        musicSwitcher,
        gameOverInfo,
        scoreElement,
        scoreInfo,
        highScoreInfo,
        timeInfo,
        load,
        textInfo;
    const c = {x: 0, y: 0};

    this.init = function () {
        game = $$('#game');
        startButton = $$('#playGame');
        infoElement = $$('#gameInfo');
        musicSwitcher = $$('#gameSound');
        gameOverInfo = $$('#gover');
        scoreElement = $$('#yourscore');
        scoreInfo = $$('#yourcs');
        highScoreInfo = $$('#bestcs');
        timeInfo = $$('#time');
        textInfo = $$('#textInfo');
        canvas = $$('#StayAlive');
        load = $$('#load');

        if (canvas && canvas.getContext) {
            resize();
            ctx = canvas.getContext('2d');
            window.addEventListener('resize', resize);
            canvas.addEventListener('mousemove', mousePossition);
            //canvas.addEvent('mouseleave', gameOver);
            startButton.addEventListener('click', newGame);
            canvas.addEventListener('touchstart', touchStart, false);
            document.addEventListener('touchmove', touchMove, false);
            musicSwitcher.addEventListener('click', musicSwitch);
            highScoreInfo.setText($$.cookie('StayAliveHightScore') || 0);
            loadSound();
        }
    };

    function loadSound() {
        music.ready = new buzz.sound('/projects/stayalive/sound/ready', {
            formats: ['mp3', 'ogg'],
        });
        music.play = new buzz.sound('/projects/stayalive/sound/play', {
            formats: ['mp3', 'ogg'],
        });
        music.bonus = new buzz.sound('/projects/stayalive/sound/bonus', {
            formats: ['mp3', 'ogg'],
            volume: 10,
        });
        music.bang = new buzz.sound('/projects/stayalive/sound/bang', {
            formats: ['mp3', 'ogg'],
        });
        music.crash = new buzz.sound('/projects/stayalive/sound/crash', {
            formats: ['mp3', 'ogg'],
        });

        music.ready.load().loop().bind('loadeddata', loaded);
        music.play.load().loop().bind('loadeddata', loaded);
        music.bonus.load().loop().bind('loadeddata', loaded);
        music.bang.load().bind('loadeddata', loaded);
        music.crash.load().bind('loadeddata', loaded);

        if ($$.cookie('StayAliveSound') === 'off') {
            music.switcher = 0;
            musicSwitcher.addClass('off');
        }
    }

    function loaded() {
        music.load++;
        if (music.load === 5) {
            if (isMobile) {
                setInterval(playGame, 1000 / 30);
            } else {
                setInterval(playGame, 1000 / 60);
            }
            load.fadeOut(500, function () {
                $$('#game').fadeIn(1500);
            });
            //setTimeout(function() { game.fadeIn(1500);}, 600);

            if (music.switcher) {
                music.ready.play();
            }
        }
    }

    function mousePossition(a) {
        const rect = canvas.getBoundingClientRect();
        mouseX = a.clientX - rect.left;
        mouseY = a.clientY - rect.top;
    }

    function touchStart(a) {
        if (a.touches.length === 1) {
            a.preventDefault();
            mouseX = a.touches[0].pageX - (window.innerWidth - canvasWidth) * 0.5;
            mouseY = a.touches[0].pageY - (window.innerHeight - canvasHeight) * 0.5;
        }
    }

    function touchMove(a) {
        if (a.touches.length === 1) {
            a.preventDefault();
            mouseX = a.touches[0].pageX - (window.innerWidth - canvasWidth) * 0.5;
            mouseY = a.touches[0].pageY - (window.innerHeight - canvasHeight) * 0.5;
        }
    }

    function distanceTo(a, b) {
        return Math.sqrt(
            (a.position.x - b.position.x) * (a.position.x - b.position.x) +
                (a.position.y - b.position.y) * (a.position.y - b.position.y),
        );
    }

    function randomPossition() {
        const b =
                (Math.min(canvasHeight, canvasWidth) /
                    Math.max(canvasHeight, canvasWidth)) *
                0.5,
            i = Math.random();
        if (canvasHeight < canvasWidth) {
            c.x = i < b ? canvasWidth + 1 : Math.random() * canvasWidth;
            c.y = c.x > canvasWidth ? Math.random() * canvasHeight : -1;
        } else {
            c.x = i > b ? canvasWidth + 1 : Math.random() * canvasWidth;
            c.y = c.x > canvasWidth ? Math.random() * canvasHeight : -1;
        }
    }

    function updateShield() {
        randomPossition();
        shield = new Shield(c.x, c.y);
    }

    function resize() {
        canvasWidth = isMobile
            ? window.innerWidth
            : window.innerWidth > 800
              ? 800
              : window.innerWidth;
        canvasHeight = isMobile
            ? window.innerHeight
            : window.innerHeight > 500
              ? 500
              : window.innerHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        if (isMobile) {
            currentVeocity = startVelocity = 1.5 * startVelocity;
            game.css({
                margin: '0',
                height: canvasHeight + 'px',
                width: canvasWidth + 'px',
            });
        } else {
            game.css({
                marginTop: (window.innerHeight - canvasHeight) / 2 + 'px',
                marginLeft: (window.innerWidth - canvasWidth) / 2 + 'px',
                width: canvasWidth + 'px',
            });
        }
    }

    function newGame() {
        if (life === false) {
            startTime = new Date().getTime();
            randomPossition();
            life = true;
            tail = [];
            snow = [];
            mines = [];
            shield = new Shield(c.x, c.y);
            score = 0;
            currentVeocity = startVelocity;
            player.position.x = mouseX = 50;
            player.position.y = mouseY = 50;
            infoElement.hide();
            textInfo.hide();
            tail.push(new Point(player.position.x - 1, player.position.y - 1));
            sound('play');
        }
    }

    function gameOver() {
        if (life) {
            sound('crash');
            life = false;
            player.shield.life = false;
            newSnow(90);
            score = Math.ceil(score);
            life = false;
            gameOverInfo.show();
            infoElement.show();
            scoreInfo.setText(score);
            highScoreInfo.setText($$.cookie('StayAliveHightScore'));
            if (parseInt($$.cookie('StayAliveHightScore') || 0) < score)
                $$.cookie('StayAliveHightScore', score);
            sound('ready');
        }
    }

    function newSnow(a) {
        for (let i = 0; i < a; i++) {
            const b = new Point(player.position.x, player.position.y);
            b.xVeocity =
                0.8 * Math.cos(3.14 * Math.random()) * (Math.random() + 0.5);
            b.yVeocity =
                0.8 * Math.cos(3.14 * Math.random()) * (Math.random() + 0.5);
            b.start = currentTime;
            b.time = 1100 + 500 * Math.random();
            snow.push(b);
        }
    }

    function musicSwitch() {
        if (music.switcher) {
            music.switcher = false;
            $$.cookie('StayAliveSound', 'off');
            music.ready.stop();
            music.play.stop();
            musicSwitcher.addClass('off');
        } else {
            music.switcher = true;
            $$.cookie('StayAliveSound', 'on');
            music.ready.play();
            musicSwitcher.removeClass('off');
        }
    }

    function sound(a) {
        if (music.switcher) {
            switch (a) {
                case 'play':
                    music.bonus.isMuted() || music.ready.fadeWith(music.play, 500);
                    music.ready.isMuted() || music.bonus.fadeWith(music.play, 500);
                    break;
                case 'ready':
                    music.bonus.isMuted() || music.play.fadeWith(music.ready, 500);
                    music.play.isMuted() || music.bonus.fadeWith(music.ready, 500);
                    break;
                case 'bonus':
                    music.play.fadeWith(music.bonus, 500);
                    break;
                case 'bang':
                    music.bang.stop();
                    music.bang.play();
                    break;
                case 'crash':
                    music.crash.play();
                    break;
            }
        }
    }

    function playGame() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        //set current time
        currentTime = new Date().getTime();

        //update player postion
        player.position.x += (mouseX - player.position.x) * 0.14;
        player.position.y += (mouseY - player.position.y) * 0.14;

        // create new mines
        randomPossition();
        Math.random() > 0.7 || mines.push(new Mine(c.x, c.y));

        // add new shield
        shield.life || Math.random() > 0.001 || updateShield();

        // move and remove mines outside canvas

        for (var i = 0; i < mines.length; i++) {
            if (
                !(
                    (mines[i].position.x < -10 ||
                        mines[i].position.y > canvasHeight + 10) &&
                    mines.splice(i, 1)
                )
            ) {
                mines[i].position.x -= mines[i].veriocity * currentVeocity;
                mines[i].position.y += mines[i].veriocity * currentVeocity;
                ctx.fillStyle = '#B20000';
                ctx.beginPath();
                ctx.arc(
                    mines[i].position.x,
                    mines[i].position.y,
                    mines[i].size / 2,
                    0,
                    Math.PI * 2,
                    true,
                );
                ctx.closePath();
                ctx.fill();
            }
        }

        // add new point to tail
        tail.push(new Point(player.position.x, player.position.y));

        // remove last point from tail if include more then 50 points
        tail.length < 50 || tail.shift();

        //move and remove snow outside canvas or when time is out
        for (var i = 0; i < snow.length; i++) {
            snow[i].position.x += snow[i].xVeocity - currentVeocity;
            snow[i].position.y += snow[i].yVeocity + currentVeocity;
            if (
                !(
                    (snow[i].position.x < -10 ||
                        snow[i].position.y > canvasHeight + 10 ||
                        currentTime - snow[i].start > snow[i].time) &&
                    snow.splice(i, 1)
                )
            ) {
                ctx.fillStyle = '#E6E6E6';
                ctx.beginPath();
                ctx.arc(
                    snow[i].position.x,
                    snow[i].position.y,
                    1,
                    0,
                    Math.PI * 2,
                    true,
                );
                ctx.closePath();
                ctx.fill();
            }
        }

        shield.position.x -= currentVeocity;
        shield.position.y += currentVeocity;
        if (shield.position.x < -10 || shield.position.y > canvasHeight + 10) {
            shield.life = false;
        } else if (shield.life) {
            ctx.fillStyle = 'rgba(123, 11, 175, .1)';
            for (var i = 0; i < shield.size; i += 0.5) {
                ctx.beginPath();
                ctx.arc(
                    shield.position.x,
                    shield.position.y,
                    i,
                    0,
                    Math.PI * 2,
                    true,
                );
                ctx.closePath();
                ctx.fill();
            }
        }

        if (life) {
            // score up
            score += 0.5;

            //update veocity
            currentVeocity += deltaVelocity;

            //check colision with bonus BGC
            if (
                shield.life &&
                distanceTo(player, shield) < player.size + shield.size
            ) {
                player.shield.life = true;
                player.shield.size = 60;
                shield.life = false;
                sound('bonus');
            }

            //check player is overside canvas
            if (
                player.position.x < 6 ||
                player.position.y < 6 ||
                player.position.x > canvasWidth - 6 ||
                player.position.y > canvasHeight - 26
            ) {
                gameOver();
            }

            //check colision
            for (var i = 0; i < mines.length; i++) {
                if (
                    player.shield.life &&
                    distanceTo(player, mines[i]) <
                        player.size + mines[i].size / 2 + 20
                ) {
                    mines.splice(i, 1);
                    score += 10;
                    newSnow(10);
                    sound('bang');
                } else if (
                    distanceTo(player, mines[i]) <
                    player.size + mines[i].size / 2
                ) {
                    gameOver();
                    break;
                }
            }

            // draw shield
            if (player.shield.life) {
                player.shield.size -= 0.2;
                const k = Math.min(player.shield.size, 40);
                for (var i = 2; i < k; i++) {
                    ctx.fillStyle = 'rgba(123, 11, 175, 0.02)';
                    ctx.beginPath();
                    ctx.arc(
                        player.position.x,
                        player.position.y,
                        i + 8,
                        0,
                        Math.PI * 2,
                        true,
                    );
                    ctx.closePath();
                    ctx.fill();
                }
                if (player.shield.size < 1) {
                    player.shield.life = false;
                    sound('play');
                }
            }
            // draw tail
            ctx.strokeStyle = player.shield.life
                ? 'rgba(123, 11, 175, 0.5)'
                : 'rgba(41, 163, 163, 0.6)';
            const n = [];
            for (var i = 0; i < tail.length; i++) {
                tail[i].position.x -= currentVeocity;
                tail[i].position.y += currentVeocity;
                n.push(tail[i].position.x);
                n.push(tail[i].position.y);
            }
            ctx.beginPath();
            ctx.moveTo(n[0], n[1]);
            ctx.curve(n, 0.4, 10, 0);
            ctx.stroke();
            ctx.lineWidth = 2;
            ctx.stroke();

            //draw player
            ctx.fillStyle = player.shield.life
                ? 'rgba(123, 11, 175, 0.1)'
                : 'rgba(41, 163, 163, .1)';
            for (var i = 0; i < player.size + 1; i += 0.5) {
                ctx.beginPath();
                ctx.arc(
                    player.position.x,
                    player.position.y,
                    i,
                    0,
                    Math.PI * 2,
                    true,
                );
                ctx.closePath();
                ctx.fill();
            }

            // draw time and score
            timeInfo.setText(
                'Score: ' +
                    score.toFixed() +
                    ' Time ' +
                    ((currentTime - startTime) / 1000).toFixed(1),
            );
        }
        //set prev time as current time
        prevTime = currentTime;
    }
})();

function Point(a, b) {
    this.position = {x: a, y: b};
}

function Player(a, b) {
    this.position = {x: a, y: b};
    this.size = 6;
    this.shield = {life: 0, start: 0, size: 0};
}

function Mine(a, b) {
    this.position = {x: a, y: b};
    this.size = 6 + Math.random() * 4;
    this.veriocity = 1 + Math.random() * 0.4;
}

function Shield(a, b) {
    this.position = {x: a, y: b};
    this.size = 8 + Math.random() * 4;
    this.life = true;
}

$$StayAlive.init();
