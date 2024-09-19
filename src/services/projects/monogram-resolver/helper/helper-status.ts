import {CellModel, CellStatus} from '../model/model-cell';

export type StatusGroup = {
    status: CellStatus;
    start: number;
    len: number;
};
export type SeparatedGroup = {
    separatorStart: StatusGroup;
    groups: StatusGroup[];
    separatorEnd: StatusGroup;
};

export class StatusHelper {
    static toStatusGroups(cells: CellModel[]) {
        const groups: StatusGroup[] = [];
        let currentStatus = cells[0].status;
        let currentGroup: StatusGroup = {
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
                currentGroup = {
                    start: index,
                    len: 1,
                    status: cell.status,
                };
            }
            currentStatus = cell.status;
        }
        groups.push(currentGroup);
        return groups;
    }

    static filter(groups: StatusGroup[], status: CellStatus) {
        return groups.filter((group) => group.status === status);
    }

    static toHoles(groupCells: CellModel[]) {
        const statusGroup = StatusHelper.toStatusGroups(groupCells);
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

    static toSeparatedGroups(cells: CellModel[], skipUnknownGroups = false) {
        let statusGroups = StatusHelper.toStatusGroups(cells);

        if (skipUnknownGroups) {
            statusGroups = statusGroups.filter(
                (g) => g.status !== CellStatus.unknown,
            );
        }
        let separatedGroupStart: StatusGroup = {
            start: -1,
            len: 1,
            status: CellStatus.unknown,
        };
        let includedGroups: StatusGroup[] = [];
        const separatedGroups: SeparatedGroup[] = [];

        for (let index = 0; index < statusGroups.length; index++) {
            const group = statusGroups[index];

            if (group.status === CellStatus.excluded) {
                if (includedGroups.length) {
                    separatedGroups.push({
                        separatorStart: separatedGroupStart,
                        groups: includedGroups,
                        separatorEnd: group,
                    });
                }

                includedGroups = [];
                separatedGroupStart = group;
            } else {
                includedGroups.push(group);
            }
        }

        if (includedGroups.length) {
            separatedGroups.push({
                separatorStart: separatedGroupStart,
                groups: includedGroups,
                separatorEnd: {
                    start: cells.length,
                    len: 1,
                    status: CellStatus.unknown,
                },
            });
        }

        return separatedGroups;
    }

    static separatedGroupsSize(separatedGroup: SeparatedGroup) {
        return (
            separatedGroup.separatorEnd.start -
            separatedGroup.separatorStart.start -
            separatedGroup.separatorStart.len
        );
    }

    static separatedGroupsIsResolved(separatedGroup: SeparatedGroup) {
        return (
            separatedGroup.groups.length === 1 &&
            separatedGroup.groups[0].len ===
                StatusHelper.separatedGroupsSize(separatedGroup)
        );
    }

    static validateStatusGroups(statusGroups: StatusGroup[], values: number[]) {
        const includedGroups = StatusHelper.filter(
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

    static validateSeparatedGroups(
        separatedGroups: SeparatedGroup[],
        values: number[],
    ) {
        return separatedGroups.every((group, i) => {
            const size =
                group.separatorEnd.start -
                group.separatorStart.start -
                group.separatorStart.len;

            if (size < values[i]) {
                return false;
            }

            if (i !== 0 && size >= values[i] + values[i - 1] + 1) {
                return false;
            }

            if (i !== values.length - 1 && size >= values[i] + values[i + 1] + 1) {
                return false;
            }

            return true;
        });
    }
}
