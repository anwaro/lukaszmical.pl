import {CellModel, CellStatus} from '../model/model-cell';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';
import {StatusHelper} from '../helper/helper-status';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';

export class BorderExcludedResolver extends ResolverModel {
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

    resolveGroup(values: number[], groupCells: CellModel[]): ResolveIndexResult {
        const result = createResolveIndexResult();
        const statusGroup = StatusHelper.toStatusGroups(groupCells);

        if (statusGroup.length < 2) {
            return result;
        }

        const firstGroup = statusGroup[0];
        const secondGroup = statusGroup[1];
        const firstValue = values[0];
        if (
            firstGroup.status === CellStatus.unknown &&
            secondGroup.status === CellStatus.included &&
            firstGroup.len <= firstValue
        ) {
            const endIndex = secondGroup.start + secondGroup.len - firstValue;
            for (let index = 0; index < endIndex; index++) {
                if (index < groupCells.length) {
                    result.excluded.push(index);
                }
            }
        }
        return result;
    }
}
