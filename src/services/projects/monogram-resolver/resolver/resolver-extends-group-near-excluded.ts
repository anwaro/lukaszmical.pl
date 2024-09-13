import {StatusGroup, StatusHelper} from '../helper/helper-status';
import {CellModel, CellStatus} from '../model/model-cell';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';

type StatusGroupToProcess = StatusGroup & {
    blockedSide: 'left' | 'right';
};

export class ExtendsGroupNearExcludedResolver extends ResolverModel {
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
        const minValue = Math.min(...values);
        const groupsToProcess = this.groupsToProcess(groupCells, minValue);

        for (const group of groupsToProcess) {
            const diff = minValue - group.len;

            result.included.push(
                ...new Array(diff).fill(null).map((_, i) => {
                    return group.blockedSide === 'left'
                        ? group.start + group.len + i
                        : group.start - 1 - i;
                }),
            );
        }

        return result;
    }

    groupsToProcess(
        groupCells: CellModel[],
        minValue: number,
    ): StatusGroupToProcess[] {
        const statusGroups = StatusHelper.toStatusGroups(groupCells);
        const isExcluded = (index: number) => {
            if (index < 0 || index >= statusGroups.length) {
                return false;
            }
            return statusGroups[index].status === CellStatus.excluded;
        };

        return statusGroups
            .map((g, index) => {
                if (g.status !== CellStatus.included) {
                    return undefined;
                }
                if (g.len >= minValue) {
                    return undefined;
                }
                if (!isExcluded(index - 1) && !isExcluded(index + 1)) {
                    return undefined;
                }

                return {
                    ...g,
                    blockedSide: isExcluded(index - 1) ? 'left' : 'right',
                } satisfies StatusGroupToProcess;
            })
            .filter((g) => g !== undefined);
    }
}
