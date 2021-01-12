/*
*    Draw HTML5
*
*    Lukasz Mical
*/

/* global $$, canvas, redo, undo, ctx, currentDraw, color, type, CanvasRenderingContext2D, ctxCover */

$$Draw = new function () {

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        canvas,
        canvasCover,
        ctx,
        ctxCover,
        mouseX,
        mouseY,
        shiftDown = false,
        controlDown = false,
        canvasWidth = 800,
        canvasHeight = 400,
        drawing = [],
        memory = [],
        currentDraw,
        currentType = "line",
        backgroundColor = "black",
        isDraw = false,
        currentColor = "white",
        currentWidth = 3,
        menu,
        color,
        size,
        sizeUp,
        sizeDown,
        type,
        undo,
        redo,
        textColor = "white",
        textBold = false,
        textUnder = false,
        textItalic = false,
        textSize = 13,
        textFont = "";

    this.test = function (s) {
        return eval(s);
    };
    this.init = function () {
        setElement();
        canvasCover.width = canvas.width = canvasWidth;
        canvasCover.height = canvas.height = canvasHeight;
        if (canvas && canvas.getContext && canvasCover && canvasCover.getContext) {
            ctx = canvas.getContext("2d");
            ctxCover = canvasCover.getContext("2d");
            setEvent();

            drawBackground();
            if (isMobile) {
                setInterval(draw, 1000 / 30);
            } else {
                setInterval(draw, 1000 / 60);
            }
        }

    };

    function setElement() {
        canvas = $$("#drawCanvas");
        canvasCover = $$("#drawCanvasCover");
        menu = $$("#menu");
        color = $$("#in_color");
        size = $$("#size");
        sizeUp = $$("#sizeUp");
        sizeDown = $$("#sizeDown");
        type = $$("#type");
        undo = $$("#undo");
        redo = $$("#redo");

    }

    function setEvent() {
        canvasCover.addEventListener('mousemove', mousePossition);
        canvasCover.addEventListener('mousedown', drawStart);
        canvasCover.addEventListener('mouseup', drawEnd);
        canvasCover.addEventListener('mouseleave', drawEnd);
        canvasCover.addEventListener('mouseover', getOption);
        undo.addEventListener("click", undoF);
        redo.addEventListener("click", redoF);
        $$("#clean").addEventListener("click", clean);
        document.addEventListener("keydown", keyDown);
        document.addEventListener("keyup", keyUp);
        canvasCover.addEventListener("touchstart", touchStart, false);
        document.addEventListener("touchmove", touchMove, false);

    }


    /*
     * Funkcja czyszcząca obraz
     */
    function clean() {
        if (confirm("Czy na pewno chcesz porzucić zmiany?")) {
            memory = [];
            drawing = [];
            redo.removeClass("on");
            undo.removeClass("on");
            drawBackground();
        }
    }

    function draw() {
        ctxCover.clearRect(0, 0, canvasWidth, canvasHeight);


        if (isDraw) {
            if (currentDraw.type === "line") {
                var a = currentDraw.point;
                if (distance(a[a.length - 1], {x: mouseX, y: mouseY}) > 5) {
                    currentDraw.point.push(new Point(mouseX, mouseY));
                }
                drawElement(currentDraw, true, ctxCover);
            } else {
                drawElement(currentDraw, true, ctxCover);
            }
        }

        /*
         * Draw point {mouse possition}
         */
        if (currentType === "line") {

            ctxCover.fillStyle = currentColor;
            ctxCover.beginPath();
            ctxCover.arc(mouseX, mouseY, currentWidth / 2, 0, Math.PI * 2, true);
            ctxCover.closePath();
            ctxCover.fill();
        }
    }

    function drawBackground() {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        for (var i = 0; i < drawing.length; i++) {
            drawElement(drawing[i], false, ctx);
        }

    }

    function drawElement(elem, curr, _ctx) {
        var c = curr ? {x: mouseX, y: mouseY} : {x: elem.point[1].x, y: elem.point[1].y};

        _ctx.strokeStyle = elem.color;
        _ctx.fillStyle = elem.color;
        _ctx.lineCap = 'round';
        _ctx.beginPath();

        if (elem.type === "line" && elem.point.length > 1) {
            if (elem.point[0].x !== elem.point[1].x || elem.point[0].y !== elem.point[1].y) {
                _ctx.moveTo(elem.point[0].x, elem.point[0].y);
                _ctx.curve(arrObjToArray(elem.point), 0.4, 5, 0);
                _ctx.lineWidth = elem.width;
                _ctx.stroke();
            } else {
                _ctx.arc(elem.point[0].x, elem.point[0].y, elem.width / 2, 0, Math.PI * 2, true);
                _ctx.closePath();
                _ctx.fill();
            }

        } else if (elem.type === "straightLine") {
            _ctx.moveTo(elem.point[0].x, elem.point[0].y);
            if (shiftDown && curr) {
                if (Math.abs(elem.point[0].x - c.x) < Math.abs(elem.point[0].y - c.y)) {
                    _ctx.lineTo(elem.point[0].x, c.y);
                } else {
                    _ctx.lineTo(c.x, elem.point[0].y);
                }
            } else {
                _ctx.lineTo(c.x, c.y);
            }

            _ctx.lineWidth = elem.width;
            //_ctx.closePath();
            _ctx.stroke();
        } else if (elem.type === "arcStroke") {
            _ctx.arc(elem.point[0].x, elem.point[0].y, distance(c, elem.point[0]), 0, Math.PI * 2, true);
            _ctx.lineWidth = elem.width;
            _ctx.closePath();
            _ctx.stroke();
        } else if (elem.type === "arcFill") {
            _ctx.arc(elem.point[0].x, elem.point[0].y, distance(c, elem.point[0]), 0, Math.PI * 2, true);
            _ctx.closePath();
            _ctx.fill();
        } else if (elem.type === "rectStroke") {
            _ctx.rect(elem.point[0].x, elem.point[0].y, c.x - elem.point[0].x, c.y - elem.point[0].y);
            _ctx.lineWidth = elem.width;
            _ctx.closePath();
            _ctx.stroke();
        } else if (elem.type === "rectFill") {
            _ctx.rect(elem.point[0].x, elem.point[0].y, c.x - elem.point[0].x, c.y - elem.point[0].y);
            _ctx.closePath();
            _ctx.fill();
        }
    }

    function drawStart() {
        getOption();
        currentDraw = new Draw();
        currentDraw.type = currentType;
        currentDraw.color = currentColor;
        currentDraw.width = currentWidth;
        currentDraw.point.push(new Point(mouseX, mouseY));
        isDraw = true;
    }

    function getOption() {
        currentColor = color.value;
        if (type.dataset.type === "q1") {
            currentType = "line";
        } else if (type.dataset.type === "q2") {
            currentType = "straightLine";
        } else if (type.dataset.type === "q3") {
            currentType = "arcStroke";
        } else if (type.dataset.type === "q4") {
            currentType = "rectStroke";
        } else if (type.dataset.type === "q5") {
            currentType = "rectFill";
        } else if (type.dataset.type === "q6") {
            currentType = "arcFill";
        }
        //console.log("get options");
        textColor = $$("#fontColor").value;
        textBold = $$("#bold").hasClass("on");
        textUnder = $$("#under").hasClass("on");
        textItalic = $$("#italic").hasClass("on");
        textSize = $$("#lineS").innerHTML;
        textFont = "";
        currentWidth = $$("#lineW").innerHTML;
    }


    function drawEnd() {
        if (isDraw) {
            if (currentDraw.type === "straightLine" && shiftDown) {
                if (Math.abs(currentDraw.point[0].x - mouseX) < Math.abs(currentDraw.point[0].y - mouseY)) {
                    currentDraw.point.push(new Point(currentDraw.point[0].x, mouseY));
                } else {
                    currentDraw.point.push(new Point(mouseX, currentDraw.point[0].y));
                }
            } else {
                currentDraw.point.push(new Point(mouseX, mouseY));
            }
            drawing.push(currentDraw);
            isDraw = false;
            $$("#saveImg").href = canvas.toDataURL();
            if (drawing.length === 1) {
                undo.addClass("on");
            }
            redo.removeClass("on");
            memory = [];
            drawBackground();

        }
    }

    function undoF() {
        if (drawing.length) {
            memory.push(drawing[drawing.length - 1]);
            drawing.pop();
            if (!redo.hasClass("on")) {
                redo.addClass("on");
            }
            drawBackground();
        }
        if (!drawing.length) {
            undo.removeClass("on");
        }
    }

    function redoF() {
        if (memory.length) {
            drawing.push(memory[memory.length - 1]);
            memory.pop();
            if (!undo.hasClass("on")) {
                undo.addClass("on");
            }
            if (!memory.length) {
                redo.removeClass("on");
            }
            drawBackground();
        }
    }

    function keyDown(e) {
        switch (e.keyCode) {
            case 17:
                controlDown = true;
                e.preventDefault();
                break;
            case 16:
                shiftDown = true;
                e.preventDefault();
                break;
            case 90:
                controlDown && undoF();
                e.preventDefault();
                break;
            case 89:
                controlDown && redoF();
                e.preventDefault();
                break;
            case 83:
                controlDown && $$("#saveImg").click();
                e.preventDefault();
                break;
            case 78:
                controlDown && $$("#clean").click();
                e.preventDefault();
                break;

        }
    }

    function keyUp(e) {
        switch (e.keyCode) {
            case 17:
                controlDown = false;
                e.preventDefault();
                break;
            case 16:
                shiftDown = false;
                e.preventDefault();
                break;
        }
    }

    function mousePossition(a) {
        var rect = canvasCover.getBoundingClientRect();
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
            mouseY = a.touches[0].pageY - (window.innerHeight - canvasHeight) * 0.5 - 20;
        }
    }

    function distance(a, b) {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    }

    function arrObjToArray(a) {
        var b = [];
        for (var i = 0; i < a.length; i++) {
            b.push(a[i].x);
            b.push(a[i].y);
        }
        return b;
    }

};

function Point(x, y) {
    this.x = x;
    this.y = y;
    this.t;
}

function Draw() {
    this.type;
    this.color;
    this.width;
    this.point = [];
}

$$Draw.init();

/*
* Draw curve
*/
CanvasRenderingContext2D.prototype.curve=function(h,t,f,c){t=(typeof t==="number")?t:0.5;f=f?f:25;var j,m=(h.length-2)*f+2+(c?2*f:0),n=0,k=new Float32Array(m),e=h.length,d,a=new Float32Array((f+2)*4),b=4;j=h.slice(0);if(c){j.unshift(h[e-1]);j.unshift(h[e-2]);j.push(h[0],h[1])}else{j.unshift(h[1]);j.unshift(h[0]);j.push(h[e-2],h[e-1])}a[0]=1;for(d=1;d<f;d++){var o=d/f,p=o*o,r=p*o,q=r*2,s=p*3;a[b++]=q-s+1;a[b++]=s-q;a[b++]=r-2*p+o;a[b++]=r-p}a[++b]=1;g(j,a,e);if(c){j=[];j.push(h[e-4],h[e-3],h[e-2],h[e-1]);j.push(h[0],h[1],h[2],h[3]);g(j,a,4)}function g(G,z,B){for(var A=2;A<B;A+=2){var C=G[A],D=G[A+1],E=G[A+2],F=G[A+3],I=(E-G[A-2])*t,J=(F-G[A-1])*t,K=(G[A+4]-C)*t,L=(G[A+5]-D)*t;for(var H=0;H<f;H++){var u=H<<2,v=z[u],w=z[u+1],x=z[u+2],y=z[u+3];k[n++]=v*C+w*E+x*I+y*K;k[n++]=v*D+w*F+x*J+y*L}}}e=c?0:h.length-2;k[n++]=h[e];k[n]=h[e+1];for(d=0,e=k.length;d<e;d+=2){this.lineTo(k[d],k[d+1])}return k};

