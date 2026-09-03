import {ArrayHelper} from '../../../helper/helper-array';
import {CellModel, CellStatus} from '../../../model/model-cell';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';
import {ResolverModel} from '../../../model/model-resolver';
import {GroupModel} from '../../../model/model-group';

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

    resolveGroup([firstValue]: number[], cells: CellModel[]): ResolverIndexResult {
        const result = ResolverIndexResult.create();

        const firstIncludedIndex = cells.findIndex(
            (c) => c.status === CellStatus.included,
        );

        if (firstIncludedIndex == -1) {
            return result;
        }
        const firstExcludedIndex = cells.findIndex(
            (c, i) => c.status === CellStatus.excluded && i > firstIncludedIndex,
        );

        const startOffset = cells.findIndex((c) => c.status !== CellStatus.excluded);
        const endIndex = startOffset + firstValue - 1;
        if (firstIncludedIndex <= endIndex) {
            let startInclude = firstIncludedIndex;

            if (firstExcludedIndex !== -1) {
                startInclude = Math.min(
                    startInclude,
                    firstExcludedIndex - firstValue,
                );
            }

            result.included.push(...ArrayHelper.range(startInclude, endIndex));
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
