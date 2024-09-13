export class GroupHelper {
    static sum(values: number[]) {
        return values.reduce((acc, val) => acc + val, 0);
    }

    static valuesSize(values: number[]) {
        return GroupHelper.sum(values) + values.length - 1;
    }
}
