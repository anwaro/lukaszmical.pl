import {CellHelper} from '../helper/helper-cell';
import {CellModel, CellStatus} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';

export class ExcludeForSingleResolver extends ResolverModel {
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

        if (values.length > 1 || includedCells.length === 0) {
            return result;
        }

        const value = values[0];

        const firstSelectedIndex = groupCells.findIndex(
            (c) => c.status === CellStatus.included,
        );
        const lastSelectedIndex = groupCells.findLastIndex(
            (c) => c.status === CellStatus.included,
        );

        for (let index = 0; index <= lastSelectedIndex - value; index++) {
            result.excluded.push(index);
        }

        for (
            let index = firstSelectedIndex + value;
            index < groupCells.length;
            index++
        ) {
            result.excluded.push(index);
        }

        return result;
    }
}
