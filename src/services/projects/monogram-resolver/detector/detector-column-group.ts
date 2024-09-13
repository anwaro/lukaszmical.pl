import {GroupModel, GroupType} from '../model/model-group';
import {ColumnHelper} from '../helper/helper-column';
import {CellModel} from '../model/model-cell';
import {Bounds, CellsInfo} from '../model/model-store';
import {NumberDetector} from './detector-number';

export class ColumnGroupDetector extends NumberDetector {
    public columns: GroupModel[] = [];

    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly grid: Bounds,
        private readonly columnValuesBounds: Bounds,
        private readonly cells: CellModel[],
        private readonly cellInfo: CellsInfo,
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
        const numbers = await this.detectNumbers(
            url,
            ColumnHelper.valuesRectangle(
                index,
                this.columnValuesBounds,
                this.cellInfo,
            ),
        );

        return new GroupModel(
            ColumnHelper.id(index),
            GroupType.column,
            this.cells
                .filter((cell) => cell.columnIndex == index)
                .map((cell) => cell.id),
            numbers.map((n) => Number(n)),
        );
    }
}
