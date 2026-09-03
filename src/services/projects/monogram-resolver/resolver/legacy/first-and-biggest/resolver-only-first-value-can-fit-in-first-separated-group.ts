import {ResolverHelper} from '../../../helper/helper-resolver';
import {CellModel, CellStatus} from '../../../model/model-cell';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';
import {ResolverModel} from '../../../model/model-resolver';
import {GroupModel} from '../../../model/model-group';
import {StatusGroupHelper} from '../../../helper/helper-status-group';
import {SeparatedGroupHelper} from '../../../helper/helper-separated-group';

export class OnlyFirstValueCanFitInFirstSeparatedGroupResolver extends ResolverModel {
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
        if (values.length < 2) {
            return result;
        }
        const [firstValue, secondValue] = values;
        const separatedGroups = SeparatedGroupHelper.fromCells(groupCells);
        const separatedGroup = separatedGroups[0];
        if (separatedGroup.groups.every((g) => g.status !== CellStatus.included)) {
            return result;
        }

        if (separatedGroup.size <= firstValue + secondValue) {
            return ResolverHelper.resolveSeparatedGroup(separatedGroup, firstValue);
        }

        return result;
    }
}
