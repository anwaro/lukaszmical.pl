/* global $$ */

var $ = function (k) {
    return document.getElementById(k);
};
var urlPr = "/asset/flappy/image/";
var game = {
    user: {
        best: 0,
        score: 0,
        Up: true
    },
    set: {
        cookie: "game", name: "FlappyBird",
        x: 450, y: 630,
        g: 28,
        ground: 45,
        speed: 5,
        win: 170,
        step: 300
    },
    bird: {
        x: 100, y: 300,
        w: 50, h: 40,
        dY: 0,
        angle: 0,
        life: true,
        fly: true,
        img: new Image(),
        src: urlPr + "bird.png"
    },
    ground: {
        w: 20, h: 9, x: 0, c: "rgba(100, 100, 100, 0.55)"
    },
    columns: [],
    col: function (x, yt, yb) {
        this.h = 400;
        this.w = 66;
        this.x = x;
        this.yt = yt;
        this.yb = yb;
    },
    column: {
        img_top: new Image(),
        img_bot: new Image(),
        src_top: urlPr + "col_top.png",
        src_bot: urlPr + "col_bott.png"

    },
    canv: "",
    ctx: "",
    loop: ""

};

game.inicialize = function () {
    game.settingGame();
    game.loop = setInterval(game.play, 50);
    game.canv.addEventListener('click', game.changeSpeed);
    $$('html').addEventListener("keypress", function (e) {
        if (e.keyCode === 32) {
            e.stopPropagation();
            game.changeSpeed();
        }
    });
};

game.settingGame = function () {

    game.canv = $("GameFlappyBird");
    game.canv.height = game.set.y;
    game.canv.width = game.set.x;
    game.ctx = game.canv.getContext("2d");
    $("PlayGame").style.display = "none";

    game.bird.img.src = game.bird.src;
    game.column.img_top.src = game.column.src_top;
    game.column.img_bot.src = game.column.src_bot;
    game.pushArray();
    game.checkBestScore();
};

game.play = function () {
    game.clearBoard();
    game.moveAndDrawGround();
    game.drawColumn();
    game.moveColumn();
    game.drawBird();
    game.moveBird();
    game.checkColision();
    game.score();
};

game.changeSpeed = function (e) {
    e && e.stopPropagation();
    if (game.bird.life && game.bird.fly) {
        game.sound("up");
        game.bird.dY = -16;
    } else if (!game.bird.fly) {
        game.bird.life = true;
        game.bird.fly = true;
        drawFlappyBirdCanvas();
    }
};

game.clearBoard = function () {
    game.ctx.clearRect(0, 0, game.set.x, game.set.y);
};

game.drawBird = function () {
    var b = game.bird;
    game.ctx.save();
    game.ctx.translate(b.x, b.y);
    game.ctx.rotate(b.angle);
    game.ctx.drawImage(b.img, -b.w / 2, -b.h / 2, b.w, b.h);
    game.ctx.restore();
};

game.moveBird = function () {
    var b = game.bird;
    if (b.y < b.h / 2) {
        game.gameOver();
        b.dY = 5;
    } else if (b.y > game.set.y - (game.set.ground + b.h / 2)) {
        game.gameOver();
        game.resetGame();
        b.dY = 0;
    }
    b.y += b.dY;
    b.dY += game.set.g * 0.05;
    b.angle = (Math.PI / 2) * (b.dY / 30);
    b.angle = (b.angle > Math.PI / 2) ? Math.PI / 2 : b.angle;
};

game.drawColumn = function () {
    for (var i = 0; i < 3; i++) {
        var c = game.columns[i],
            im = game.column;
        game.ctx.drawImage(im.img_top, 0, c.h - c.yt, c.w, c.yt, c.x, 0, c.w, c.yt);
        var k = (game.set.y - game.set.ground) - c.yb;
        game.ctx.drawImage(im.img_bot, 0, 0, c.w, k, c.x, c.yb, c.w, k);
    }
};

game.moveColumn = function () {
    for (var i = 0; i < 3; i++) {
        game.columns[i].x -= game.set.speed;
        if (game.columns[i].x < -game.columns[i].w) {
            game.setColumn(game.columns[i], i);
        }
    }
};

game.moveAndDrawGround = function () {
    var g = game.ground;
    g.x -= game.set.speed;

    var k = (game.set.y - game.set.ground) + 3;
    for (var i = 0; i < 5; i++) {
        for (var j = g.x; j <= game.set.x; j += 2 * g.w) {
            game.drawSqare(j + (i % 2) * g.w, k + i * g.h, g.w, g.h, g.c);
        }
    }
    g.x = (g.x < -2 * g.w) ? g.x + 2 * g.w : g.x;
};

game.drawSqare = function (x, y, a, b, c) {
    game.ctx.fillStyle = c;
    game.ctx.beginPath();
    game.ctx.rect(x, y, a, b);
    game.ctx.closePath();
    game.ctx.fill();
};

game.pushArray = function () {
    for (var i = 0; i < 3; i++) {
        var o = new game.col(game.set.x, 100, 270);
        game.columns.push(o);
        if (i !== 0) game.setColumn(game.columns[i], i);
    }
};

game.setColumn = function (b, i) {
    var z = (i === 0) ? 2 : i - 1,
        y = Math.floor(Math.random() * (game.set.y - game.set.ground - game.set.win - 200)) + 100;
    b.x = game.columns[z].x + game.set.step;
    b.yt = y;
    b.yb = y + game.set.win;
    game.user.Up = true;
};

game.checkColision = function () {
    var b = game.bird,
        c = game.columns;
    if (game.bird.life) {
        for (var i = 0; i < 3; i++) {
            var r = Math.abs(b.x - (c[i].x + c[i].w / 2));
            if (r <= b.w / 2 + c[i].w / 2) {
                if (b.y - b.h / 2 <= c[i].yt || b.y + b.h / 2 >= c[i].yb) {
                    game.gameOver();
                } else {
                    game.scoreUp(c[i]);
                }
            }
        }
    }
};

game.gameOver = function () {
    game.set.speed = 0;
    if (game.bird.life) game.sound("crash");
    game.bird.life = false;

};

game.score = function () {
    game.ctx.save();
    game.ctx.fillStyle = 'black';
    game.ctx.textAlign = 'start';
    game.ctx.font = 'bold 20pt Calibri';
    game.ctx.fillText('score: ' + game.user.score, 5, 23);
    game.ctx.textAlign = 'end';
    game.ctx.fillText('best: ' + game.user.best, game.set.x - 5, 23);
    game.ctx.restore();
};

game.scoreUp = function (c) {
    if (Math.abs(game.bird.x - (c.x + c.w / 2)) < game.set.speed + 1 && game.user.Up) {
        game.user.score++;
        game.user.Up = false;
    }
};

game.resetGame = function () {
    game.sound("over");
    clearInterval(game.loop);
    game.ctx.save();
    game.ctx.fillStyle = 'black';
    game.ctx.textAlign = 'center';
    game.ctx.font = 'bold 40pt Calibri';
    game.ctx.fillText('GAME OVER', game.set.x / 2, game.set.y / 2 - 90);
    game.ctx.font = 'bold 20pt Calibri';
    game.ctx.fillText('Score: ' + game.user.score, game.set.x / 2, game.set.y / 2 - 30);
    game.ctx.fillText("click to play again", game.set.x / 2, game.set.y / 2);
    game.ctx.restore();
    var u = game.user,
        b = game.bird;
    game.bestScore();
    u.score = 0;
    u.Up = true;
    game.columns = [];
    b.x = 100;
    b.y = 300;
    b.dY = 0;
    b.angle = 0;
    b.fly = false;
    game.set.speed = 5;

};
game.bestScore = function () {
    var g = game.set.cookie,
        n = game.set.name;
    var score = $$.cookie("FlappyBirdScore") || 0;
    if (parseInt(score) < game.user.score) {
        $$.cookie("FlappyBirdScore", game.user.score);
    }
};

game.checkBestScore = function () {
    var g = game.set.cookie,
        n = game.set.name;
    game.user.best = $$.cookie("FlappyBirdScore") || 0;
};

function drawFlappyBirdCanvas() {
    game.inicialize();
}

game.sound = function (i) {
    document.getElementById(i).play();
};