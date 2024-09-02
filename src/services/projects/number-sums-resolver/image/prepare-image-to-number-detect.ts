import {Bounds} from '../model/model-store';
import {Color, ImageDataHelper} from '../helper/helper-image-data';

export class PrepareImageToNumberDetect {
    private white: Color = [255, 255, 255, 255];
    private middle = 255 * 3 * (180 / 255);
    private groupsBgColors: Color[] = [
        [254, 176, 177, 255], // red
        [254, 184, 238, 255], // pink
        [213, 202, 254, 255], // violet
        [193, 220, 254, 255], // blue
        [247, 240, 182, 255], // yellow
        [194, 241, 202, 255], // green
        [254, 225, 189, 255], // orange
        [238, 206, 195, 255], // brown
        [235, 239, 248, 255], // silver
        [213, 222, 233, 255], // border
    ];

    computeColor(color: Color): Color {
        const sum = color[0] + color[1] + color[2];

        if (sum > this.middle) {
            return this.white;
        }

        if (
            this.groupsBgColors.some((c) => ImageDataHelper.isSimilarColor(c, color))
        ) {
            return this.white;
        }

        const c = Math.floor(sum / 3);

        return [c, c, c, 255];
    }

    async run(
        imageData: ImageData,
        gridBounds: Bounds,
        rowSumBounds: Bounds,
        columnSumBounds: Bounds,
    ) {
        let image = new ImageData(
            new Uint8ClampedArray(imageData.data),
            imageData.width,
            imageData.height,
        );

        const startX = rowSumBounds.x - 2;
        const endX = gridBounds.x + gridBounds.width + 2;
        const startY = columnSumBounds.y - 2;
        const endY = gridBounds.y + gridBounds.height + 2;

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const index = ImageDataHelper.getPixelIndex(image.width, x, y);
                const [r, g, b, a] = this.computeColor(
                    ImageDataHelper.getPixelColor(image, x, y),
                );

                image.data[index] = r;
                image.data[index + 1] = g;
                image.data[index + 2] = b;
                image.data[index + 3] = a;
            }
        }

        return image;
    }
}
