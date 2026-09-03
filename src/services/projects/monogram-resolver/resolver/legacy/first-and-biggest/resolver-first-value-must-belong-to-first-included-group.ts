import {CellModel, CellStatus} from '../../../model/model-cell';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';
import {ResolverModel} from '../../../model/model-resolver';
import {GroupModel} from '../../../model/model-group';
import {ArrayHelper} from '../../../helper/helper-array';
import {StatusGroupHelper} from '../../../helper/helper-status-group';
import {SeparatedGroupHelper} from '../../../helper/helper-separated-group';

export class FirstValueMustBelongToFirstIncludedGroupResolver extends ResolverModel {
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
        const [firstValue, secondValue] = values;
        const [maxValue, secondMaxValue] = ArrayHelper.sort(values);

        if (
            firstValue !== maxValue ||
            secondMaxValue !== secondValue ||
            firstValue === secondValue
        ) {
            return result;
        }
        //
        const statusGroups = StatusGroupHelper.fromCells(groupCells);
        const includedGroups = StatusGroupHelper.filter(
            statusGroups,
            CellStatus.included,
        );

        if (includedGroups.length === 0) {
            return result;
        }

        const [firstIncludedGroup] = includedGroups;

        if (secondValue >= firstIncludedGroup.len) {
            return result;
        }

        result.excluded.push(
            ...ArrayHelper.range(
                0,
                firstIncludedGroup.start + firstIncludedGroup.len - firstValue - 1,
            ),
        );

        return result;
    }
}
