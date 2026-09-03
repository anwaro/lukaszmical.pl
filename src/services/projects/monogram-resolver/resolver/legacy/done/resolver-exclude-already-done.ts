import {GroupHelper} from '../../../helper/helper-group';
import {GroupModel} from '../../../model/model-group';
import {CellModel, CellStatus} from '../../../model/model-cell';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';
import {ResolverModel} from '../../../model/model-resolver';
import {CellHelper} from '../../../helper/helper-cell';

export class ExcludeAlreadyDoneResolver extends ResolverModel {
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
        const sum = GroupHelper.sum(values);
        const includedCells = CellHelper.includedCells(groupCells);

        if (sum !== includedCells.length) {
            return result;
        }

        for (let index = 0; index < groupCells.length; index++) {
            if (groupCells[index].status === CellStatus.unknown) {
                result.excluded.push(index);
            }
        }

        return result;
    }
}
