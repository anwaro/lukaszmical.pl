import {GroupHelper} from '../helper/helper-group';
import {CellModel, CellStatus} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';
import {CellHelper} from '../helper/helper-cell';

export class IncludedPlusUnknownEqualToSumResolver extends ResolverModel {
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
        const sum = GroupHelper.sum(values);
        const unknownCells = CellHelper.unknownCells(groupCells);
        const includedCells = CellHelper.includedCells(groupCells);

        if (sum !== unknownCells.length + includedCells.length) {
            return result;
        }

        for (let index = 0; index < groupCells.length; index++) {
            if (groupCells[index].status === CellStatus.unknown) {
                result.included.push(index);
            }
        }

        return result;
    }
}
