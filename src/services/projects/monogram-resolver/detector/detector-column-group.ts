import {ValidatorModel} from '@/services/projects/monogram-resolver/model/model-validator';

import {GroupModel, GroupType} from '../model/model-group';
import {ColumnHelper} from '../helper/helper-column';
import {CellModel} from '../model/model-cell';
import {Bounds, CellsInfo, ImageFileData} from '../model/model-store';
import {NumberDetector} from './detector-number';

export class ColumnGroupDetector extends NumberDetector {
    private validator = new ValidatorModel();
    public columns: GroupModel[] = [];

    constructor(
        private readonly image: ImageFileData,
        private readonly columnValuesBounds: Bounds,
        private readonly cells: CellModel[],
        private readonly cellInfo: CellsInfo,
    ) {
        super();
    }

    async run() {
        await this.initializeDetector();

        this.columns = await Promise.all(
            new Array(this.cellInfo.count)
                .fill(0)
                .map((sum, i) => this.createGroup(this.image.src, i)),
        );
    }

    async createGroup(url: string, index: number) {
        const id = ColumnHelper.id(index);
        const stringNumbers = await this.detectNumbers(
            url,
            ColumnHelper.valuesRectangle(
                index,
                this.columnValuesBounds,
                this.cellInfo,
            ),
            id,
        );

        const numbers = stringNumbers.map((n) => Number(n));

        this.validator.validateGroupValues(numbers, this.cellInfo.count, id);

        return new GroupModel(
            id,
            GroupType.column,
            this.cells
                .filter((cell) => cell.columnIndex == index)
                .map((cell) => cell.id),
            numbers,
        );
    }
}
