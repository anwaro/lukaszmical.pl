import {Color, ImageDataHelper} from '../helper/helper-image-data';
import {Bounds, CellsInfo, initialBounds} from '../model/model-store';

export class GridDetector {
    public gridBounds: Bounds = initialBounds;
    public columnValuesBounds: Bounds = initialBounds;
    public rowValuesBounds: Bounds = initialBounds;
    public cellInfo: CellsInfo = {size: 0, count: 0};
    public bgColor: Color;
    public borderWidth = 1;
    public borderColor: Color = [1, 0, 1, 255];

    constructor(private readonly image: ImageData) {
        const centerY = Math.floor(this.image.height / 2);
        this.bgColor = ImageDataHelper.getPixelColor(this.image, 5, centerY);
        this.detectGridBounds();
        this.detectBorderWidth();
        this.detectColumnValuesBounds();
        this.detectRowValuesBounds();
        this.detectGridSize();
    }

    detectGridBounds() {
        const centerX = Math.floor(this.image.width / 2);
        const centerY = Math.floor(this.image.height / 2);
        const startTop = Math.floor(this.image.height / 4);
        const startBottom = Math.floor((this.image.height * 3) / 4);

        const {x: right} = this.findBorder(this.image.width, centerY, -1, 0);
        const {x: left} = this.findBorder(0, centerY, 1, 0);
        const {y: top} = this.findBorder(centerX, startTop, 0, 1);
        const {y: bottom} = this.findBorder(centerX, startBottom, 0, -1);

        this.gridBounds = {
            x: left,
            y: top,
            width: right - left,
            height: bottom - top,
        };
    }

    detectColumnValuesBounds() {
        let y = this.gridBounds.y - 2;
        let x = this.gridBounds.x + 20;

        this.safeLoop(
            () => ImageDataHelper.isSameColorInPixel(this.image, x, y, this.bgColor),
            () => {
                y--;
            },
        );

        const bottom = y;
        y -= 20;
        this.safeLoop(
            () =>
                !ImageDataHelper.isSameColorInPixel(this.image, x, y, this.bgColor),
            () => {
                y--;
            },
        );

        this.columnValuesBounds = {
            x: this.gridBounds.x,
            y: y,
            width: this.gridBounds.width,
            height: bottom - y,
        };
    }

    detectRowValuesBounds() {
        const y = this.gridBounds.y + 20;
        let x = this.gridBounds.x - 2;

        this.safeLoop(
            () => ImageDataHelper.isSameColorInPixel(this.image, x, y, this.bgColor),
            () => {
                x--;
            },
        );

        const right = x;
        x -= 20;

        this.safeLoop(
            () =>
                !ImageDataHelper.isSameColorInPixel(this.image, x, y, this.bgColor),
            () => {
                x--;
            },
        );

        this.rowValuesBounds = {
            x: x,
            y: this.gridBounds.y,
            width: right - x,
            height: this.gridBounds.height,
        };
    }

    detectGridSize() {
        let x = this.rowValuesBounds.x + this.rowValuesBounds.width / 2;
        let count = 0;
        let prevColorIsBg = true;

        for (
            let y = this.rowValuesBounds.y;
            y < this.rowValuesBounds.y + this.rowValuesBounds.height;
            y++
        ) {
            const currentColorIsBg = ImageDataHelper.isSimilarColorInPixel(
                this.image,
                x,
                y,
                this.bgColor,
                4,
            );

            if (currentColorIsBg !== prevColorIsBg) {
                if (!currentColorIsBg) {
                    count++;
                }
                prevColorIsBg = currentColorIsBg;
            }
        }
        this.cellInfo = {
            size: Math.floor((this.gridBounds.width - 2 * this.borderWidth) / count),
            count,
        };
    }

    findBorder(x: number, y: number, dx = 0, dy = 0) {
        let checkX = x;
        let checkY = y;

        this.safeLoop(
            () =>
                !ImageDataHelper.isSimilarColorInPixel(
                    this.image,
                    checkX,
                    checkY,
                    this.borderColor,
                ),
            () => {
                checkX += dx;
                checkY += dy;
            },
        );

        return {
            x: checkX,
            y: checkY,
        };
    }

    detectBorderWidth() {
        let x = this.gridBounds.x + 1;
        let y = Math.floor(this.image.height / 2);

        this.safeLoop(
            () =>
                !ImageDataHelper.isSimilarColorInPixel(
                    this.image,
                    x,
                    y,
                    this.bgColor,
                ),
            () => {
                x++;
            },
        );

        this.borderWidth = x - this.gridBounds.x;
    }

    safeLoop(condition: () => boolean, update: () => void) {
        const maxIteration = 10000;
        let iteration = 0;

        while (condition()) {
            update();
            if (++iteration > maxIteration) {
                break;
            }
        }
    }
}
