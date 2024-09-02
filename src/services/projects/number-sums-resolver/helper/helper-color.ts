import {Color, HexColor} from '../helper/helper-image-data';

export class ColorHelper {
    static toRgba(color: Color): string {
        const c = [...color];
        c[3] /= 255;
        return `rgba(${color.join(', ')})`;
    }

    static toRgb(color: Color): string {
        return `rgb(${color.slice(0, 3).join(', ')})`;
    }

    static toHex(color: Color): HexColor {
        const hex = color
            .slice(0, 3)
            .map((e) => e.toString(16).padStart(2, '0'))
            .join('');
        return `#${hex}`;
    }
}
