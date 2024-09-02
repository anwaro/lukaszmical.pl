export enum EventType {
    imageProcessed = 'imageProcessed',
    imageProcessedToNumberDetect = 'imageProcessedToNumberDetect',
    detectGrid = 'detectGrid',
    detectCellsSums = 'detectCellsSums',
    detectColumnGroupSums = 'detectColumnGroupSums',
    detectRowGroupsSums = 'detectRowGroupsSums',
    detectColorGroupsSums = 'detectColorGroupsSums',
    solvedCells = 'solvedCells',
    solveError = 'solveError',
    solveDone = 'solveDone',
    resolveLoop = 'resolveLoop',
    finishJob = 'finishJob',
}

let eventId = new Date().getTime();

export class EventModel {
    public readonly id: string;

    constructor(
        public readonly type: EventType,
        public inProgress: boolean = true,
        public duration: number = 0,
    ) {
        this.id = `event-${++eventId}`;
    }

    finish(duration: number = 0) {
        this.duration = duration;
        this.inProgress = false;
    }

    getName() {
        return this.type
            .replace(/[A-Z]/g, (l) => ` ${l}`)
            .replace(/^./, (f) => f.toUpperCase());
    }

    getDuration() {
        return `${this.duration / 1000}s`;
    }
}
