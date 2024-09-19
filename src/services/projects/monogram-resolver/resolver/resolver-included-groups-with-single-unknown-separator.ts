import {CellModel, CellStatus} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';
import {StatusHelper} from '../helper/helper-status';

export class IncludedGroupsWithSingleUnknownSeparatorResolver extends ResolverModel {
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
        const maxValue = Math.max(...values);
        const statusGroups = StatusHelper.toStatusGroups(groupCells);

        for (let index = 0; index < statusGroups.length; index++) {
            const group = statusGroups[index];
            if (group.status !== CellStatus.unknown || group.len !== 1) {
                continue;
            }
            if (index === 0 || index === statusGroups.length - 1) {
                continue;
            }
            const prevGroup = statusGroups[index - 1];
            const nextGroup = statusGroups[index + 1];
            if (
                prevGroup.status !== CellStatus.included ||
                nextGroup.status !== CellStatus.included
            ) {
                continue;
            }

            if (prevGroup.len + nextGroup.len < maxValue) {
                continue;
            }

            result.excluded.push(group.start);
        }

        return result;
    }
}
