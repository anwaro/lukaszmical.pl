import {Rectangle} from 'tesseract.js';

import {CellHelper} from '@/services/projects/number-sums-resolver/helper/helper-cell';
import {ColorGroupHelper} from '@/services/projects/number-sums-resolver/helper/helper-color-group';

import {Bounds, StoreData} from '../model/model-store';
import {NumberSumsResolverCanvas} from './canvas-renderer';

// The dev-only debug overlay (grid/cell/color-group detection boxes), kept
// apart from the production drawing in `NumberSumsResolverCanvas`.
export class NumberSumsResolverDebugCanvas {
    constructor(private readonly canvas: NumberSumsResolverCanvas) {}

    imageProcessedToNumberDetect(store: StoreData) {
        this.canvas.setupSizes(store.imageProcessed);
        const bg = this.canvas.canvasBgElement;
        this.canvas
            .getCtxBg()
            ?.drawImage(this.canvas.renderer(store.imageProcessed), 0, 0, bg.width, bg.height);
    }

    detectGrid(store: StoreData) {
        const colors = ['red', 'green', 'blue'];
        [store.columnSumsBounds, store.rowSumsBounds, store.gridBounds].forEach(
            (bounds, i) => this.strokeBounds(bounds, colors[i]),
        );
    }

    detectCells(store: StoreData) {
        for (const cell of store.cells) {
            const rect = CellHelper.valueRectangle({
                left: cell.x,
                top: cell.y,
                width: cell.width,
                height: cell.height,
            });
            this.strokeRectangle(rect, 'violet');
        }
    }

    detectColorGroups(store: StoreData) {
        const colorGroups = store.groups.filter((g) => g.type === 'color');

        for (const group of colorGroups) {
            const rect = ColorGroupHelper.sumRectangle(group.cells(store.cells));
            this.strokeRectangle(rect, 'red');
        }
    }

    private strokeBounds(bounds: Bounds, strokeStyle: string) {
        this.strokeAt(bounds.x, bounds.y, bounds.width, bounds.height, strokeStyle);
    }

    private strokeRectangle(rect: Rectangle, strokeStyle: string) {
        this.strokeAt(rect.left, rect.top, rect.width, rect.height, strokeStyle);
    }

    private strokeAt(
        x: number,
        y: number,
        width: number,
        height: number,
        strokeStyle: string,
    ) {
        const ctx = this.canvas.getCtx();
        if (!ctx) {
            return;
        }

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = strokeStyle;
        ctx.rect(
            this.canvas.ctxPoint(x),
            this.canvas.ctxPoint(y),
            this.canvas.ctxPoint(width),
            this.canvas.ctxPoint(height),
        );
        ctx.stroke();
    }
}
