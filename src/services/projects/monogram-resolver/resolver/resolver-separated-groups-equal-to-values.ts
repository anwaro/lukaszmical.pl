import {StatusHelper} from '../helper/helper-status';
import {GroupModel} from '../model/model-group';
import {CellModel} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';
import {ResolverHelper} from '../helper/helper-resolver';

export class SeparatedGroupsEqualToValuesResolver extends ResolverModel {
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

        const separatedGroups = StatusHelper.toSeparatedGroups(groupCells);
        const separatedGroupsWithoutUnknown = StatusHelper.toSeparatedGroups(
            groupCells,
            true,
        );

        const separatedGroupsToResolve = [];
        if (separatedGroupsWithoutUnknown.length === values.length) {
            separatedGroupsToResolve.push(...separatedGroupsWithoutUnknown);
        } else if (
            separatedGroups.length === values.length &&
            StatusHelper.validateSeparatedGroups(separatedGroups, values)
        ) {
            separatedGroupsToResolve.push(...separatedGroups);
        }

        for (let index = 0; index < separatedGroupsToResolve.length; index++) {
            const resolveResult = ResolverHelper.resolveSeparatedGroup(
                separatedGroupsToResolve[index],
                values[index],
            );
            result.included.push(...resolveResult.included);
            result.excluded.push(...resolveResult.excluded);
        }

        return result;
    }
}
