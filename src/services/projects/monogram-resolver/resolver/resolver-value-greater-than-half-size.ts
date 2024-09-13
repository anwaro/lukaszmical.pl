import {CellModel, CellStatus} from '../model/model-cell';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';

export class ValueGreaterThanHalfSizeResolver extends ResolverModel {
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
        const initialLeftOffsite = Math.max(
            groupCells.findIndex((c) => c.status !== CellStatus.excluded),
            0,
        );

        const lastNonExcludedIndex = groupCells.findLastIndex(
            (c) => c.status !== CellStatus.excluded,
        );

        const lastCellIndex = groupCells.length - 1;
        const initialRightOffsite =
            lastCellIndex -
            (lastNonExcludedIndex === -1 ? lastCellIndex : lastNonExcludedIndex);

        for (let index = 0; index < values.length; index++) {
            const value = values[index];
            const leftOffset = values.reduce(
                (acc, value, i) => (i < index ? acc + value + 1 : acc),
                initialLeftOffsite,
            );
            const rightOffset = values.reduce(
                (acc, value, i) => (i > index ? acc + value + 1 : acc),
                initialRightOffsite,
            );
            const totalOffset = leftOffset + rightOffset;

            if (value > (groupCells.length - totalOffset) / 2) {
                const startIndex = groupCells.length - rightOffset - value;
                const endIndex = value + leftOffset - 1;

                for (let i = startIndex; i <= endIndex; i++) {
                    result.included.push(i);
                }
            }
        }

        return result;
    }
}
