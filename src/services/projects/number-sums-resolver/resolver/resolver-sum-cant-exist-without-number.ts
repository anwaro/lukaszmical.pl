import {CellModel} from '@/services/projects/number-sums-resolver/model/model-cell';
import {
    ResolverModel,
    ResolverResult,
} from '@/services/projects/number-sums-resolver/model/model-resolver';
import {GroupModel} from '@/services/projects/number-sums-resolver/model/model-group';
import {CellHelper} from '@/services/projects/number-sums-resolver/helper/helper-cell';

export class SumCantExistWithoutNumberResolver extends ResolverModel {
    run(group: GroupModel, cells: CellModel[]): ResolverResult {
        const result: ResolverResult = {included: [], excluded: []};
        const restSum = group.sum - CellHelper.sum(group.includedCells(cells));
        const unknownCells = group.unknownCells(cells);
        const unknownCellsSum = CellHelper.sum(unknownCells);

        for (const cell of unknownCells) {
            if (unknownCellsSum - cell.value < restSum) {
                result.included.push(cell.id);
            }
        }

        return result;
    }
}
