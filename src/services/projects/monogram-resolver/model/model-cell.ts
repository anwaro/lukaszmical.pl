export enum CellStatus {
    unknown = 'unknown',
    included = 'included',
    excluded = 'excluded',
}

export type CellId = `${string}${number}`;

export class CellModel {
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
        public status: CellStatus = CellStatus.unknown,
    ) {}

    updateStatus(
        status: CellStatus,
        resolverName: string,
        resolveInGroup: string,
    ): CellModel {
        this.status = status;
        this.resolver = resolverName;
        this.resolveInGroup = resolveInGroup;
        return this;
    }
}
