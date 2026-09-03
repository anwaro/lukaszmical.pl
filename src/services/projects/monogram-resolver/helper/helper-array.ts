export class ArrayHelper {
    static range(from: number, to: number) {
        if (to < from) {
            return [];
        }
        return new Array(to - from + 1).fill(0).map((_, i) => from + i);
    }

    static create<T>(count: number, fill: T): T[];
    static create(count: number): number[];
    static create(count: number, fill?: any) {
        if (count <= 0) {
            return [];
        }
        return new Array(count)
            .fill(0)
            .map((_, i) => (fill !== undefined ? fill : i));
    }

    static unique(values: number[]) {
        return Array.from(new Set(values));
    }

    static sort(values: number[]) {
        return values.toSorted((a, b) => b - a);
    }

    static sum(values: number[]) {
        return values.reduce((a, b) => b + a, 0);
    }
}
