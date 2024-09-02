export class ResolverHelper {
    static findSubsetsThatSumToTarget(
        numbers: number[],
        target: number,
        start: number = 0,
        currentSubset: number[] = [],
        currentSum: number = 0,
        results: number[][] = [],
    ) {
        if (currentSum === target) {
            results.push([...currentSubset]);
            return;
        }

        if (currentSum > target) {
            return;
        }

        for (let i = start; i < numbers.length; i++) {
            currentSubset.push(numbers[i]);
            ResolverHelper.findSubsetsThatSumToTarget(
                numbers,
                target,
                i + 1,
                currentSubset,
                currentSum + numbers[i],
                results,
            );

            currentSubset.pop();
        }
    }

    static findSubsetWithSum(numbers: number[], target: number): number[][] {
        const results: number[][] = [];
        ResolverHelper.findSubsetsThatSumToTarget(
            numbers,
            target,
            0,
            [],
            0,
            results,
        );
        return results;
    }
}
