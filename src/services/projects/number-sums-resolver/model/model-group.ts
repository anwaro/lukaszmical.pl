import {CellId, CellModel, CellStatus} from './model-cell';
import {PointModel} from './model-point';
import {HexColor} from '../helper/helper-image-data';

export type GroupId = `ROW-${number}` | `COL-${string}` | `COLOR-${string}`;

export enum GroupType {
    column = 'column',
    row = 'row',
    color = 'color',
}

export class GroupModel {
    constructor(
        public readonly id: GroupId,
        public readonly type: GroupType,
        public readonly cellsId: CellId[],
        public readonly contour: PointModel[],
        public readonly sum: number,
        public readonly color: HexColor,
    ) {}

    cells(cells: CellModel[]): CellModel[] {
        return cells.filter((cell) => this.cellsId.includes(cell.id));
    }

    includedCells(cells: CellModel[]): CellModel[] {
        return cells.filter(
            (cell) =>
                this.cellsId.includes(cell.id) &&
                cell.status === CellStatus.included,
        );
    }

    unknownCells(cells: CellModel[]): CellModel[] {
        return cells.filter(
            (cell) =>
                this.cellsId.includes(cell.id) && cell.status === CellStatus.unknown,
        );
    }
}
