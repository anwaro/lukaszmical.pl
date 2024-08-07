import {AnimationPoint} from '@/services/animation/point';
import {HoverElement} from '@/services/animation/type';

export class Canvas {
    ctx: CanvasRenderingContext2D;
    isHover = false;
    canRender = true;
    points: AnimationPoint[];

    constructor(public canvas: HTMLCanvasElement) {
        this.ctx = this.canvas.getContext('2d')!;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.points = new Array(200)
            .fill(0)
            .map(() => new AnimationPoint(window.innerWidth, window.innerHeight));
        this.render();
    }

    destructor() {
        this.canRender = false;
    }

    setHover = (hover: HoverElement | undefined) => {
        if (hover) {
            this.isHover = true;
            this.points.forEach((point) => point.updateHover(hover));
        } else {
            this.isHover = false;
        }
    };

    render = () => {
        if (this.canRender) {
            requestAnimationFrame(this.render);
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.points.forEach((point) => {
            point.update(this.isHover);
            const {x, y, r, color} = point.pointData();
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, 2 * Math.PI);
            this.ctx.fillStyle = color;
            this.ctx.fill();
        });
    };
}
