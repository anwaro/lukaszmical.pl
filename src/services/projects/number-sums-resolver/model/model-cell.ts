import {PointModel} from '@/services/projects/number-sums-resolver/model/model-point';

import {HexColor} from '../helper/helper-image-data';

export enum CellStatus {
    unknown = 'unknown',
    included = 'included',
    excluded = 'excluded',
}

export type CellId = `${string}${number}`;

export class CellModel {
    public status: CellStatus = CellStatus.unknown;
    public resolver: string | undefined;
    public resolveInGroup: string | undefined;

    constructor(
        public readonly id: CellId,
        public readonly x: number,
        public readonly y: number,
        public readonly width: number,
        public readonly height: number,
        public readonly columnIndex: number,
        public readonly rowIndex: number,
        public readonly color: HexColor,
        public readonly value: number,
    ) {}

    getCellPoints(): PointModel[] {
        return [
            [this.x, this.y],
            [this.x + this.width, this.y],
            [this.x + this.width, this.y + this.height],
            [this.x, this.y + this.height],
        ];
    }

    updateStatus(
        status: CellStatus,
        resolver: string,
        resolveInGroup: string,
    ): CellModel {
        this.status = status;
        this.resolver = resolver;
        this.resolveInGroup = resolveInGroup;
        return this;
    }
}
