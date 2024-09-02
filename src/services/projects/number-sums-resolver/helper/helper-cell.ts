import {Rectangle} from 'tesseract.js';

import {
    CellId,
    CellModel,
} from '@/services/projects/number-sums-resolver/model/model-cell';
import {ColumnHelper} from '@/services/projects/number-sums-resolver/helper/helper-column';
import {RowHelper} from '@/services/projects/number-sums-resolver/helper/helper-row';

export class CellHelper {
    static id(column: number, row: number): CellId {
        return `${ColumnHelper.columnName(column)}${RowHelper.rowName(row)}`;
    }

    static sum(cells: CellModel[]): number {
        return cells.reduce((sum, cell) => sum + cell.value, 0);
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
}
