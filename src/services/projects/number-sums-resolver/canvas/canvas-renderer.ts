import {RefObject} from 'react';

import {CellStatus} from '@/services/projects/number-sums-resolver/model/model-cell';
import {CellHelper} from '@/services/projects/number-sums-resolver/helper/helper-cell';
import {ColorGroupHelper} from '@/services/projects/number-sums-resolver/helper/helper-color-group';

import {EventModel, EventType} from '../model/model-event';
import {StoreData} from '../model/model-store';

export class NumberSumsResolverCanvas {
    private ctxBg: CanvasRenderingContext2D | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private scale = 1;
    private width = 400;

    constructor(
        private readonly canvasBg: RefObject<HTMLCanvasElement>,
        private readonly canvas: RefObject<HTMLCanvasElement>,
    ) {}

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
                this.imageProcessedToNumberDetect(store);
                return this.detectGrid(store);
            case EventType.detectGrid:
                return this.detectGrid(store);
            case EventType.detectCellsSums:
                return this.detectCells(store);
            case EventType.detectColorGroupsSums:
                return this.detectColorGroups(store);
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

    imageProcessedToNumberDetect(store: StoreData) {
        this.setupSizes(store.imageProcessed);
        this.getCtxBg()?.drawImage(
            this.renderer(store.imageProcessed),
            0,
            0,
            this.canvasBg.current.width,
            this.canvasBg.current.height,
        );
    }

    detectGrid(store: StoreData) {
        const colors = ['red', 'green', 'blue'];
        [
            // kjk
            store.columnSumsBounds,
            store.rowSumsBounds,
            store.gridBounds,
        ].forEach((rect, i) => {
            const ctx = this.getCtx();

            if (!ctx) {
                return;
            }
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = colors[i];
            ctx.rect(
                this.ctxPoint(rect.x),
                this.ctxPoint(rect.y),
                this.ctxPoint(rect.width),
                this.ctxPoint(rect.height),
            );
            ctx.stroke();
        });
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

    detectCells(store: StoreData) {
        const ctx = this.getCtx();
        if (!ctx) {
            return;
        }

        for (const cell of store.cells) {
            const {left, top, height, width} = CellHelper.valueRectangle({
                left: cell.x,
                top: cell.y,
                width: cell.width,
                height: cell.height,
            });

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'violet';
            ctx.rect(
                this.ctxPoint(left),
                this.ctxPoint(top),
                this.ctxPoint(width),
                this.ctxPoint(height),
            );
            ctx.stroke();
        }
    }

    detectColorGroups(store: StoreData) {
        const ctx = this.getCtx();
        if (!ctx) {
            return;
        }

        const colorGroups = store.groups.filter((g) => g.type === 'color');

        for (const group of colorGroups) {
            const {left, top, height, width} = ColorGroupHelper.sumRectangle(
                group.cells(store.cells),
            );

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'red';
            ctx.rect(
                this.ctxPoint(left),
                this.ctxPoint(top),
                this.ctxPoint(width),
                this.ctxPoint(height),
            );
            ctx.stroke();
        }
    }
}
