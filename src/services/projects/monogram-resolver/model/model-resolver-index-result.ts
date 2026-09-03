export class ResolverIndexResult {
    constructor(
        public included: number[] = [],
        public excluded: number[] = [],
    ) {}

    static create() {
        return new ResolverIndexResult();
    }

    addIndexesResults(result: ResolverIndexResult) {
        this.included.push(...result.included);
        this.excluded.push(...result.excluded);
    }
}
