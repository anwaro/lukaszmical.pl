import {Rectangle} from 'tesseract.js';

import {GroupId} from '../model/model-group';
import {Bounds, CellsInfo} from '../model/model-store';

export class RowHelper {
    static rowName(index: number): number {
        return index + 1;
    }

    static id(index: number): GroupId {
        return `ROW-${index + 1}`;
    }

    static valuesRectangle(
        index: number,
        rowValuesBounds: Bounds,
        cellInfo: CellsInfo,
    ): Rectangle {
        const size = rowValuesBounds.height / cellInfo.count;

        const marginY = size / 6;
        const marginX = rowValuesBounds.width / 15;

        return {
            left: Math.floor(rowValuesBounds.x + marginX),
            top: Math.floor(rowValuesBounds.y + index * size + marginY),
            width: Math.floor(rowValuesBounds.width - 2 * marginX),
            height: Math.floor(size - 2 * marginY),
        };
    }
}
