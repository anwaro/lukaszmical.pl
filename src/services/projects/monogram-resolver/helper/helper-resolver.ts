import {ArrayHelper} from '../helper/helper-array';
import {CellStatus} from '../model/model-cell';
import {SeparatedGroup} from '../model/model-separated-group';
import {ResolverIndexResult} from '../model/model-resolver-index-result';

export class ResolverHelper {
    static resolveSeparatedGroup(
        separatedGroup: SeparatedGroup,
        value: number,
        canIncludeMoreValues = false,
    ): ResolverIndexResult {
        const result = ResolverIndexResult.create();
        const groupStartIndex =
            separatedGroup.separatorStart.start + separatedGroup.separatorStart.len;
        const groupEndIndex = separatedGroup.separatorEnd.start - 1;
        const groupIndexes = ArrayHelper.range(groupStartIndex, groupEndIndex);
        const selectedIndexes = separatedGroup.groups
            .filter((g) => g.status === CellStatus.included)
            .flatMap((g) => ArrayHelper.range(g.start, g.start + g.len - 1));
        const unknownIndexes = groupIndexes.filter(
            (i) => !selectedIndexes.includes(i),
        );

        if (value === separatedGroup.size) {
            result.included.push(...groupIndexes);
            return result;
        }
        if (value === selectedIndexes.length && !canIncludeMoreValues) {
            result.excluded.push(...unknownIndexes);
            return result;
        }

        if (value === selectedIndexes.length && !canIncludeMoreValues) {
            // fill holes
            result.included.push(
                ...ArrayHelper.range(
                    Math.min(...selectedIndexes),
                    Math.max(...selectedIndexes),
                ),
            );
        }

        if (!canIncludeMoreValues && selectedIndexes.includes(groupStartIndex)) {
            for (let index = 0; index < separatedGroup.size; index++) {
                if (index < value) {
                    result.included.push(groupStartIndex + index);
                } else {
                    result.excluded.push(groupStartIndex + index);
                }
            }

            return result;
        }

        if (!canIncludeMoreValues && selectedIndexes.includes(groupEndIndex)) {
            for (let index = 0; index < separatedGroup.size; index++) {
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
