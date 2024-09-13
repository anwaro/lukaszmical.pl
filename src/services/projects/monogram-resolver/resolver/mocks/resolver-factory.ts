import {CellId, CellModel, CellStatus} from '../../model/model-cell';
import {GroupModel, GroupType} from '../../model/model-group';

export class ResolverFactory {
    private index = 0;

    private cells: CellModel[] = [];

    init() {
        this.reset();
        return this;
    }

    addCells(status: CellStatus, count = 1) {
        this.append(...new Array(count).fill(status));
        return this;
    }

    fromPattern(pattern: string) {
        const cells = [...pattern].map((char) => {
            switch (char) {
                case '❌':
                    return CellStatus.excluded;
                case '🟦':
                    return CellStatus.included;
                case '❔':
                default:
                    return CellStatus.unknown;
            }
        });
        this.append(...cells);
        return this;
    }

    getCells() {
        return this.cells;
    }

    getGroup(values: number[]) {
        return new GroupModel(
            'COL-A',
            GroupType.column,
            this.cells.map((c) => c.id),
            values,
        );
    }

    private createId(): CellId {
        return `A${++this.index}`;
    }

    private reset() {
        this.index = 0;
        this.cells = [];
    }

    private append(...statuses: CellStatus[]) {
        for (let index = 0; index < statuses.length; index++) {
            const status = statuses[index];

            this.cells.push(
                new CellModel(
                    this.createId(),
                    0,
                    0,
                    100,
                    100,
                    0,
                    this.index - 1,
                    status,
                ),
            );
        }
    }
}
