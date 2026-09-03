import {StatusGroup} from '../model/model-status-group';
import {SeparatedGroup} from '../model/model-separated-group';
import {CellModel, CellStatus} from '../model/model-cell';
import {StatusGroupHelper} from './helper-status-group';

export class SeparatedGroupHelper {
    static fromCells(cells: CellModel[], skipUnknownGroups = false) {
        let statusGroups = StatusGroupHelper.fromCells(cells);

        if (skipUnknownGroups) {
            statusGroups = statusGroups.filter(
                (g) => g.status !== CellStatus.unknown,
            );
        }

        let separatorStart: StatusGroup = {
            index: -1,
            start: -1,
            len: 1,
            status: CellStatus.unknown,
        };
        let groupIndex = 0;
        let includedGroups: StatusGroup[] = [];
        const separatedGroups: SeparatedGroup[] = [];

        const addGroup = (
            start: StatusGroup,
            end: StatusGroup,
            includedGroups: StatusGroup[],
        ) => {
            const size = end.start - start.start - start.len;
            const includedSize = includedGroups
                .filter((g) => g.status === CellStatus.included)
                .reduce((a, b) => a + b.len, 0);

            separatedGroups.push({
                index: groupIndex++,
                separatorStart: start,
                groups: includedGroups,
                separatorEnd: end,
                isResolved: size === includedSize,
                size,
                includedSize,
            });
        };

        for (let index = 0; index < statusGroups.length; index++) {
            const currentGroup = statusGroups[index];

            if (currentGroup.status === CellStatus.excluded) {
                if (includedGroups.length) {
                    addGroup(separatorStart, currentGroup, includedGroups);
                }

                includedGroups = [];
                separatorStart = currentGroup;
            } else {
                includedGroups.push(currentGroup);
            }
        }

        if (includedGroups.length) {
            addGroup(
                separatorStart,
                {
                    index: statusGroups.length,
                    start: cells.length,
                    len: 1,
                    status: CellStatus.unknown,
                },
                includedGroups,
            );
        }

        return separatedGroups;
    }

    static validate(separatedGroups: SeparatedGroup[], values: number[]) {
        return separatedGroups.every((group, i) => {
            if (group.size < values[i]) {
                return false;
            }

            if (i !== 0 && group.size >= values[i] + values[i - 1] + 1) {
                return false;
            }

            if (
                i !== values.length - 1 &&
                group.size >= values[i] + values[i + 1] + 1
            ) {
                return false;
            }

            return true;
        });
    }
}
