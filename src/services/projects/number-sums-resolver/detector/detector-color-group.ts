import {Rectangle} from 'tesseract.js';

import {HexColor} from '@/services/projects/number-sums-resolver/helper/helper-image-data';

import {ColorGroupHelper} from '../helper/helper-color-group';
import {GroupModel, GroupType} from '../model/model-group';
import {CellModel} from '../model/model-cell';
import {PointModel} from '../model/model-point';
import {NumberDetector} from './detector-number';

export class ColorGroupDetector extends NumberDetector {
    public groups: GroupModel[] = [];

    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly cells: CellModel[],
    ) {
        super();
    }

    async run() {
        const colors = new Set(this.cells.map((cell) => cell.color));
        if (colors.size < 2) {
            return;
        }

        await this.initializeDetector();
        const url = this.canvas.toDataURL();

        this.groups = await Promise.all(
            [...colors].map((color) => this.createGroup(url, color)),
        );
    }

    async createGroup(url: string, color: HexColor) {
        const cells = this.cells.filter((cell) => cell.color == color);

        const sum = await this.detectNumber(url, {
            rectangle: ColorGroupHelper.sumRectangle(cells),
        });

        return new GroupModel(
            ColorGroupHelper.id(color),
            GroupType.color,
            this.cells.filter((cell) => cell.color == color).map((cell) => cell.id),
            this.contour(cells),
            sum,
            color,
        );
    }

    contour(cells: CellModel[]): PointModel[] {
        const size = cells[0].width;
        let points = cells.flatMap((c) => c.getCellPoints());
        const maxAttempts = points.length;
        points = points.filter(
            (point) =>
                4 !=
                points.filter((p) => p[0] === point[0] && p[1] === point[1]).length,
        );
        const contour: PointModel[] = [];
        const minY = Math.min(...points.map((p) => p[1]));
        const minX = Math.min(
            ...points.filter((p) => p[1] === minY).map((p) => p[0]),
        );
        const firstPoint: PointModel = [minX, minY];
        contour.push(firstPoint);

        let attempt = 0;
        let currentPoint: PointModel = [minX, minY];

        const pointExists = (point: PointModel) => {
            return points.some((p) => p[0] === point[0] && p[1] === point[1]);
        };

        while (attempt < maxAttempts && points.length) {
            attempt++;

            const topPoint: PointModel = [currentPoint[0], currentPoint[1] - size];
            const leftPoint: PointModel = [currentPoint[0] + size, currentPoint[1]];
            const bottomPoint: PointModel = [
                currentPoint[0],
                currentPoint[1] + size,
            ];
            const rightPoint: PointModel = [currentPoint[0] - size, currentPoint[1]];

            for (const point of [leftPoint, bottomPoint, rightPoint, topPoint]) {
                if (pointExists(point)) {
                    currentPoint = point;
                    contour.push(point);
                    points = points.filter(
                        (p) => p[0] !== point[0] || p[1] !== point[1],
                    );
                    break;
                }
            }
        }

        return contour;
    }
}
