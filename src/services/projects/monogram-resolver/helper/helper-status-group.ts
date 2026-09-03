import {StatusGroup} from '../model/model-status-group';
import {CellModel, CellStatus} from '../model/model-cell';

export class StatusGroupHelper {
    static fromCells(
        cells: CellModel[],
        status: CellStatus | undefined = undefined,
    ): StatusGroup[] {
        const groups: StatusGroup[] = [];
        let currentStatus = cells[0].status;
        let currentGroup: StatusGroup = {
            index: 0,
            start: 0,
            len: 0,
            status: currentStatus,
        };

        for (let index = 0; index < cells.length; index++) {
            const cell = cells[index];
            if (currentStatus === cell.status) {
                currentGroup.len++;
            } else {
                groups.push(currentGroup);
                const nextIndex = currentGroup.index + 1;
                currentGroup = {
                    index: nextIndex,
                    start: index,
                    len: 1,
                    status: cell.status,
                };
            }
            currentStatus = cell.status;
        }
        groups.push(currentGroup);
        if (status) {
            return StatusGroupHelper.filter(groups, status);
        }
        return groups;
    }

    static filter(groups: StatusGroup[], status: CellStatus) {
        return groups.filter((group) => group.status === status);
    }

    static toHoles(groupCells: CellModel[]) {
        const statusGroup = StatusGroupHelper.fromCells(groupCells);
        return statusGroup.filter((group, index) => {
            if (group.status !== CellStatus.unknown) {
                return false;
            }

            if (
                index !== 0 &&
                statusGroup[index - 1].status !== CellStatus.excluded
            ) {
                return false;
            }

            if (
                index !== statusGroup.length - 1 &&
                statusGroup[index + 1].status !== CellStatus.excluded
            ) {
                return false;
            }
            return true;
        });
    }

    static validate(statusGroups: StatusGroup[], values: number[]) {
        const includedGroups = StatusGroupHelper.filter(
            statusGroups,
            CellStatus.included,
        );

        function getGroupBlocker(
            index: number,
            includedGroups: StatusGroup[],
            statusGroups: StatusGroup[],
        ) {
            const currentGroupStart = includedGroups[index].start;

            const lastGroup = statusGroups[statusGroups.length - 1];
            const nextGroupStart =
                index === includedGroups.length - 1
                    ? lastGroup.start + lastGroup.len
                    : includedGroups[index + 1].start;

            return statusGroups.find(
                (g) =>
                    g.status === CellStatus.excluded &&
                    currentGroupStart < g.start &&
                    g.start < nextGroupStart,
            );
        }

        if (values.length !== includedGroups.length) {
            return false;
        }

        for (let index = 0; index < includedGroups.length; index++) {
            const isLast = index === includedGroups.length - 1;
            const currentGroup = includedGroups[index];
            const currentValue = values[index];

            const nextGroup = !isLast ? includedGroups[index + 1] : undefined;
            const nextValue = !isLast ? values[index + 1] : undefined;
            if (isLast || !nextGroup || !nextValue) {
                continue;
            }
            const endBlocker = getGroupBlocker(index, includedGroups, statusGroups);

            if (endBlocker) {
                continue;
            }

            const groupSize = nextGroup.start + nextGroup.len - currentGroup.start;
            if (groupSize <= currentValue || groupSize <= nextValue) {
                return false;
            }
        }

        return true;
    }
}
