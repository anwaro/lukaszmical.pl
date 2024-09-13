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
}
