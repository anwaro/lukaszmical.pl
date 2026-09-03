import {StatusGroupHelper} from '../../../helper/helper-status-group';
import {SeparatedGroupHelper} from '../../../helper/helper-separated-group';
import {GroupModel} from '../../../model/model-group';
import {CellModel} from '../../../model/model-cell';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';
import {ResolverModel} from '../../../model/model-resolver';
import {ResolverHelper} from '../../../helper/helper-resolver';

export class SeparatedGroupsEqualToValuesResolver extends ResolverModel {
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

        const separatedGroups = SeparatedGroupHelper.fromCells(groupCells);
        const separatedGroupsWithoutUnknown = SeparatedGroupHelper.fromCells(
            groupCells,
            true,
        );

        const separatedGroupsToResolve = [];
        if (separatedGroupsWithoutUnknown.length === values.length) {
            separatedGroupsToResolve.push(...separatedGroupsWithoutUnknown);
        } else if (
            separatedGroups.length === values.length &&
            SeparatedGroupHelper.validate(separatedGroups, values)
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
