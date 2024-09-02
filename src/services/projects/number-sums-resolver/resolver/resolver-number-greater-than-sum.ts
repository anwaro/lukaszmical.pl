import {GroupModel} from '@/services/projects/number-sums-resolver/model/model-group';
import {CellModel} from '@/services/projects/number-sums-resolver/model/model-cell';
import {
    ResolverModel,
    ResolverResult,
} from '@/services/projects/number-sums-resolver/model/model-resolver';
import {CellHelper} from '@/services/projects/number-sums-resolver/helper/helper-cell';

export class NumberGreaterThanSumResolver extends ResolverModel {
    run(group: GroupModel, cells: CellModel[]): ResolverResult {
        const result: ResolverResult = {included: [], excluded: []};
        const restSum = group.sum - CellHelper.sum(group.includedCells(cells));
        const unknownCells = group.unknownCells(cells);

        for (const cell of unknownCells) {
            if (cell.value > restSum) {
                result.excluded.push(cell.id);
            }
        }

        return result;
    }
}
