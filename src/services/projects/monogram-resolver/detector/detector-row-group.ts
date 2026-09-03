import {Rectangle, Symbol} from 'tesseract.js';

import {ArrayHelper} from '../helper/helper-array';
import {GroupModel, GroupType} from '../model/model-group';
import {RowHelper} from '../helper/helper-row';
import {CellModel} from '../model/model-cell';
import {Bounds, CellsInfo, ImageFileData} from '../model/model-store';
import {NumberDetector} from './detector-number';
import {SymbolHelper} from '../helper/helper-symbol';
import {ImageDataHelper} from '../helper/helper-image-data';
import {ValidatorModel} from '../model/model-validator';

export class RowGroupDetector extends NumberDetector {
    public rows: GroupModel[] = [];
    private validator = new ValidatorModel();

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
            ArrayHelper.create(this.cellInfo.count).map((i) =>
                this.createGroup(this.image.src, i),
            ),
        );
    }

    async createGroup(url: string, index: number) {
        const id = RowHelper.id(index);
        const rectangle = RowHelper.valuesRectangle(
            index,
            this.rowSumsBounds,
            this.cellInfo,
        );
        const page = await this.detectNumbers(url, rectangle);
        const {symbols, numbers: stringNumbers} = await this.fixSymbols(
            SymbolHelper.fromPage(page),
        );
        const numbers = this.fixNumbers(stringNumbers, rectangle);
        this.validator.validateGroupValues(numbers, this.cellInfo.count, id);

        return new GroupModel(
            id,
            GroupType.row,
            this.cells
                .filter((cell) => cell.rowIndex == index)
                .map((cell) => cell.id),
            numbers,
            symbols,
        );
    }

    async fixSymbols(symbols: Symbol[]) {
        const fixedSymbols = [];
        const numbers = [];

        for (let index = 0; index < symbols.length; index++) {
            const symbol = symbols[index];
            if (index === symbols.length - 1) {
                fixedSymbols.push(symbol);
                numbers.push(symbol.text.replace(/\D/g, ''));
                continue;
            }

            const nextSymbol = symbols[index + 1];
            if (symbol.bbox.x1 < nextSymbol.bbox.x0) {
                fixedSymbols.push(symbol);
                numbers.push(symbol.text.replace(/\D/g, ''));
                continue;
            }

            const width = nextSymbol.bbox.x1 - symbol.bbox.x0;
            const height = nextSymbol.bbox.y1 - symbol.bbox.y0;
            const margin = height * 0.2;

            const rectangle: Rectangle = {
                left: symbol.bbox.x0,
                top: symbol.bbox.y0 - margin,
                width,
                height: height + 2 * margin,
            };

            const page = await this.detectNumbers(this.image.src, rectangle);

            fixedSymbols.push(...SymbolHelper.fromPage(page));
            numbers.push(page.text.replace(/\D/g, ''));
            index++;

            console.warn(
                `Incorrect bbox for numbers ${symbol.text}, ${nextSymbol.text}, rerun detecting: ${page.text.replace(/\D/g, '')}`,
            );
        }

        return {
            symbols: fixedSymbols,
            numbers: numbers.join(''),
        };
    }

    fixNumbers(numbers: string, rectangle: Rectangle) {
        const toNumbers = (nums: string) => nums.split('').map((n) => Number(n));

        if (numbers.length === 1) {
            return toNumbers(numbers);
        }

        if (this.cellInfo.count < 10) {
            return toNumbers(numbers);
        }

        if (
            this.cellInfo.count < 20 &&
            numbers.split('').every((n) => !n.includes('1'))
        ) {
            return toNumbers(numbers);
        }
        const spaces = this.spaces(rectangle);
        let n = '';
        let fixedNumbers: string[] = [];

        numbers.split('').forEach((num, index) => {
            if (index + 1 >= spaces.length || spaces[index + 1]) {
                fixedNumbers.push(`${n}${num}`);
                n = '';
            } else {
                n += num;
            }
        });

        return fixedNumbers.map((n) => Number(n));
    }

    spaces(rectangle: Rectangle) {
        const minSpaceRatio = 0.2;

        const isBackground = (x: number) => {
            for (let y = rectangle.top; y < rectangle.top + rectangle.height; y++) {
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

        for (let x = rectangle.left; x < rectangle.left + rectangle.width; x++) {
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
            .map((sp) => sp / rectangle.height)
            .map((w) => w > minSpaceRatio);
    }
}
