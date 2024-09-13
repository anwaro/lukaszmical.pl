import {CellHelper} from '../helper/helper-cell';
import {StatusGroup, StatusHelper} from '../helper/helper-status';
import {CellModel, CellStatus} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
    ResolverResult,
} from '../model/model-resolver-result';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';

export class SeparatedGroupsForDoubleValuesResolver extends ResolverModel {
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

        if (values.length !== 2 || includedCells.length < 2) {
            return result;
        }

        const statusGroups = StatusHelper.toStatusGroups(groupCells);
        const includedGroups = statusGroups.filter(
            (f) => f.status === CellStatus.included,
        );

        if (includedGroups.length < 2) {
            return result;
        }

        const firstGroup = includedGroups[0];
        const lastGroup = includedGroups[includedGroups.length - 1];

        const separator = statusGroups.find(
            (g) =>
                g.status === CellStatus.excluded &&
                firstGroup.start < g.start &&
                g.start < lastGroup.start,
        );

        if (!separator) {
            return result;
        }

        const groupsBeforeSeparator = includedGroups.filter(
            (g) => g.start < separator.start,
        );
        result.included.push(
            ...this.includeBetweenGroups(groupsBeforeSeparator, groupCells),
        );
        const groupsAfterSeparator = includedGroups.filter(
            (g) => g.start > separator.start,
        );
        result.included.push(
            ...this.includeBetweenGroups(groupsAfterSeparator, groupCells),
        );

        return result;
    }

    includeBetweenGroups(groups: StatusGroup[], cells: CellModel[]) {
        const start = Math.min(...groups.map((g) => g.start));
        const end = Math.max(...groups.map((g) => g.start));
        const includedIds: number[] = [];

        for (let i = start; i < end; i++) {
            if (cells[i].status === CellStatus.unknown) {
                includedIds.push(i);
            }
        }
        return includedIds;
    }
}
