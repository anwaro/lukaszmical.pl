import {Rectangle} from 'tesseract.js';

import {ColorHelper} from '@/services/projects/number-sums-resolver/helper/helper-color';

import {Bounds, CellInfo} from '../model/model-store';
import {CellModel} from '../model/model-cell';
import {CellHelper} from '../helper/helper-cell';
import {NumberDetector} from '../detector/detector-number';
import {ImageDataHelper} from '../helper/helper-image-data';

export class CellDetector extends NumberDetector {
    public cells: CellModel[] = [];

    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly image: ImageData,
        private readonly grid: Bounds,
        private readonly borderWidth: number,
        private readonly cellInfo: CellInfo,
    ) {
        super();
    }

    async run() {
        await this.initializeDetector();
        const promises: Promise<CellModel>[] = [];
        const url = this.canvas.toDataURL();

        for (let y = 0; y < this.cellInfo.count; y++) {
            for (let x = 0; x < this.cellInfo.count; x++) {
                promises.push(this.createCell(url, x, y));
            }
        }

        this.cells = await Promise.all(promises);
    }

    async createCell(url: string, x: number, y: number) {
        const bounds = this.cellBounds(x, y);
        const value = await this.detectNumber(url, {
            rectangle: CellHelper.valueRectangle(bounds),
        });

        const color = ImageDataHelper.getPixelColor(
            this.image,
            Math.floor(bounds.left + (bounds.width * 4) / 5),
            Math.floor(bounds.top + bounds.height / 4),
        );

        return new CellModel(
            CellHelper.id(x, y),
            bounds.left,
            bounds.top,
            bounds.width,
            bounds.height,
            x,
            y,
            ColorHelper.toHex(color),
            value,
        );
    }

    cellBounds(x: number, y: number): Rectangle {
        return {
            left: this.grid.x + this.borderWidth + x * this.cellInfo.size,
            top: this.grid.y + this.borderWidth + y * this.cellInfo.size,
            width: this.cellInfo.size,
            height: this.cellInfo.size,
        };
    }
}
