import {CellHelper} from '../helper/helper-cell';
import {CellModel, CellStatus} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';

export class FillHoleForSingleValueResolver extends ResolverModel {
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
        const includedCells = CellHelper.includedCells(groupCells);

        if (values.length > 1 || includedCells.length < 2) {
            return result;
        }

        const firstSelectedIndex = groupCells.findIndex(
            (c) => c.status === CellStatus.included,
        );
        const lastSelectedIndex = groupCells.findLastIndex(
            (c) => c.status === CellStatus.included,
        );

        for (
            let index = firstSelectedIndex + 1;
            index < lastSelectedIndex;
            index++
        ) {
            result.included.push(index);
        }

        return result;
    }
}
