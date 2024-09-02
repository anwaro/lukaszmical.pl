import {Rectangle} from 'tesseract.js';

import {
    GroupModel,
    GroupType,
} from '@/services/projects/number-sums-resolver/model/model-group';
import {ColumnHelper} from '@/services/projects/number-sums-resolver/helper/helper-column';
import {CellModel} from '@/services/projects/number-sums-resolver/model/model-cell';
import {PointModel} from '@/services/projects/number-sums-resolver/model/model-point';

import {Bounds, CellInfo} from '../model/model-store';
import {NumberDetector} from './detector-number';

export class ColumnGroupDetector extends NumberDetector {
    public columns: GroupModel[] = [];

    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly grid: Bounds,
        private readonly columnSumsBounds: Bounds,
        private readonly cells: CellModel[],
        private readonly cellInfo: CellInfo,
    ) {
        super();
    }

    async run() {
        await this.initializeDetector();
        const url = this.canvas.toDataURL();

        this.columns = await Promise.all(
            new Array(this.cellInfo.count)
                .fill(0)
                .map((sum, i) => this.createGroup(url, i)),
        );
    }

    async createGroup(url: string, index: number) {
        const sum = await this.detectNumber(url, {
            rectangle: this.sumRectangle(index),
        });

        return new GroupModel(
            ColumnHelper.id(index),
            GroupType.column,
            this.cells
                .filter((cell) => cell.columnIndex == index)
                .map((cell) => cell.id),
            this.contour(index),
            sum,
            '#ffffff',
        );
    }

    sumRectangle(index: number): Rectangle {
        const x = this.columnSumsBounds.x + index * this.cellInfo.size;

        return {
            left: x,
            top: this.columnSumsBounds.y,
            width: this.cellInfo.size,
            height: this.columnSumsBounds.height,
        };
    }

    contour(index: number): PointModel[] {
        const x = this.grid.x + index * this.cellInfo.size;
        return [
            [x, this.grid.y],
            [x + this.cellInfo.size, this.grid.y],
            [x + this.cellInfo.size, this.grid.y + this.grid.height],
            [x, this.grid.y + this.grid.height],
        ];
    }
}
