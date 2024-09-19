import {ArrayHelper} from '../helper/helper-array';
import {ResolverHelper} from '../helper/helper-resolver';
import {StatusHelper} from '../helper/helper-status';
import {GroupModel} from '../model/model-group';
import {CellModel} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';

export class SeparatedGroupMustIncludeSpecificValueResolver extends ResolverModel {
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
        const separatedGroups = StatusHelper.toSeparatedGroups(groupCells, true);
        const minValue = Math.min(...values);

        for (const separatedGroup of separatedGroups) {
            if (separatedGroup.groups.length !== 1) {
                continue;
            }

            const groupSize = StatusHelper.separatedGroupsSize(separatedGroup);
            const includedSize = separatedGroup.groups[0].len;

            const potentialValues = ArrayHelper.unique(
                values.filter((v) => includedSize <= v && v <= groupSize),
            );

            if (potentialValues.length !== 1) {
                continue;
            }
            const groupValue = potentialValues[0];

            if (groupValue + minValue < groupSize) {
                continue;
            }

            const res = ResolverHelper.resolveSeparatedGroup(
                separatedGroup,
                potentialValues[0],
            );
            result.included.push(...res.included);
            result.excluded.push(...res.excluded);
        }

        return result;
    }
}
