import {CellModel, CellStatus} from '../../../model/model-cell';
import {ResolverModel} from '../../../model/model-resolver';
import {GroupModel} from '../../../model/model-group';
import {StatusGroupHelper} from '../../../helper/helper-status-group';
import {SeparatedGroupHelper} from '../../../helper/helper-separated-group';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';

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

    resolveGroup(values: number[], groupCells: CellModel[]): ResolverIndexResult {
        const result = ResolverIndexResult.create();
        const statusGroup = StatusGroupHelper.fromCells(groupCells);

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
