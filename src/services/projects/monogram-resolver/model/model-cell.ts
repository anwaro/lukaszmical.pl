export enum CellStatus {
    unknown = 'unknown',
    included = 'included',
    excluded = 'excluded',
}

export type CellId = `${string}${number}`;

export class CellModel {
    public resolver: string | undefined;
    public resolveInGroup: string | undefined;
    public loop: number | undefined;

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
        loop: number,
    ): CellModel {
        this.status = status;
        this.resolver = resolverName;
        this.resolveInGroup = resolveInGroup;
        this.loop = loop;
        return this;
    }

    copy(status?: CellStatus): CellModel {
        const cell = new CellModel(
            this.id,
            this.x,
            this.y,
            this.width,
            this.height,
            this.columnIndex,
            this.rowIndex,
            status || this.status,
        );

        cell.resolver = this.resolver;
        cell.resolveInGroup = this.resolveInGroup;
        cell.loop = this.loop;

        return cell;
    }
}
