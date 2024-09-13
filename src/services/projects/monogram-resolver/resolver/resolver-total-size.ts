import {GroupHelper} from '../helper/helper-group';
import {CellModel} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';

export class TotalSizeResolver extends ResolverModel {
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
        const sum = GroupHelper.valuesSize(values);

        if (sum === groupCells.length) {
            const statusMap = values.flatMap((val) => [
                ...new Array(val).fill(true),
                false,
            ]);
            for (let i = 0; i < groupCells.length; i++) {
                if (statusMap[i]) {
                    result.included.push(i);
                } else {
                    result.excluded.push(i);
                }
            }
        }

        return result;
    }
}
