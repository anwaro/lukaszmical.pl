import {StatusHelper} from '../helper/helper-status';
import {GroupModel} from '../model/model-group';
import {CellModel, CellStatus} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';
import {ResolverHelper} from '../helper/helper-resolver';

export class SeparatedGroupNearBorderResolver extends ResolverModel {
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
        const separatedGroups = StatusHelper.toSeparatedGroups(groupCells);

        // if first separated group does not have included cells
        if (
            separatedGroups[0].groups.every(
                (group) => group.status !== CellStatus.included,
            )
        ) {
            return result;
        }

        const firstValue = values[0];
        const separatedGroup = separatedGroups[0];
        const separatedGroupWidth =
            separatedGroup.separatorEnd.start -
            separatedGroup.separatorStart.start +
            separatedGroup.separatorStart.len;
        // if group doesn't include 'included group' return empty result
        if (separatedGroup.groups.every((g) => g.status !== CellStatus.included)) {
            return result;
        }

        // check if separated groups count is not equal to values count and first two value can fill in first group
        const separatedGroupsWithoutUnknown = StatusHelper.toSeparatedGroups(
            groupCells,
            true,
        );
        const twoFirstValueSum =
            firstValue + (values.length > 1 ? values[1] + 1 : 0);
        if (
            separatedGroupsWithoutUnknown.length !== values.length &&
            twoFirstValueSum <= separatedGroupWidth
        ) {
            return result;
        }

        return ResolverHelper.resolveSeparatedGroup(separatedGroup, firstValue);
    }
}
