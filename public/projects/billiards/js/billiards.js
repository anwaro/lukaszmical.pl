billiards = new (function () {
    var canvas,
        ctx,
        width = 800,
        height = 400,
        marginX,
        marginY = 200,
        mouseX,
        mouseY,
        user,
        force = 10,
        hitForce,
        hitSpeed,
        dF = 2,
        isMove = false,
        mouseDown = false,
        bills = [],
        billsInHole = [],
        x = 500,
        y = 200,
        stick = {
            img: new Image(),
            src: '/projects/billiards/image/stick.png',
            load: function () {
                this.img.src = this.src;
            },
        },
        table = {
            img: new Image(),
            src: '/projects/billiards/image/table-tmp.png',
            load: function () {
                this.img.src = this.src;
            },
        },
        colors = [
            '#DBDE0A',
            '#522906',
            '#D69012',
            '#A4A707',
            '#1B1918',
            '#CE0C0C',
            '#DE3B3B',
            '#82420C',
            '#0F8FCC',
            '#0C8204',
            '#7E0CE6',
            '#44077B',
            '#44077B',
            '#001FFF',
            '#0A5005',
        ];
    this.init = function () {
        canvas = document.querySelector('#billCanvas');

        setCanvas();
        user = new UserBill(new Bill(30 + marginX, 200 + marginY, 10, 'white'));

        setBills();
        stick.load();
        table.load();

        canvas.addEventListener('mousemove', mousePoss);
        canvas.addEventListener('mousedown', setForce);
        document.querySelector('html').addEventListener('mouseup', initShoot);
        if (canvas.getContext) {
            ctx = canvas.getContext('2d');
            setInterval(draw, 1000 / 60);
        }
    };

    function setCanvas() {
        canvas.height = height + 2 * marginY;
        const widthBody = document.querySelector('body').offsetWidth;
        marginX = (widthBody - width) / 2;
        canvas.width = widthBody;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(table.img, marginX - 50, marginY - 50, 900, 500);
        ctx.fillStyle = user.bill.color;
        ctx.beginPath();
        ctx.arc(user.bill.x, user.bill.y, user.bill.r, 0, Math.PI * 2, true);
        ctx.fill();

        for (var i = 0; i < billsInHole.length; i++) {
            ctx.beginPath();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.arc(
                marginX + 175 + i * 30,
                150,
                billsInHole[i].r + 2,
                0,
                Math.PI * 2,
                true,
            );
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = billsInHole[i].color;
            ctx.arc(
                marginX + 175 + i * 30,
                150,
                billsInHole[i].r,
                0,
                Math.PI * 2,
                true,
            );
            ctx.fill();
        }

        isMove = false;
        //check collision and move all bill
        for (var i = 0; i < bills.length; i++) {
            if (distance(user.bill, bills[i]) <= user.bill.r + bills[i].r + 0.5) {
                if (distance(user.bill, bills[i]) < user.bill.r + bills[i].r)
                    fixPositon(user.bill, bills[i]);
                checkCollision(user.bill, bills[i]);
            }
            for (var j = i + 1; j < bills.length; j++) {
                if (distance(bills[j], bills[i]) <= bills[j].r + bills[i].r + 0.5) {
                    if (distance(bills[j], bills[i]) < bills[j].r + bills[i].r)
                        fixPositon(bills[j], bills[i]);
                    checkCollision(bills[j], bills[i]);
                }
            }
            if (bills[i].vx || bills[i].vy) isMove = true;

            if (bilIsInHolle(bills[i], i)) {
                if (
                    bills[i].x + bills[i].vx + bills[i].r > width + marginX ||
                    bills[i].x + bills[i].vx - bills[i].r < marginX
                )
                    bills[i].vx *= -0.9;
                if (
                    bills[i].y + bills[i].vy + bills[i].r > height + marginY ||
                    bills[i].y + bills[i].vy - bills[i].r < marginY
                )
                    bills[i].vy *= -0.9;

                bills[i].updatePoss();
                bills[i].updateV();
            }
        }

        //move user bill
        if (user.bill.vx || user.bill.vy) isMove = true;
        if (
            user.bill.x + user.bill.vx + user.bill.r > width + marginX ||
            user.bill.x + user.bill.vx - user.bill.r < marginX
        )
            user.bill.vx *= -0.9;
        if (
            user.bill.y + user.bill.vy + user.bill.r > height + marginY ||
            user.bill.y + user.bill.vy - user.bill.r < marginY
        )
            user.bill.vy *= -0.9;

        user.bill.updatePoss();
        user.bill.updateV();

        for (var i = 0; i < bills.length; i++) {
            /*ctx.beginPath();
             ctx.fillStyle =  "rgba(255, 255, 255, 0.4)";
             ctx.arc(bills[i].x, bills[i].y, bills[i].r+1, 0, Math.PI * 2, true);
             ctx.fill();*/
            ctx.beginPath();
            ctx.fillStyle = bills[i].color;
            ctx.beginPath();
            ctx.arc(bills[i].x, bills[i].y, bills[i].r, 0, Math.PI * 2, true);
            ctx.fill();
        }

        if (!isMove) {
            ctx.save();
            ctx.translate(user.bill.x, user.bill.y);
            ctx.rotate(
                Math.atan2(mouseX - user.bill.x, user.bill.y - mouseY) + Math.PI / 2,
            );
            ctx.drawImage(stick.img, force, -5, 250, 10);
            ctx.restore();
        }
    }

    //this function fix bill's positions before collision
    function fixPositon(bill1, bill2) {
        var diss = bill1.r + bill2.r - distance(bill1, bill2),
            v1 = Math.sqrt(bill1.vx * bill1.vx + bill1.vy * bill1.vy),
            v2 = Math.sqrt(bill2.vx * bill2.vx + bill2.vy * bill2.vy),
            sumV = v1 + v2,
            diss1 = sumV ? (v1 / sumV) * diss + 0.01 : 0,
            diss2 = sumV ? (v2 / sumV) * diss + 0.01 : 0;

        if (v1) bill1.x -= (bill1.vx * diss1) / v1;
        if (v2) bill2.x -= (bill2.vx * diss2) / v2;
        if (v1) bill1.y -= (bill1.vy * diss1) / v1;
        if (v2) bill2.y -= (bill2.vy * diss2) / v2;
    }

    function bilIsInHolle(bill, i) {
        var h = 19;
        var x = bill.x + bill.vx - marginX,
            y = bill.y + bill.vy - marginY;
        if (
            distance({x: x, y: y}, {x: 0, y: 0}) < h ||
            distance({x: x, y: y}, {x: 0, y: height}) < h ||
            distance({x: x, y: y}, {x: width, y: 0}) < h ||
            distance({x: x, y: y}, {x: width, y: height}) < h
        ) {
            billsInHole.push(bills.splice(i, 1)[0]);
            return false;
        }
        return true;
    }

    function setBills() {
        var r = 10,
            dX = Math.sqrt(r * r * 4 - r * r) + 1;

        for (var i = 0, c = 0; i < 5; i++) {
            for (var j = 0; j <= i; j++) {
                bills.push(
                    new Bill(
                        x + dX * i + marginX,
                        y - (r + 0.5) * i + 2 * (r + 0.5) * j + marginY,
                        r,
                        colors[c],
                    ),
                );
                c++;
            }
        }
    }

    function setForce() {
        mouseDown = true;
        force = 10;
        changeForce();
    }

    function changeForce() {
        if (force > 120 || force < 5) dF *= -1;
        force += dF;
        mouseDown && setTimeout(changeForce, 1000 / 60);
    }

    function hitBill() {
        if (force > 5) {
            force -= hitSpeed;
            setTimeout(hitBill, 1000 / 60);
        } else {
            force = 10;
            isMove = true;
            var max = Math.max(
                Math.abs(mouseX - user.bill.x),
                Math.abs(mouseY - user.bill.y),
            );
            user.bill.setV(
                (hitForce * (mouseX - user.bill.x)) / max,
                (hitForce * (mouseY - user.bill.y)) / max,
            );
        }
    }

    function distance(a, b) {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    }

    function distanceNextStep(a, b) {
        return Math.sqrt(
            (a.x + a.vx - b.x + b.vx) * (a.x + a.vx - b.x + b.vx) +
                (a.y + a.vy - b.y + a.vy) * (a.y + a.vy - b.y + b.vy),
        );
    }

    function initShoot() {
        if (!isMove && mouseDown) {
            mouseDown = false;
            hitForce = force / 5;
            hitSpeed = 0.0696 * hitForce + 3;
            dF = Math.abs(dF);
            hitBill();
        } else {
            mouseDown = false;
        }
    }

    function mousePoss(e) {
        var rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    }

    function checkCollision(ball, ball2) {
        dx = ball.x - ball2.x;
        dy = ball.y - ball2.y;
        collisionision_angle = Math.atan2(dy, dx);
        magnitude_1 = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        magnitude_2 = Math.sqrt(ball2.vx * ball2.vx + ball2.vy * ball2.vy);
        direction_1 = Math.atan2(ball.vy, ball.vx);
        direction_2 = Math.atan2(ball2.vy, ball2.vx);
        new_xspeed_1 = magnitude_1 * Math.cos(direction_1 - collisionision_angle);
        new_yspeed_1 = magnitude_1 * Math.sin(direction_1 - collisionision_angle);
        new_xspeed_2 = magnitude_2 * Math.cos(direction_2 - collisionision_angle);
        new_yspeed_2 = magnitude_2 * Math.sin(direction_2 - collisionision_angle);
        final_xspeed_1 = new_xspeed_2;
        final_xspeed_2 = new_xspeed_1;
        final_yspeed_1 = new_yspeed_1;
        final_yspeed_2 = new_yspeed_2;
        ball.vx =
            Math.cos(collisionision_angle) * final_xspeed_1 +
            Math.cos(collisionision_angle + Math.PI / 2) * final_yspeed_1;
        ball.vy =
            Math.sin(collisionision_angle) * final_xspeed_1 +
            Math.sin(collisionision_angle + Math.PI / 2) * final_yspeed_1;
        ball2.vx =
            Math.cos(collisionision_angle) * final_xspeed_2 +
            Math.cos(collisionision_angle + Math.PI / 2) * final_yspeed_2;
        ball2.vy =
            Math.sin(collisionision_angle) * final_xspeed_2 +
            Math.sin(collisionision_angle + Math.PI / 2) * final_yspeed_2;
    }
})();

function Bill(x, y, r, color) {
    this.x = x || 0;
    this.y = y || 0;
    this.vx = 0;
    this.vy = 0;
    this.color = color;
    this.r = r;
    this.setV = function (vx, vy) {
        this.vx = vx;
        this.vy = vy;
    };
    this.updatePoss = function () {
        this.x += this.vx;
        this.y += this.vy;
    };
    this.updateV = function () {
        if (Math.abs(this.vx * this.vx + this.vy * this.vy) > 0.1) {
            this.vx *= 0.99;
            this.vy *= 0.99;
        } else {
            this.vx = 0;
            this.vy = 0;
        }
    };
}

function UserBill(bill, s) {
    this.bill = bill;
}

billiards.init();
