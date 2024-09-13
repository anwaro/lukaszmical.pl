import {StatusGroup, StatusHelper} from '../helper/helper-status';
import {GroupModel} from '../model/model-group';
import {CellModel, CellStatus} from '../model/model-cell';
import {ResolverModel} from '../model/model-resolver';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';

export class AlreadyDoneGroupResolver extends ResolverModel {
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
        const firstValue = values[0];
        const lastValue = values[values.length - 1];
        const statusGroups = StatusHelper.toStatusGroups(groupCells);
        const includedGroups = statusGroups.filter(
            (g) => g.status === CellStatus.included,
        );

        const isSameValue = values.every((v) => v === values[0]);

        if (isSameValue) {
            const readyGroups = includedGroups.filter((g) => g.len === firstValue);
            result.excluded.push(
                ...this.getIndexesAroundGroups(readyGroups, groupCells),
            );
        } else {
            for (let index = 0; index < includedGroups.length; index++) {
                const group = includedGroups[index];
                if (group.len === firstValue && group.start <= firstValue) {
                    result.excluded.push(
                        ...this.getIndexesAroundGroups([group], groupCells),
                    );
                }

                if (
                    group.len === lastValue &&
                    groupCells.length - group.start - group.len <= lastValue
                ) {
                    result.excluded.push(
                        ...this.getIndexesAroundGroups([group], groupCells),
                    );
                }
            }
        }

        return result;
    }

    getIndexesAroundGroups(groups: StatusGroup[], cells: CellModel[]) {
        return groups.flatMap((group) => {
            const leftIndex = group.start - 1;
            const rightIndex = group.start + group.len;
            return [
                ...(leftIndex >= 0 ? [leftIndex] : []),
                ...(rightIndex < cells.length ? [rightIndex] : []),
            ];
        });
    }
}
