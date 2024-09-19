import {Rectangle} from 'tesseract.js';

import {GroupModel, GroupType} from '../model/model-group';
import {RowHelper} from '../helper/helper-row';
import {CellModel} from '../model/model-cell';
import {Bounds, CellsInfo, ImageFileData} from '../model/model-store';
import {NumberDetector} from './detector-number';
import {ImageDataHelper} from '../helper/helper-image-data';
import {ValidatorModel} from '../model/model-validator';

export class RowGroupDetector extends NumberDetector {
    private validator = new ValidatorModel();
    public rows: GroupModel[] = [];

    constructor(
        private readonly image: ImageFileData,
        private readonly rowSumsBounds: Bounds,
        private readonly cells: CellModel[],
        private readonly cellInfo: CellsInfo,
    ) {
        super();
    }

    async run() {
        await this.initializeDetector();

        this.rows = await Promise.all(
            new Array(this.cellInfo.count)
                .fill(0)
                .map((_, i) => this.createGroup(this.image.src, i)),
        );
    }

    async createGroup(url: string, index: number) {
        const id = RowHelper.id(index);
        const rectangle = RowHelper.valuesRectangle(
            index,
            this.rowSumsBounds,
            this.cellInfo,
        );
        const stringNumbers = await this.detectNumbers(url, rectangle, id);
        const numbers = this.fixNumbers(stringNumbers, rectangle);
        this.validator.validateGroupValues(numbers, this.cellInfo.count, id);

        return new GroupModel(
            id,
            GroupType.row,
            this.cells
                .filter((cell) => cell.rowIndex == index)
                .map((cell) => cell.id),
            numbers,
        );
    }

    fixNumbers(numbers: string[], rectengle: Rectangle) {
        const toNumbers = (nums: string[]) =>
            nums
                .join('')
                .split('')
                .map((n) => Number(n));

        if (numbers.join('').length === 1) {
            return toNumbers(numbers);
        }

        if (this.cellInfo.count < 10) {
            return toNumbers(numbers);
        }

        if (this.cellInfo.count < 20 && numbers.every((n) => !n.includes('1'))) {
            return toNumbers(numbers);
        }
        const spaces = this.spaces(rectengle);
        let n = '';
        let fixedNumbers: string[] = [];

        numbers
            .join('')
            .split('')
            .forEach((num, index) => {
                if (index + 1 >= spaces.length || spaces[index + 1]) {
                    fixedNumbers.push(`${n}${num}`);
                    n = '';
                } else {
                    n += num;
                }
            });

        return fixedNumbers.map((n) => Number(n));
    }

    spaces(rectengle: Rectangle) {
        const minSpaceRatio = 0.2;

        const isBackground = (x: number) => {
            for (let y = rectengle.top; y < rectengle.top + rectengle.height; y++) {
                if (
                    !ImageDataHelper.isSameColorInPixel(
                        this.image.data,
                        x,
                        y,
                        [255, 255, 255, 255],
                    )
                ) {
                    return false;
                }
            }
            return true;
        };

        const spaces = [];
        let isSpace = true;
        let width = 0;

        for (let x = rectengle.left; x < rectengle.left + rectengle.width; x++) {
            const isBg = isBackground(x);

            if (isBg) {
                width++;
            }

            if (!isBg && isSpace) {
                spaces.push(width);
                width = 0;
            }

            isSpace = isBg;
        }
        spaces.push(1000);
        return spaces
            .map((sp) => sp / rectengle.height)
            .map((w) => w > minSpaceRatio);
    }
}
