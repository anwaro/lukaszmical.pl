import {ArrayHelper} from '../helper/helper-array';
import {CellStatus} from '../model/model-cell';
import {
    createResolveIndexResult,
    ResolveIndexResult,
} from '../model/model-resolver-result';
import {SeparatedGroup} from './helper-status';

export class ResolverHelper {
    static resolveSeparatedGroup(
        separatedGroup: SeparatedGroup,
        value: number,
    ): ResolveIndexResult {
        const result = createResolveIndexResult();
        const createIndexes = (start: number, len: number) =>
            new Array(len).fill(0).map((_, i) => start + i);
        const groupStartIndex =
            separatedGroup.separatorStart.start + separatedGroup.separatorStart.len;
        const groupEndIndex = separatedGroup.separatorEnd.start - 1;
        const size = groupEndIndex - groupStartIndex + 1;
        const groupIndexes = createIndexes(groupStartIndex, size);
        const selectedIndexes = separatedGroup.groups
            .filter((g) => g.status === CellStatus.included)
            .flatMap((g) => createIndexes(g.start, g.len));
        const unknownIndexes = groupIndexes.filter(
            (i) => !selectedIndexes.includes(i),
        );

        if (value === size) {
            result.included.push(...groupIndexes);
            return result;
        }
        if (value === selectedIndexes.length) {
            result.excluded.push(...unknownIndexes);
            return result;
        }

        // fill holes
        result.included.push(
            ...ArrayHelper.range(
                Math.min(...selectedIndexes),
                Math.max(...selectedIndexes),
            ),
        );

        if (selectedIndexes.includes(groupStartIndex)) {
            for (let index = 0; index < size; index++) {
                if (index < value) {
                    result.included.push(groupStartIndex + index);
                } else {
                    result.excluded.push(groupStartIndex + index);
                }
            }

            return result;
        }

        if (selectedIndexes.includes(groupEndIndex)) {
            for (let index = 0; index < size; index++) {
                if (index < value) {
                    result.included.push(groupEndIndex - index);
                } else {
                    result.excluded.push(groupEndIndex - index);
                }
            }
            return result;
        }

        const startSelected = groupEndIndex - value + 1;
        const endSelected = groupStartIndex + value;

        for (let index = startSelected; index < endSelected; index++) {
            result.included.push(index);
        }

        return result;
    }
}
