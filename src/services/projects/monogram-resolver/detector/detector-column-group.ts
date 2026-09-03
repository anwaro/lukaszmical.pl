import {Page, Rectangle, Symbol} from 'tesseract.js';

import {ArrayHelper} from '../helper/helper-array';
import {ValidatorModel} from '../model/model-validator';
import {GroupModel, GroupType} from '../model/model-group';
import {ColumnHelper} from '../helper/helper-column';
import {CellModel} from '../model/model-cell';
import {Bounds, CellsInfo, ImageFileData} from '../model/model-store';
import {SymbolHelper} from '../helper/helper-symbol';
import {NumberDetector} from './detector-number';

export class ColumnGroupDetector extends NumberDetector {
    public columns: GroupModel[] = [];
    private validator = new ValidatorModel();

    constructor(
        private readonly image: ImageFileData,
        private readonly columnValuesBounds: Bounds,
        private readonly cells: CellModel[],
        private readonly cellInfo: CellsInfo,
    ) {
        super();
    }

    async run() {
        await this.initializeDetector();

        this.columns = await Promise.all(
            ArrayHelper.create(this.cellInfo.count).map((i) =>
                this.createGroup(this.image.src, i),
            ),
        );
    }

    async createGroup(url: string, index: number) {
        const id = ColumnHelper.id(index);
        const page = await this.detectNumbers(
            url,
            ColumnHelper.valuesRectangle(
                index,
                this.columnValuesBounds,
                this.cellInfo,
            ),
        );

        const numbers = await this.pageToNumbers(id, page);

        this.validator.validateGroupValues(numbers, this.cellInfo.count, id);

        return new GroupModel(
            id,
            GroupType.column,
            this.cells
                .filter((cell) => cell.columnIndex == index)
                .map((cell) => cell.id),
            numbers,
            SymbolHelper.fromPage(page),
        );
    }

    async pageToNumbers(groupId: string, page: Page): Promise<number[]> {
        const stringNumbers = page.text.split('\n').filter((c) => c !== '');
        const symbols = SymbolHelper.fromPage(page);
        const numbers = [];
        let index = 0;

        for (const stringNumber of stringNumbers) {
            if (stringNumber === '1') {
                numbers.push(this.checkIsEleven(symbols[index]));
            } else if (/\d+/.test(stringNumber)) {
                numbers.push(Number(stringNumber));
            } else {
                // try to recognise number again
                const fixedValue = await this.repeatDetectForNonDigitValue(
                    groupId,
                    page.text,
                    stringNumber,
                    symbols[index],
                );
                numbers.push(fixedValue);
            }
            index += stringNumber.length;
        }

        return numbers;
    }

    checkIsEleven(symbol: Symbol): number {
        const bboxWidth = symbol.bbox.x1 - symbol.bbox.x0;
        const bboxHeight = symbol.bbox.y1 - symbol.bbox.y0;
        const bboxRatio = bboxWidth / bboxHeight;

        if (bboxRatio > 0.6) {
            return 11;
        }
        return 1;
    }

    async repeatDetectForNonDigitValue(
        group: string,
        values: string,
        value: string,
        symbol: Symbol,
    ): Promise<number | never> {
        const height = symbol.bbox.y1 - symbol.bbox.y0;
        const margin = height * 0.2;

        const rectangle: Rectangle = {
            left: Math.floor(symbol.bbox.x0 - margin),
            top: Math.floor(symbol.bbox.y0 - margin),
            width: Math.ceil(symbol.bbox.x1 - symbol.bbox.x0 + 2 * margin),
            height: Math.ceil(height + 2 * margin),
        };

        const res = await this.detectNumbers(this.image.src, rectangle);
        const detectedValue = res.text.replace(/\s+/g, '');

        if (/\d+/.test(detectedValue)) {
            return Number(detectedValue);
        }

        throw [
            `Non digit value`,
            `Group: ${group}`,
            `Detected values: "${values}"`,
            `Invalid value "${value}"`,
        ].join(' ');
        // sadasdasdasd
    }
}
