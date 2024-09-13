import {GroupModel} from '../model/model-group';
import {CellModel, CellStatus} from '../model/model-cell';
import {ResolverModel} from '../model/model-resolver';
import {StatusHelper} from '../helper/helper-status';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';

export class BiggestValueCheckedResolver extends ResolverModel {
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
        const groupsToProcess = statusGroups.filter(
            (g) => g.status === CellStatus.included && g.len === maxValue,
        );

        for (let index = 0; index < groupsToProcess.length; index++) {
            const group = groupsToProcess[index];
            if (group.start - 1 >= 0) {
                result.excluded.push(group.start - 1);
            }
            if (group.start + group.len < groupCells.length) {
                result.excluded.push(group.start + group.len);
            }
        }

        return result;
    }
}
