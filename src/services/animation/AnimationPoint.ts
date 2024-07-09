import {Point, PointColor} from '@/services/animation/Point';

export class AnimationPoint {
    private color: PointColor = [160, 160, 160];
    private hoverColor: PointColor = [100, 45, 165];
    private displayColor: PointColor = [160, 160, 160];

    private readonly r: number;
    private readonly hoverR: number;
    private displayR: number;

    private position: Point;
    private hoverPosition: Point;
    private displayPosition: Point;
    private velocity: Point;

    private screen: Point;

    private factor = 0.05;

    constructor(width: number, height: number) {
        this.screen = {
            x: width,
            y: height,
        };

        const v = () => (Math.random() + 0.5) * (Math.random() < 0.5 ? 1 : -1);

        this.velocity = {x: v(), y: v()};

        this.position = {
            x: Math.random() * width,
            y: Math.random() * height,
        };

        this.displayPosition = {
            x: this.position.x,
            y: this.position.y,
        };

        const distance = Math.random() * 100;
        const angle = Math.random() * Math.PI * 2;

        this.hoverPosition = {
            x: distance * Math.sin(angle),
            y: distance * Math.cos(angle),
        };

        this.r = Math.random() * 2 + 1;
        this.hoverR = Math.random() * 10 + 5;
        this.displayR = this.r;
    }

    public update(mouseX: number, mouseY: number, hover: boolean) {
        if (hover) {
            this.displayR = this.updateValue(this.displayR, this.hoverR);
            this.updateColorValue(this.hoverColor);
            this.displayPosition.x = this.updateValue(
                this.displayPosition.x,
                mouseX + this.hoverPosition.x + Math.random() * 100 - 50,
            );
            this.displayPosition.y = this.updateValue(
                this.displayPosition.y,
                mouseY + this.hoverPosition.y + Math.random() * 100 - 50,
            );
        } else {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.displayR = this.updateValue(this.displayR, this.r);
            this.updateColorValue(this.color);
            this.displayPosition.x = this.updateValue(
                this.displayPosition.x,
                this.position.x,
            );
            this.displayPosition.y = this.updateValue(
                this.displayPosition.y,
                this.position.y,
            );

            if (this.position.x > this.screen.x || this.position.x < 0) {
                this.velocity.x *= -1;
            }

            if (this.position.y > this.screen.y || this.position.y < 0) {
                this.velocity.y *= -1;
            }
        }
    }

    public pointData() {
        return {
            x: this.displayPosition.x,
            y: this.displayPosition.y,
            r: this.displayR,
            color: this.displayColorToRgb(),
        };
    }

    private updateValue(currentValue: number, targetValue: number) {
        return currentValue + (targetValue - currentValue) * this.factor;
    }

    private updateColorValue(targetValue: PointColor) {
        this.displayColor = [
            this.updateValue(this.displayColor[0], targetValue[0]),
            this.updateValue(this.displayColor[1], targetValue[1]),
            this.updateValue(this.displayColor[2], targetValue[2]),
        ];
    }

    private displayColorToRgb() {
        return `rgb(${this.displayColor.join(', ')})`;
    }
}
