import {CellId, CellModel, CellStatus} from './model-cell';

export type ResolveIndexResult = {
    included: number[];
    excluded: number[];
};

export const createResolveIndexResult = (): ResolveIndexResult => ({
    included: [],
    excluded: [],
});

export class ResolverResult {
    constructor(
        private groupCells: CellModel[],
        private included: CellId[] = [],
        private excluded: CellId[] = [],
    ) {}

    static create(
        groupCells: CellModel[],
        included: CellId[] = [],
        excluded: CellId[] = [],
    ) {
        return new ResolverResult(groupCells, included, excluded);
    }

    addIndexResult(result: ResolveIndexResult, cells: CellModel[]) {
        const cellIds = (indexes: number[]) => {
            const _cellsIds = indexes
                .filter((i) => i >= 0 && i < cells.length)
                .map((i) => cells[i].id);
            if (_cellsIds.length !== indexes.length) {
                console.warn('invalid cells ids in', ...indexes);
            }

            return _cellsIds;
        };
        this.included.push(...cellIds(result.included));
        this.excluded.push(...cellIds(result.excluded));
    }

    uniqueResult(results: CellId[], groupCells: CellModel[]): CellId[] {
        const sort = (a: CellId, b: CellId) => {
            const rowA = Number(a.replace(/\D+/g, ''));
            const rowB = Number(b.replace(/\D+/g, ''));
            if (rowA === rowB) {
                const columnA = a.replace(/\d+/g, '');
                const columnB = b.replace(/\d+/g, '');
                return columnA.localeCompare(columnB);
            }
            return Math.sign(rowA - rowB);
        };

        const toUnique = (cells: CellId[]) => {
            const filtered = cells.filter((id) => {
                const groupCell = groupCells.find((c) => c.id === id);
                if (groupCell && groupCell.status !== CellStatus.unknown) {
                    return false;
                }
                return true;
            });

            return [...new Set(filtered.sort(sort))];
        };

        return toUnique(results);
    }

    getIncludedCellsId() {
        return this.uniqueResult(this.included, this.groupCells);
    }

    getExcludedCellsId() {
        return this.uniqueResult(this.excluded, this.groupCells);
    }
}
