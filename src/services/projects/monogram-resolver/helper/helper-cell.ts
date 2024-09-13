import {Rectangle} from 'tesseract.js';

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
        ]
            .filter(Boolean)
            .join(' ')
            .trim();
    }

    static valueRectangle(bounds: Rectangle): Rectangle {
        const dX = Math.floor(bounds.width * 0.28);
        const dY = Math.floor(bounds.height * 0.1);

        return {
            left: bounds.left + dX,
            top: bounds.top + dY,
            width: bounds.width - 1.5 * dX,
            height: bounds.height - 2 * dY,
        };
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
}
