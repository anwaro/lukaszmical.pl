import {CellModel} from '@/services/projects/number-sums-resolver/model/model-cell';
import {
    ResolverModel,
    ResolverResult,
} from '@/services/projects/number-sums-resolver/model/model-resolver';
import {GroupModel} from '@/services/projects/number-sums-resolver/model/model-group';
import {CellHelper} from '@/services/projects/number-sums-resolver/helper/helper-cell';
import {ResolverHelper} from '@/services/projects/number-sums-resolver/helper/helper-resolver';

export class CantCreateSumWithNumberResolver extends ResolverModel {
    run(group: GroupModel, cells: CellModel[]): ResolverResult {
        const result: ResolverResult = {included: [], excluded: []};
        const restSum = group.sum - CellHelper.sum(group.includedCells(cells));
        const unknownCells = group.unknownCells(cells);

        for (const cell of unknownCells) {
            const restUnknownCellsValues = unknownCells
                .filter((c) => c.id !== cell.id)
                .map((c) => c.value);

            const diff = restSum - cell.value;

            if (diff < 1) {
                continue;
            }

            const diffSubsets = ResolverHelper.findSubsetWithSum(
                restUnknownCellsValues,
                diff,
            );

            if (diffSubsets.length === 0) {
                result.excluded.push(cell.id);
            }
        }

        return result;
    }
}
