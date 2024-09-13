import {CellModel, CellStatus} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';

type Hole = {
    start: number;
    len: number;
};

export class ExcludeHoleSmallerThanValuesResolver extends ResolverModel {
    run(group: GroupModel, groupCells: CellModel[]): ResolverResult {
        const result = ResolverResult.create(groupCells);

        result.addIndexResult(
            this.resolveGroup(group.values, groupCells),
            groupCells,
        );

        return result;
    }

    resolveGroup(values: number[], groupCells: CellModel[]): ResolveIndexResult {
        const result = createResolveIndexResult();
        const minValue = Math.min(...values);
        let holes = this.createHoles(groupCells);

        const holesToExcluded = holes.filter((h) => h.len < minValue);

        // additional check for start and end
        if (holes.length) {
            const firstValue = values[0];
            const firstHole = holes[0];
            const alreadyIncludedFirst = holesToExcluded.some(
                (h) => h.start === firstHole.start,
            );
            if (
                !alreadyIncludedFirst &&
                firstHole.start < firstValue &&
                firstHole.len < firstValue
            ) {
                holesToExcluded.unshift(firstHole);
            }

            const lastValue = values[values.length - 1];
            const lastHole = holes[holes.length - 1];
            const alreadyIncludedLast = holesToExcluded.some(
                (h) => h.start === lastHole.start,
            );
            if (
                !alreadyIncludedLast &&
                groupCells.length - lastHole.start <= lastValue &&
                lastHole.len < lastValue
            ) {
                holesToExcluded.push(lastHole);
            }
        }

        holesToExcluded.forEach((hole) => {
            for (let index = hole.start; index < hole.start + hole.len; index++) {
                result.excluded.push(index);
            }
        });

        return result;
    }

    createHoles(groupCells: CellModel[]) {
        let currentStatus = CellStatus.excluded;
        let currentHole: Hole = {start: -1, len: 0};
        let holes: Hole[] = [];

        for (let index = 0; index < groupCells.length; index++) {
            const cell = groupCells[index];
            if (
                cell.status === CellStatus.unknown &&
                currentStatus === CellStatus.excluded
            ) {
                currentHole = {start: index, len: 1};
            }

            if (
                cell.status === CellStatus.unknown &&
                currentStatus === CellStatus.unknown
            ) {
                if (currentHole.start !== -1) {
                    currentHole.len++;
                }
            }

            if (
                cell.status === CellStatus.excluded &&
                currentStatus === CellStatus.unknown
            ) {
                if (currentHole.len) {
                    holes.push(currentHole);
                }
                currentHole = {start: -1, len: 0};
            }

            if (cell.status === CellStatus.included) {
                currentHole = {start: -1, len: 0};
            }

            currentStatus = cell.status;
        }

        if (currentHole.len) {
            holes.push(currentHole);
        }

        return holes;
    }
}
