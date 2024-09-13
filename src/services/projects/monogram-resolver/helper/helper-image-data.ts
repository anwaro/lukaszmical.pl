export type Color = [number, number, number, number];
export type HexColor = `#${string}`;

export class ImageDataHelper {
    static getPixelIndex(width: number, x: number, y: number) {
        return (y * width + x) * 4;
    }

    static getPixelColor(image: ImageData, x: number, y: number): Color {
        const index = ImageDataHelper.getPixelIndex(image.width, x, y);

        return [
            image.data[index],
            image.data[index + 1],
            image.data[index + 2],
            image.data[index + 3],
        ];
    }

    static isSameColor(color1: Color, color2: Color) {
        return (
            color1[0] === color2[0] &&
            color1[1] === color2[1] &&
            color1[2] === color2[2] &&
            color1[3] === color2[3]
        );
    }

    static isSameColorInPixel(image: ImageData, x: number, y: number, color: Color) {
        return ImageDataHelper.isSameColor(
            color,
            ImageDataHelper.getPixelColor(image, x, y),
        );
    }

    static isSimilarColor(color1: Color, color2: Color, tolerance = 2) {
        return (
            Math.abs(color1[0] - color2[0]) <= tolerance &&
            Math.abs(color1[1] - color2[1]) <= tolerance &&
            Math.abs(color1[2] - color2[2]) <= tolerance &&
            Math.abs(color1[3] - color2[3]) <= tolerance
        );
    }

    static isSimilarColorInPixel(
        image: ImageData,
        x: number,
        y: number,
        color: Color,
        tolerance = 2,
    ) {
        return ImageDataHelper.isSimilarColor(
            color,
            ImageDataHelper.getPixelColor(image, x, y),
            tolerance,
        );
    }
}
