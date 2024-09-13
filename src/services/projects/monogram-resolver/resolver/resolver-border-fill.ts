import {CellModel, CellStatus} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';

export class BorderFillResolver extends ResolverModel {
    run(group: GroupModel, groupCells: CellModel[]): ResolverResult {
        const result = ResolverResult.create(groupCells);

        result.addIndexResult(
            this.resolveGroup(group.values, groupCells),
            groupCells,
        );

        result.addIndexResult(
            this.resolveGroup(group.values.toReversed(), groupCells.toReversed()),
            groupCells.toReversed(),
        );

        return result;
    }

    resolveGroup([firstValue]: number[], cells: CellModel[]): ResolveIndexResult {
        const result = createResolveIndexResult();

        const firstIncludedIndex = cells.findIndex(
            (c) => c.status === CellStatus.included,
        );

        if (firstIncludedIndex == -1) {
            return result;
        }

        const startOffset = cells.findIndex((c) => c.status !== CellStatus.excluded);
        const endIndex = startOffset + firstValue;
        if (firstIncludedIndex < endIndex) {
            for (let index = firstIncludedIndex; index < endIndex; index++) {
                if (0 <= index && index < cells.length) {
                    result.included.push(index);
                }
            }
        }

        if (cells[startOffset].status === CellStatus.included) {
            const index = startOffset + firstValue;

            if (index < cells.length) {
                result.excluded.push(startOffset + firstValue);
            }
        }

        return result;
    }
}
