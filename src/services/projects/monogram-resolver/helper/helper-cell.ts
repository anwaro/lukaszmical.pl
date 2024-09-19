import {CellId, CellModel, CellStatus} from '../model/model-cell';
import {ColumnHelper} from '../helper/helper-column';
import {RowHelper} from '../helper/helper-row';

export class CellHelper {
    static id(column: number, row: number): CellId {
        return `${ColumnHelper.columnName(column)}${RowHelper.rowName(row)}`;
    }

    static title(cell: CellModel): string {
        return [
            `Cell ${cell.id}\n`,
            `Status: ${cell.status}\n`,
            cell.resolver ? `Resolver: ${cell.resolver}\n` : '',
            cell.resolveInGroup ? `Resolve in group: ${cell.resolveInGroup}` : '',
            cell.loop ? `Loop: ${cell.loop}` : '',
        ]
            .filter(Boolean)
            .join(' ')
            .trim();
    }

    static filterCells(cells: CellModel[], status: CellStatus): CellModel[] {
        return cells.filter((cell) => cell.status === status);
    }

    static includedCells(cells: CellModel[]): CellModel[] {
        return CellHelper.filterCells(cells, CellStatus.included);
    }

    static unknownCells(cells: CellModel[]): CellModel[] {
        return CellHelper.filterCells(cells, CellStatus.unknown);
    }

    static excludedCells(cells: CellModel[]): CellModel[] {
        return CellHelper.filterCells(cells, CellStatus.excluded);
    }

    static toPattern(cells: CellModel[]) {
        return cells
            .map((c) => {
                switch (c.status) {
                    case CellStatus.excluded:
                        return '❌';
                    case CellStatus.included:
                        return '🟦';
                    case CellStatus.unknown:
                    default:
                        return '❔';
                }
            })
            .join('');
    }
}
