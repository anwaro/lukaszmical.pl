import {CellModel, CellStatus} from '../../../model/model-cell';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';
import {ResolverModel} from '../../../model/model-resolver';
import {GroupModel} from '../../../model/model-group';
import {StatusGroupHelper} from '../../../helper/helper-status-group';
import {SeparatedGroupHelper} from '../../../helper/helper-separated-group';

export class ExcludeSingleSeparatorResolver extends ResolverModel {
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
        const statusGroups = StatusGroupHelper.fromCells(groupCells);

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
