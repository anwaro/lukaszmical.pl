import {Rectangle} from 'tesseract.js';

import {GroupId} from '../model/model-group';
import {Bounds, CellsInfo} from '../model/model-store';

export class ColumnHelper {
    static columnName(index: number): string {
        return String.fromCharCode(65 + index);
    }

    static id(index: number): GroupId {
        return `COL-${String.fromCharCode(65 + index)}`;
    }

    static valuesRectangle(
        index: number,
        columnValuesBounds: Bounds,
        cellInfo: CellsInfo,
    ): Rectangle {
        const size = columnValuesBounds.width / cellInfo.count;

        const marginX = size / 20;
        const marginY = columnValuesBounds.height / 50;
        return {
            left: Math.floor(columnValuesBounds.x + index * size + marginX),
            top: Math.floor(columnValuesBounds.y + marginY),
            width: Math.floor(size - 2 * marginX),
            height: Math.floor(columnValuesBounds.height - 2 * marginY),
        };
    }
}
