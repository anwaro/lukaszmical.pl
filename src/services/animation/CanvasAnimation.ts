import {AnimationPoint} from '@/services/animation/AnimationPoint';

export class CanvasAnimation {
    ctx: CanvasRenderingContext2D;
    mouseX = 0;
    mouseY = 0;
    isHover = false;
    canRender = true;
    points: AnimationPoint[];

    constructor(public canvas: HTMLCanvasElement) {
        this.ctx = this.canvas.getContext('2d')!;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.points = new Array(100)
            .fill(0)
            .map(() => new AnimationPoint(window.innerWidth, window.innerHeight));
        this.render();
    }

    destructor() {
        this.canRender = false;
    }

    render = () => {
        if (this.canRender) {
            requestAnimationFrame(this.render);
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.ctx.filter = this.isHover ? 'blur(5px)' : 'blur(2px)';
        this.points.forEach((point) => {
            point.update(this.mouseX, this.mouseY, this.isHover);
            const {x, y, r, color} = point.pointData();
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, 2 * Math.PI);
            this.ctx.fillStyle = color;
            this.ctx.fill();
        });
    };
}
