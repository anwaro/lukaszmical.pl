import {CellModel} from '@/services/projects/number-sums-resolver/model/model-cell';
import {
    ResolverModel,
    ResolverResult,
} from '@/services/projects/number-sums-resolver/model/model-resolver';
import {GroupModel} from '@/services/projects/number-sums-resolver/model/model-group';
import {CellHelper} from '@/services/projects/number-sums-resolver/helper/helper-cell';

export class OddEvenSumResolver extends ResolverModel {
    run(group: GroupModel, cells: CellModel[]): ResolverResult {
        const result: ResolverResult = {included: [], excluded: []};
        const restSum = group.sum - CellHelper.sum(group.includedCells(cells));
        const unknownCells = group.unknownCells(cells);
        const unknownCellsSum = CellHelper.sum(unknownCells);
        const unknownOddCells = unknownCells.filter((c) => c.value % 2 === 1);
        const unknownOddCellsSum = CellHelper.sum(unknownOddCells);
        const isOdd = restSum % 2 === 1;

        // if sum is odd and only one cell is odd it must be included
        if (isOdd && unknownOddCells.length === 1) {
            result.included.push(unknownOddCells[0].id);
        }

        // if sum is even and only one cell is odd it must be excluded
        if (!isOdd && unknownOddCells.length === 1) {
            result.excluded.push(unknownOddCells[0].id);
        }

        if (
            !isOdd &&
            unknownOddCells.length === 2 &&
            unknownCellsSum - unknownOddCellsSum < restSum
        ) {
            unknownOddCells.forEach((cell) => result.included.push(cell.id));
        }

        return result;
    }
}
