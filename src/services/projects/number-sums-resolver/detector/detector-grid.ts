import {Color, ImageDataHelper} from '../helper/helper-image-data';
import {Bounds, CellInfo, initialBounds} from '../model/model-store';

export class GridDetector {
    public gridBounds: Bounds = initialBounds;
    public columnSums: Bounds = initialBounds;
    public rowSums: Bounds = initialBounds;
    public borderWidth = 1;
    public cellInfo: CellInfo = {size: 0, count: 0};
    public bgColor: Color;
    public borderColor: Color = [212, 222, 232, 255];

    constructor(private readonly image: ImageData) {
        const centerY = Math.floor(this.image.height / 2);
        this.bgColor = ImageDataHelper.getPixelColor(this.image, 5, centerY);
        this.detectGridBounds();
        this.detectColumnSums();
        this.detectRowSums();
        this.detectGridSize();
    }

    detectGridBounds() {
        const centerX = Math.floor(this.image.width / 2);
        const centerY = Math.floor(this.image.height / 2);

        const {x: right, borderWidthX: borderWidth} = this.findBorder(
            this.image,
            centerX,
            centerY,
            1,
            0,
        );
        const {x: left} = this.findBorder(this.image, centerX, centerY, -1, 0);
        const {y: top} = this.findBorder(this.image, centerX, centerY, 0, -1);
        const {y: bottom} = this.findBorder(this.image, centerX, centerY, 0, 1);

        this.borderWidth = borderWidth;
        this.gridBounds = {
            x: left,
            y: top,
            width: right - left,
            height: bottom - top,
        };
    }

    detectColumnSums() {
        let y = this.gridBounds.y;
        let x = this.gridBounds.x + 25;

        while (ImageDataHelper.isSameColorInPixel(this.image, x, y, this.bgColor)) {
            y--;
        }

        const bottom = y;

        while (!ImageDataHelper.isSameColorInPixel(this.image, x, y, this.bgColor)) {
            y--;
        }

        this.columnSums = {
            x: this.gridBounds.x,
            y: y,
            width: this.gridBounds.width,
            height: bottom - y,
        };
    }

    detectRowSums() {
        const y = this.gridBounds.y + 25;
        let x = this.gridBounds.x;

        while (ImageDataHelper.isSameColorInPixel(this.image, x, y, this.bgColor)) {
            x--;
        }
        const right = x;

        while (!ImageDataHelper.isSameColorInPixel(this.image, x, y, this.bgColor)) {
            x--;
        }

        this.rowSums = {
            x: x,
            y: this.gridBounds.y,
            width: right - x,
            height: this.gridBounds.height,
        };
    }

    detectGridSize() {
        let x = this.rowSums.x + this.rowSums.width / 2;
        let count = 0;
        let isBgColor = true;

        for (let y = this.rowSums.y; y < this.rowSums.y + this.rowSums.height; y++) {
            const isBg = ImageDataHelper.isSameColorInPixel(
                this.image,
                x,
                y,
                this.bgColor,
            );

            if (isBg !== isBgColor) {
                if (!isBg) {
                    count++;
                }
                isBgColor = isBg;
            }
        }
        this.cellInfo = {
            size: Math.floor((this.gridBounds.width - 2 * this.borderWidth) / count),
            count,
        };
    }

    findBorder(image: ImageData, x: number, y: number, dx = 0, dy = 0) {
        let checkX = x;
        let checkY = y;

        do {
            checkX += dx;
            checkY += dy;
        } while (
            !ImageDataHelper.isSimilarColorInPixel(
                image,
                checkX,
                checkY,
                this.borderColor,
            )
        );

        const border = {
            x: checkX,
            y: checkY,
        };

        do {
            checkX += dx;
            checkY += dy;
        } while (
            !ImageDataHelper.isSimilarColorInPixel(
                image,
                checkX,
                checkY,
                this.bgColor,
            )
        );

        return {
            x: checkX,
            y: checkY,
            borderWidthX: checkX - border.x,
            borderWidthY: checkX - border.x,
        };
    }
}
