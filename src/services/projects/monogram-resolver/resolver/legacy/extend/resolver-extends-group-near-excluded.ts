import {ArrayHelper} from '../../../helper/helper-array';
import {StatusGroupHelper} from '../../../helper/helper-status-group';
import {StatusGroup} from '../../../model/model-status-group';
import {CellModel, CellStatus} from '../../../model/model-cell';
import {ResolverModel} from '../../../model/model-resolver';
import {GroupModel} from '../../../model/model-group';
import {ResolverResult} from '../../../model/model-resolver-result';
import {ResolverIndexResult} from '../../../model/model-resolver-index-result';

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

    resolveGroup(values: number[], groupCells: CellModel[]): ResolverIndexResult {
        const result = ResolverIndexResult.create();
        const groupsToProcess = this.groupsToProcess(groupCells, values);

        const extendedValue = (len: number) =>
            Math.min(...values.filter((v) => v >= len));

        for (const group of groupsToProcess) {
            const diff = extendedValue(group.len) - group.len;

            result.included.push(
                ...ArrayHelper.create(diff).map((i) => {
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
        values: number[],
    ): StatusGroupToProcess[] {
        const statusGroups = StatusGroupHelper.fromCells(groupCells);
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
                if (values.includes(g.len)) {
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
