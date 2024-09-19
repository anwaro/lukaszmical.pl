export class ArrayHelper {
    static range(from: number, to: number) {
        if (to < from) {
            return [];
        }
        return new Array(to - from + 1).fill(0).map((_, i) => from + i);
    }

    static create(count: number) {
        if (count <= 0) {
            return [];
        }
        return new Array(count).fill(0).map((_, i) => i);
    }

    static unique(values: number[]) {
        return Array.from(new Set(values));
    }

    static sort(values: number[]) {
        return values.sort((a, b) => b - a);
    }
}
