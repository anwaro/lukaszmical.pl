import {Rectangle} from 'tesseract.js';

import {
    GroupModel,
    GroupType,
} from '@/services/projects/number-sums-resolver/model/model-group';
import {RowHelper} from '@/services/projects/number-sums-resolver/helper/helper-row';
import {CellModel} from '@/services/projects/number-sums-resolver/model/model-cell';
import {PointModel} from '@/services/projects/number-sums-resolver/model/model-point';

import {Bounds, CellInfo} from '../model/model-store';
import {NumberDetector} from './detector-number';

export class RowGroupDetector extends NumberDetector {
    public rows: GroupModel[] = [];

    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly grid: Bounds,
        private readonly rowSumsBounds: Bounds,
        private readonly cells: CellModel[],
        private readonly cellInfo: CellInfo,
    ) {
        super();
    }

    async run() {
        await this.initializeDetector();
        const url = this.canvas.toDataURL();

        this.rows = await Promise.all(
            new Array(this.cellInfo.count)
                .fill(0)
                .map((_, i) => this.createGroup(url, i)),
        );
    }

    async createGroup(url: string, index: number) {
        const sum = await this.detectNumber(url, {
            rectangle: this.sumRectangle(index),
        });

        return new GroupModel(
            RowHelper.id(index),
            GroupType.row,
            this.cells
                .filter((cell) => cell.rowIndex == index)
                .map((cell) => cell.id),
            this.contour(index),
            sum,
            '#ffffff',
        );
    }

    sumRectangle(index: number): Rectangle {
        const y = this.rowSumsBounds.y + index * this.cellInfo.size;

        return {
            left: this.rowSumsBounds.x,
            top: y,
            width: this.rowSumsBounds.width,
            height: this.cellInfo.size,
        };
    }

    contour(index: number): PointModel[] {
        const y = this.grid.y + index * this.cellInfo.size;

        return [
            [this.grid.x, y],
            [this.grid.x, y + this.cellInfo.size],
            [this.grid.x + this.grid.width, y + this.cellInfo.size],
            [this.grid.x + this.grid.width, y],
        ];
    }
}
