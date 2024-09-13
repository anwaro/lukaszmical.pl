import {RefObject} from 'react';

import {CellStatus} from '../model/model-cell';
import {EventModel, EventType} from '../model/model-event';
import {StoreData} from '../model/model-store';
import {GroupType} from '../model/model-group';
import {RowHelper} from '../helper/helper-row';
import {ColumnHelper} from '../helper/helper-column';

export class MonogramResolverCanvas {
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
        const DEBUG = true;
        // const DEBUG = false;
        if (DEBUG) {
            this.updateDev(store, currentEvent);
        } else {
            this.updateProd(store, currentEvent);
        }
    }

    updateProd(store: StoreData, currentEvent: EventModel) {
        switch (currentEvent.type) {
            case EventType.imageProcessed:
                return this.imageProcessedEvent(store);
            case EventType.resolverDone:
            case EventType.resolverError:
            case EventType.resolverJob:
            case EventType.resolverLoop:
                return this.printCells(store);
        }
    }

    updateDev(store: StoreData, currentEvent: EventModel) {
        switch (currentEvent.type) {
            case EventType.imageProcessedToNumberDetect:
                this.imageProcessedToNumberDetect(store);
                // this.displayImageElement(store);
                return this.detectGrid(store);
            case EventType.detectGrid:
                return this.detectGrid(store);
            case EventType.detectRowGroupsValues:
                return this.detectRowGroupsValues(store);
            case EventType.detectColumnGroupValues:
                return this.detectColumnGroupValues(store);
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

    displayImageElement(store: StoreData) {
        const id = 'processed-img';
        const img =
            (document.getElementById(id) as HTMLImageElement) ||
            (() => {
                const i = document.createElement('img');
                i.id = id;
                i.style.maxWidth = '99vw';
                document.body.appendChild(i);
                return i;
            })();
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        canvas.width = store.imageProcessed.width;
        canvas.height = store.imageProcessed.height;
        ctx.putImageData(store.imageProcessed, 0, 0);

        img.src = canvas.toDataURL();
    }

    detectGrid(store: StoreData) {
        const colors = ['red', 'green', 'blue'];
        [
            // kjk
            store.columnValuesBounds,
            store.rowValuesBounds,
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
                // ctx.fillStyle = cell.color;
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

    detectRowGroupsValues(store: StoreData) {
        const ctx = this.getCtx();
        if (!ctx) {
            return;
        }

        const rows = store.groups.filter((g) => g.type === GroupType.row);

        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            const {left, top, height, width} = RowHelper.valuesRectangle(
                index,
                store.rowValuesBounds,
                store.cellInfo,
            );

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'pink';
            ctx.rect(
                this.ctxPoint(left),
                this.ctxPoint(top),
                this.ctxPoint(width),
                this.ctxPoint(height),
            );
            ctx.stroke();
        }
    }

    detectColumnGroupValues(store: StoreData) {
        const ctx = this.getCtx();
        if (!ctx) {
            return;
        }

        const columns = store.groups.filter((g) => g.type === GroupType.column);

        for (let index = 0; index < columns.length; index++) {
            const column = columns[index];
            const {left, top, height, width} = ColumnHelper.valuesRectangle(
                index,
                store.columnValuesBounds,
                store.cellInfo,
            );

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'pink';
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
