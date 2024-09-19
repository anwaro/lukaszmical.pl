import {RefObject} from 'react';

import {EventModel, EventType} from '../model/model-event';
import {StoreData} from '../model/model-store';
import {GroupType} from '../model/model-group';
import {RowHelper} from '../helper/helper-row';
import {ColumnHelper} from '../helper/helper-column';

export class MonogramResolverCanvas {
    private ctxBg: CanvasRenderingContext2D | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private scale = 1;
    private width = 1000;

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
        switch (currentEvent.type) {
            case EventType.rerender:
                this.imageProcessedToNumberDetect(store);
                this.displayImageElement(store);
                this.detectGrid(store);
                this.detectRowGroupsValues(store);
                return this.detectColumnGroupValues(store);
            case EventType.imageProcessedToNumberDetect:
                this.imageProcessedToNumberDetect(store);
                this.displayImageElement(store);
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

    imageProcessedToNumberDetect(store: StoreData) {
        this.setupSizes(store.processedImage.data);
        this.getCtxBg()?.drawImage(
            this.renderer(store.processedImage.data),
            0,
            0,
            this.canvasBg.current.width,
            this.canvasBg.current.height,
        );
    }

    displayImageElement(store: StoreData) {
        // const img = document.getElementById('image-preview') as HTMLImageElement;
        // const canvas = document.createElement('canvas');
        // const ctx = canvas.getContext('2d');
        // if (!ctx) {
        //     return;
        // }
        //
        // canvas.width = store.imageProcessed.width;
        // canvas.height = store.imageProcessed.height;
        // ctx.putImageData(store.imageProcessed, 0, 0);
        //
        // img.src = canvas.toDataURL();
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
