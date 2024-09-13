import {CellId, CellModel, CellStatus} from './model-cell';

export type GroupId = `ROW-${number}` | `COL-${string}`;

export enum GroupType {
    column = 'column',
    row = 'row',
}

export class GroupModel {
    constructor(
        public readonly id: GroupId,
        public readonly type: GroupType,
        public readonly cellsId: CellId[],
        public readonly values: number[],
    ) {}

    cells(cells: CellModel[]): CellModel[] {
        return cells.filter((cell) => this.cellsId.includes(cell.id));
    }

    unknownCells(cells: CellModel[]): CellModel[] {
        return cells.filter(
            (cell) =>
                this.cellsId.includes(cell.id) && cell.status === CellStatus.unknown,
        );
    }
}
