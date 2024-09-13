import {Bounds} from '../model/model-store';
import {Color, ImageDataHelper} from '../helper/helper-image-data';

export class PrepareImageToNumberDetect {
    private white: Color = [255, 255, 255, 255];
    private threshold = 255 * 3 * (180 / 255);
    private groupsBgColors: Color[] = [
        [235, 239, 248, 255], // silver
        [213, 222, 233, 255], // border
    ];

    computeColor(color: Color): Color {
        const sum = color[0] + color[1] + color[2];

        if (sum > this.threshold) {
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
