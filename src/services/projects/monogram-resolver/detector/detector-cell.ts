import {Rectangle} from 'tesseract.js';

import {ImageDataHelper} from '../helper/helper-image-data';
import {Bounds, CellsInfo} from '../model/model-store';
import {CellModel, CellStatus} from '../model/model-cell';
import {CellHelper} from '../helper/helper-cell';

export class CellDetector {
    public cells: CellModel[] = [];

    constructor(
        private readonly image: ImageData,
        private readonly grid: Bounds,
        private readonly borderWidth: number,
        private readonly cellInfo: CellsInfo,
    ) {}

    async run() {
        for (let y = 0; y < this.cellInfo.count; y++) {
            for (let x = 0; x < this.cellInfo.count; x++) {
                this.cells.push(this.createCell(x, y));
            }
        }
    }

    createCell(x: number, y: number) {
        const bounds = this.cellBounds(x, y);

        return new CellModel(
            CellHelper.id(x, y),
            bounds.left,
            bounds.top,
            bounds.width,
            bounds.height,
            x,
            y,
            this.cellStatus(bounds),
        );
    }

    cellStatus(bounds: Rectangle): CellStatus {
        if (
            !ImageDataHelper.isSimilarColorInPixel(
                this.image,
                Math.floor(bounds.left + bounds.width / 2),
                Math.floor(bounds.top + bounds.height / 2),
                [255, 255, 255, 255],
            )
        ) {
            return CellStatus.excluded;
        }
        return CellStatus.unknown;
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
