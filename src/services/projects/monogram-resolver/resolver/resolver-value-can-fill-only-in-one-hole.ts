import {ArrayHelper} from '../helper/helper-array';
import {CellModel} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';
import {StatusHelper} from '../helper/helper-status';

export class ValueCanFillOnlyInOneHoleResolver extends ResolverModel {
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
        const sortedValues = values.toSorted((a, b) => b - a);
        const maxValue = sortedValues[0];
        if (sortedValues.length > 2 && maxValue === sortedValues[1]) {
            return result;
        }
        const separatedGroups = StatusHelper.toSeparatedGroups(groupCells);
        const groupsCanIncludeMaxValue = separatedGroups.filter((group) => {
            const size =
                group.separatorEnd.start -
                group.separatorStart.start -
                group.separatorStart.len;

            return maxValue <= size;
        });

        if (groupsCanIncludeMaxValue.length === 1) {
            const group = groupsCanIncludeMaxValue[0];
            const size =
                group.separatorEnd.start -
                group.separatorStart.start -
                group.separatorStart.len;

            if (size < 2 * maxValue) {
                const startIndex = group.separatorEnd.start - maxValue;
                const endIndex =
                    group.separatorStart.start +
                    group.separatorStart.len +
                    maxValue -
                    1;

                result.included.push(...ArrayHelper.range(startIndex, endIndex));
            }
        }

        return result;
    }
}
