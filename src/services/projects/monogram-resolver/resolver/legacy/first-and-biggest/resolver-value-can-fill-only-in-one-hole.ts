import {ResolverHelper} from '../../../helper/helper-resolver';
import {CellModel} from '../../../model/model-cell';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverModel} from '../../../model/model-resolver';
import {GroupModel} from '../../../model/model-group';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';
import {SeparatedGroupHelper} from '../../../helper/helper-separated-group';

export class ValueCanFillOnlyInOneHoleResolver extends ResolverModel {
    run(group: GroupModel, groupCells: CellModel[]): ResolverResult {
        const result = ResolverResult.create(groupCells);

        result.addIndexResult(
            this.resolveGroup(group.values, groupCells),
            groupCells,
        );

        return result;
    }

    resolveGroup(values: number[], groupCells: CellModel[]): ResolverIndexResult {
        const result = ResolverIndexResult.create();
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        const maxValues = values.filter((v) => v === maxValue);

        const separatedGroups = SeparatedGroupHelper.fromCells(groupCells);
        const groupsCanIncludeMaxValue = separatedGroups.filter(
            (group) => maxValue <= group.size,
        );

        // validate if some group can fit two max value
        if (groupsCanIncludeMaxValue.some((g) => g.size > 2 * maxValue)) {
            return result;
        }

        if (groupsCanIncludeMaxValue.length === maxValues.length) {
            groupsCanIncludeMaxValue.forEach((group) => {
                result.addIndexesResults(
                    ResolverHelper.resolveSeparatedGroup(
                        group,
                        maxValue,
                        maxValue + minValue < group.size,
                    ),
                );
            });
        }

        return result;
    }
}
