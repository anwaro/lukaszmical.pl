import {ArrayHelper} from '../helper/helper-array';
import {CellModel, CellStatus} from '../model/model-cell';
import {ResolverResult} from '../model/model-resolver-result';
import {ResolverIndexResult} from '../model/model-resolver-index-result';
import {ResolverModel} from '../model/model-resolver';
import {GroupModel} from '../model/model-group';
import {GroupHelper} from '../helper/helper-group';

export class CombinationResolver extends ResolverModel {
    private cache: Record<string, CellStatus[][]> = {};

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
        const variants = this.getAllVariants(values, groupCells.length);
        const allowedVariants = this.filterWithCurrentState(
            variants,
            groupCells.map((c) => c.status),
        );

        groupCells.forEach((c, index) => {
            if (c.status !== CellStatus.unknown) {
                return;
            }
            if (allowedVariants.length === 0) {
                return;
            }

            const firstStatus = allowedVariants[0][index];

            if (allowedVariants.some((variant) => variant[index] !== firstStatus)) {
                return;
            }

            if (firstStatus === CellStatus.included) {
                result.included.push(index);
            } else {
                result.excluded.push(index);
            }
        });

        return result;
    }

    filterWithCurrentState(variants: CellStatus[][], state: CellStatus[]) {
        return variants.filter(
            (variant) =>
                !variant.some((status, index) => {
                    return (
                        state[index] !== CellStatus.unknown &&
                        state[index] !== status
                    );
                }),
        );
    }

    getAllVariants(values: number[], size: number) {
        const cacheValue = this.getCache(values, size);
        if (cacheValue) {
            return cacheValue;
        }
        const variants: CellStatus[][] = [];
        const diff = size - GroupHelper.valuesSize(values);
        const [value, ...restValues] = values;

        for (let offset = 0; offset <= diff; offset++) {
            if (restValues.length !== 0) {
                const restSize = size - offset - value - 1;
                variants.push(
                    ...this.getAllVariants(restValues, restSize).map((variant) => [
                        ...ArrayHelper.create(offset, CellStatus.excluded),
                        ...ArrayHelper.create(value, CellStatus.included),
                        CellStatus.excluded,
                        ...variant,
                    ]),
                );
            } else {
                const offsetAfter = size - offset - value;
                variants.push([
                    ...ArrayHelper.create(offset, CellStatus.excluded),
                    ...ArrayHelper.create(value, CellStatus.included),
                    ...ArrayHelper.create(offsetAfter, CellStatus.excluded),
                ]);
            }
        }

        this.setCache(values, size, variants);

        return variants;
    }

    getKey(values: number[], size: number) {
        return btoa(JSON.stringify({values, size}));
    }

    getCache(values: number[], size: number) {
        const key = this.getKey(values, size);
        if (key in this.cache) {
            return this.cache[key];
        }
        return undefined;
    }

    setCache(values: number[], size: number, variants: CellStatus[][]) {
        const key = this.getKey(values, size);
        this.cache[key] = variants;
    }
}
