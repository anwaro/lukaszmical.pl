import {Rectangle} from 'tesseract.js';

import {CellModel} from '../model/model-cell';
import {GroupId} from '../model/model-group';
import {HexColor} from './helper-image-data';

export class ColorGroupHelper {
    static id(color: HexColor): GroupId {
        return `COLOR-${color}`;
    }

    static sumRectangle(cells: CellModel[]): Rectangle {
        return {
            left: cells[0].x,
            top: cells[0].y,
            width: Math.floor(cells[0].width / 2.5),
            height: Math.floor(cells[0].height / 2.5),
        };
    }
}
