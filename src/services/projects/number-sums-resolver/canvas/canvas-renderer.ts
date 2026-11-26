import {RefObject} from 'react';

import {CellStatus} from '@/services/projects/number-sums-resolver/model/model-cell';

import {EventModel, EventType} from '../model/model-event';
import {StoreData} from '../model/model-store';
import {NumberSumsResolverDebugCanvas} from './canvas-debug-renderer';

export class NumberSumsResolverCanvas {
    private ctxBg: CanvasRenderingContext2D | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private scale = 1;
    private width = 400;
    private readonly debug = new NumberSumsResolverDebugCanvas(this);

    constructor(
        private readonly canvasBg: RefObject<HTMLCanvasElement>,
        private readonly canvas: RefObject<HTMLCanvasElement>,
    ) {}

    get canvasBgElement(): HTMLCanvasElement {
        return this.canvasBg.current;
    }

    getCtx(): CanvasRenderingContext2D | null {
        if (!this.ctx) {
            this.ctx = this.canvas.current.getContext('2d');
        }
        return this.ctx;
    }

    getCtxBg(): CanvasRenderingContext2D | null {
        if (!this.ctxBg) {
            this.ctxBg = this.canvasBg.current.getContext('2d');
        }
        return this.ctxBg;
    }

    update(store: StoreData, currentEvent: EventModel) {
        // const DEBUG = true;
        const DEBUG = false;
        if (DEBUG) {
            this.updateProd(store, currentEvent);
        } else {
            this.updateDev(store, currentEvent);
        }
    }

    updateProd(store: StoreData, currentEvent: EventModel) {
        switch (currentEvent.type) {
            case EventType.imageProcessed:
                return this.imageProcessedEvent(store);
            case EventType.solvedCells:
            case EventType.solveDone:
            case EventType.solveError:
                return this.printCells(store);
        }
    }

    updateDev(store: StoreData, currentEvent: EventModel) {
        switch (currentEvent.type) {
            case EventType.imageProcessedToNumberDetect:
                this.debug.imageProcessedToNumberDetect(store);
                return this.debug.detectGrid(store);
            case EventType.detectGrid:
                return this.debug.detectGrid(store);
            case EventType.detectCellsSums:
                return this.debug.detectCells(store);
            case EventType.detectColorGroupsSums:
                return this.debug.detectColorGroups(store);
        }
    }

    ctxPoint(value: number) {
        return value * this.scale;
    }

    renderer(image: ImageData) {
        const renderer = document.createElement('canvas');
        renderer.width = image.width;
        renderer.height = image.height;
        renderer.getContext('2d')?.putImageData(image, 0, 0);
        return renderer;
    }

    setupSizes(image: ImageData) {
        this.scale = this.width / image.width;
        const width = image.width * this.scale;
        const height = image.height * this.scale;

        this.canvasBg.current.width = width;
        this.canvas.current.width = width;
        this.canvasBg.current.height = height;
        this.canvas.current.height = height;
    }

    imageProcessedEvent(store: StoreData) {
        this.setupSizes(store.image);
        this.getCtxBg()?.drawImage(
            this.renderer(store.image),
            0,
            0,
            this.canvas.current.width,
            this.canvas.current.height,
        );
    }

    printCells(store: StoreData) {
        const ctx = this.getCtx();

        if (!ctx) {
            return;
        }
        ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);

        for (const cell of store.cells) {
            if (cell.status === CellStatus.unknown) {
                continue;
            }
            ctx.beginPath();

            if (cell.status === CellStatus.excluded) {
                ctx.fillStyle = cell.color;
                ctx.arc(
                    this.ctxPoint(cell.x + cell.width / 2),
                    this.ctxPoint(cell.y + cell.height / 2),
                    this.ctxPoint(cell.width / 4),
                    0,
                    2 * Math.PI,
                );
                ctx.fill();
            } else {
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'black';
                ctx.arc(
                    this.ctxPoint(cell.x + cell.width / 2),
                    this.ctxPoint(cell.y + cell.height / 2),
                    this.ctxPoint(cell.width / 2.5),
                    0,
                    2 * Math.PI,
                );
                ctx.stroke();
            }
        }
    }
}
