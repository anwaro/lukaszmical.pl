/*************GLOBAL VARIBLE TO CONFIG GAME***************/
const Game = {
    BlockWidth: 50,
    BlockHeight: 25,
    NumX: 10,
    NumY: 4,
    boardX: 0,
    boardY: 0,
    boardYwithMenu: 0,
    MenuY: 50,
    Score: 0,
    Level: 1,
    Life: 3,
    pause: true,
    NumTrance: 70,
    titleFontSize: "bold 24px Georgia",
    MenuFontSize: "bold 20px Georgia",

};

Game.boardX = Game.BlockWidth * Game.NumX;
Game.boardY = Game.BlockHeight * Game.NumY + 300;
Game.boardYwithMenu = Game.boardY + Game.MenuY;

const Mouse = {
    MouseX: Game.boardX / 2,
    PrevMouse: 0,
    PrevMouse2: 0,
    dM: 0,
    dM2: 0,
};

const Bar = {
    width: 100,
    height: 20,
    posX: 160,
    posY: Game.boardYwithMenu - 25,
};

function Balls(color, rad) {
    this.posX = Game.boardX / 2;
    this.posY = 300;
    this.color = color,
        this.dX = Math.pow(-1, (Math.ceil(Math.random() * 10)) % 10) * (Math.random() * 3 + 2);
    this.dY = -9;
    this.radius = rad;
}

function Block(BlockX, BlockY) {
    this.posX = BlockX;
    this.posY = BlockY;
    this.display = 0;
}

let canvas, ctx, gameLoop;
let x1, x2, y1, y2, Alfa = 0;
let MenuGradient, BoardGradient, BarGradient;
const BlockGradient = [];
const Trance = [];
const Area = [];
const Ball = new Balls("rgb(255,50,0)", 9);

for (var i = 0; i < Game.NumTrance; i++) {
    Trance[i] = new Balls("rgb(255," + (80 + i) + ",0)", Ball.radius - ((Ball.radius - 1) / Game.NumTrance) * (i + 1));
}

for (var i = 0; i < Game.NumX; i++) {
    Area[i] = [];
    for (var j = 0; j < Game.NumY; j++) {
        Area[i][j] = new Block(i * Game.BlockWidth, j * Game.BlockHeight + Game.MenuY);
        Area[i][j].display = 1;
    }
}

/**********************MAIN FUNCTION************************/

function init() {
    ResetGame();
    canvas = document.getElementById("squash");
    canvas.height = Game.boardYwithMenu;
    canvas.width = Game.boardX;
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        MakeGradient();
        gameLoop = setInterval(DrawAll, 20);
        window.addEventListener('keydown', WhatKey, true);
        canvas.addEventListener('mousemove', function (evt) {
            WhereMouse(canvas, evt);
        }, false);
        canvas.addEventListener('click', function () {
            Game.pause = true;
        }, false);
    }
}


function DrawAll() {
    if (Game.pause) {
        /**********DRAW BACKGROUND***************/
        ctx.clearRect(0, 0, Game.boardX, Game.boardYwithMenu);
        ctx.fillStyle = BoardGradient;
        ctx.beginPath();
        ctx.rect(0, 0, Game.boardX, Game.boardYwithMenu);
        ctx.closePath();
        ctx.fill();
        /*********DRAW MENU**********************/
        ctx.fillStyle = MenuGradient;
        ctx.beginPath();
        ctx.rect(0, 0, Game.boardX, Game.MenuY);
        ctx.closePath();
        ctx.fill();
        DrawMenu();
        /*********DRAW BAR **********************/

        y1 = Bar.posY - (Bar.width / 2) * Math.sin(Alfa);
        x1 = Bar.posX + Bar.height / 2 - Bar.width / 2;
        y2 = Bar.posY + (Bar.width / 2) * Math.sin(Alfa);
        x2 = Bar.posX + Bar.width / 2 - Bar.height / 2;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = Bar.height;
        ctx.strokeStyle = BarGradient;
        ctx.lineCap = 'round';
        ctx.stroke();

        for (var i = 0; i < Game.NumX; i++) {
            for (let j = 0; j < Game.NumY; j++) {
                if (Area[i][j].display > 0) {
                    ctx.fillStyle = BlockGradient[Area[i][j].display];
                    ctx.beginPath();
                    ctx.rect(Area[i][j].posX + 1, Area[i][j].posY + 1, Game.BlockWidth - 2, Game.BlockHeight - 2);
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }
        /**********************/
        for (var i = Game.NumTrance - 1; i > 1; i--) {
            ctx.beginPath();
            ctx.arc(Trance[i].posX, Trance[i].posY, Trance[i].radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = Trance[i].color;
            ctx.fill();
        }

        /********DRAW BALL**********************/
        ctx.beginPath();
        ctx.arc(Ball.posX, Ball.posY, Ball.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = Ball.color;
        ctx.fill();

        /*********************/
        DrawMenu();
        MoveBar();
        MoveBall();
        UpdateTrancePoss();
        CheckStatus();
    }
}


function MakeGradient() {

    MenuGradient = ctx.createLinearGradient(0, 0, 0, Game.MenuY);
    MenuGradient.addColorStop(0, "#99BAEB");
    MenuGradient.addColorStop(0.5, "#0052CC");
    MenuGradient.addColorStop(1, "#99BAEB");

    BoardGradient = ctx.createLinearGradient(0, 0, 0, Game.boardYwithMenu);
    BoardGradient.addColorStop(0, "#AD8DEE");
    BoardGradient.addColorStop(0.4, "#68558F");
    BoardGradient.addColorStop(1, "#AD8DEE");

    BarGradient = ctx.createLinearGradient(0, Game.boardYwithMenu - 30, 0, Game.boardYwithMenu);
    BarGradient.addColorStop(0, "#FFA319");
    BarGradient.addColorStop(0.4, "#CC0000");
    BarGradient.addColorStop(1, "#FFA319");

    BlockGradient[1] = ctx.createLinearGradient(0, 0, 0, Game.BlockHeight * Game.NumY + Game.MenuY);
    BlockGradient[1].addColorStop(0, "yellow");
    BlockGradient[1].addColorStop(0.4, "orange");
    BlockGradient[1].addColorStop(1, "yellow");

    BlockGradient[2] = ctx.createLinearGradient(0, 0, 0, Game.BlockHeight * Game.NumY + Game.MenuY);
    BlockGradient[2].addColorStop(0, "red");
    BlockGradient[2].addColorStop(0.4, "brown");
    BlockGradient[2].addColorStop(1, "red");

    BlockGradient[3] = ctx.createLinearGradient(0, 0, 0, Game.BlockHeight * Game.NumY + Game.MenuY);
    BlockGradient[3].addColorStop(0, "brown");
    BlockGradient[3].addColorStop(0.4, "black");
    BlockGradient[3].addColorStop(1, "brown");
}

function DrawMenu() {

    ctx.font = Game.MenuFontSize;
    ctx.fillStyle = "white";

    ctx.fillText("Life: " + Game.Life, 10, 30);
    ctx.fillText("Level: " + Game.Level, Game.boardX / 2 - 70, 30);
    ctx.fillText("Score: " + Game.Score, Game.boardX - 140, 30);
}

function UpdateTrancePoss() {
    for (let i = Game.NumTrance - 1; i > 0; i--) {
        Trance[i].posX = Trance[i - 1].posX;
        Trance[i].posY = Trance[i - 1].posY;
    }
    Trance[0].posX = Ball.posX;
    Trance[0].posY = Ball.posY;
}

function UpdateBlock() {
    if (Game.Level < 4) {
        for (let i = 0; i < Game.NumX; i++) {
            for (let j = 0; j < Game.NumY; j++) {
                Area[i][j].display = Game.Level;
            }
        }
    }
}

function ResetGame() {
    const PlayGame = document.querySelector("#PlayGame");
    const game = document.querySelector("#game");
    if (PlayGame) {
        PlayGame.style.display = "none";
        PlayGame.style.marginTop = "140px";
        PlayGame.style.marginLeft = ((Game.boardX - (PlayGame.clientWidth)) / 2) + "px";
        PlayGame.style.marginTop = "200px";
    }
    if (game) {
        game.style.width = Game.boardYwithMenu + "px";
        game.style.width = Game.boardX + "px";
    }

    UpdateBlock();
    ResetBallPoss();
    ResetTrancePoss();
    Game.Life = 3;
    Game.Score = 0;
}

function CheckStatus() {
    let FullBlock = true;
    for (let i = 0; i < Game.NumX; i++) {
        for (let j = 0; j < Game.NumY; j++) {
            if (Area[i][j].display > 0) FullBlock = false;
        }
    }
    if (FullBlock) NextLevel();
    if (Game.Life < 1) GameEnd();
}

function NextLevel() {
    Game.Level++;
    Game.Life += 2;
    Game.Score += 10;
    UpdateBlock();
    ResetBallPoss();
    ResetTrancePoss();
    Game.pause = false;
    ctx.font = Game.titleFontSize;
    ctx.fillStyle = "white";
    ctx.fillText("Press s to continue", (Game.boardX - 240) / 2, 290);
}

function MoveBar() {
    if (Mouse.MouseX < Bar.width / 2) Bar.posX = Bar.width / 2;
    else if (Mouse.MouseX > Game.boardX - Bar.width / 2) Bar.posX = Game.boardX - Bar.width / 2;
    else Bar.posX = Mouse.MouseX;
}

function MoveBall() {
    Ball.posX += Ball.dX;
    Ball.posY += Ball.dY;
    CheckCollision();
    const a = (y1 - y2) / (x1 - x2);
    const b = y1 - a * x1;
    const k = 0.5 * (Alfa / 0.35);
    if (Ball.posY + Ball.radius >= Game.boardYwithMenu - 60) {
        if (Ball.posX >= x1 - Bar.height / 2 && Ball.posX <= x2 + Bar.height / 2) {
            if ((Ball.posX * a + b - Bar.height / 2) <= (Ball.posY + Ball.dY + Ball.radius) && Ball.dY > 0) {
                if (Alfa > 0) {  //  \.
                    if (Ball.dX > 0) {
                        Ball.dX = Ball.dX + k * Ball.dX;
                        Ball.dY = -(Ball.dY - k * Ball.dY);
                    } else {
                        Ball.dX = Ball.dX - k * Ball.dX;
                        Ball.dY = -(Ball.dY + k * Ball.dY);
                    }
                }
                if (Alfa < 0) {
                    if (Ball.dX > 0) {
                        Ball.dX = Ball.dX - k * Ball.dX;
                        Ball.dY = -(Ball.dY + k * Ball.dY);
                    } else {
                        Ball.dX = Ball.dX + k * Ball.dX;
                        Ball.dY = -(Ball.dY - k * Ball.dY);
                    }
                }
                if (Alfa === 0) Ball.dY = -Ball.dY;
            }
        }
        if (Ball.posY + Ball.dY > Game.boardYwithMenu - 2 * Ball.radius) {
            Game.Life--;
            ResetBallPoss();
            ResetTrancePoss();
            Game.pause = false;
        }
    }
    if (Ball.posX + Ball.dX > Game.boardX - Ball.radius || Ball.posX + Ball.dX < Ball.radius) Ball.dX = -Ball.dX;
    if (Ball.posY + Ball.dY > Game.boardYwithMenu - Ball.radius || Ball.posY + Ball.dY < Game.MenuY + Ball.radius) Ball.dY = -Ball.dY;
}

function ResetBallPoss() {
    Ball.dX = Math.pow(-1, (Math.ceil(Math.random() * 10)) % 10) * (Math.random() * 3 + 2);
    Ball.dY = -9;
    Ball.posX = Mouse.MouseX;
    Ball.posY = Bar.posY - 2 * Ball.radius;
}

function ResetTrancePoss() {
    for (let i = Game.NumTrance - 1; i >= 0; i--) {
        Trance[i].posX = Ball.posX;
        Trance[i].posY = Ball.posY;
    }
}

function CheckCollision() {
    for (let i = 0; i < Game.NumX; i++) {
        for (let j = 0; j < Game.NumY; j++) {
            if (Area[i][j].display > 0) {
                if (Ball.dY > 0 && Ball.dX > 0)
                    if (Area[i][j].posX <= Ball.posX + Ball.radius && Ball.posX + Ball.radius <= Area[i][j].posX + Game.BlockWidth
                        && Area[i][j].posY <= Ball.posY + Ball.radius && Ball.posY + Ball.radius <= Area[i][j].posY + Game.BlockHeight) {
                        Area[i][j].display--;
                        Game.Score++;
                        if (Area[i][j].posY <= Ball.posY && Ball.posY <= Area[i][j].posY + Game.BlockHeight) Ball.dX = -Ball.dX;
                        else Ball.dY = -Ball.dY;
                    }
                if (Ball.dY > 0 && Ball.dX < 0)
                    if (Area[i][j].posX <= Ball.posX - Ball.radius && Ball.posX - Ball.radius <= Area[i][j].posX + Game.BlockWidth
                        && Area[i][j].posY <= Ball.posY + Ball.radius && Ball.posY + Ball.radius <= Area[i][j].posY + Game.BlockHeight) {
                        Area[i][j].display--;
                        Game.Score++;
                        if (Area[i][j].posY <= Ball.posY && Ball.posY <= Area[i][j].posY + Game.BlockHeight) Ball.dX = -Ball.dX;
                        else Ball.dY = -Ball.dY;
                    }
                if (Ball.dY < 0 && Ball.dX < 0)
                    if (Area[i][j].posX <= Ball.posX - Ball.radius && Ball.posX - Ball.radius <= Area[i][j].posX + Game.BlockWidth
                        && Area[i][j].posY <= Ball.posY - Ball.radius && Ball.posY - Ball.radius <= Area[i][j].posY + Game.BlockHeight) {
                        Area[i][j].display--;
                        Game.Score++;
                        if (Area[i][j].posY <= Ball.posY && Ball.posY <= Area[i][j].posY + Game.BlockHeight) Ball.dX = -Ball.dX;
                        else Ball.dY = -Ball.dY;
                    }
                if (Ball.dY < 0 && Ball.dX > 0)
                    if (Area[i][j].posX <= Ball.posX + Ball.radius && Ball.posX + Ball.radius <= Area[i][j].posX + Game.BlockWidth
                        && Area[i][j].posY <= Ball.posY - Ball.radius && Ball.posY - Ball.radius <= Area[i][j].posY + Game.BlockHeight) {
                        Area[i][j].display--;
                        Game.Score++;
                        if (Area[i][j].posY <= Ball.posY && Ball.posY <= Area[i][j].posY + Game.BlockHeight) Ball.dX = -Ball.dX;
                        else Ball.dY = -Ball.dY;
                    }
            }
        }
    }
}

function GameEnd() {
    clearInterval(gameLoop);
    ctx.font = Game.titleFontSize;
    ctx.fillStyle = "white";
    ctx.fillText("GAME OVER", (Game.boardX - 140) / 2, 290);
    $("#PlayGame").css("display", "block");
}

function WhatKey(evt) {
    switch (evt.keyCode) {
        case 83: //s
            Game.pause = true;
            break;
    }
}

function WhereMouse(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    Mouse.PrevMouse2 = Mouse.PrevMouse;
    Mouse.PrevMouse = Mouse.MouseX;
    Mouse.MouseX = x;
    Mouse.dM = Mouse.MouseX - Mouse.PrevMouse;
    Mouse.dM2 = Mouse.PrevMouse - Mouse.PrevMouse2;
    if (Math.abs((Mouse.dM + Mouse.dM2) / 2) > 30) Mouse.dM = (Math.abs((Mouse.dM + Mouse.dM2) / 2) / ((Mouse.dM + Mouse.dM2) / 2)) * 30;
    Alfa = ((Mouse.dM + Mouse.dM2) / 2) * 3.14 / 180;
}

init();