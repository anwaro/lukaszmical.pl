export enum EventType {
    imageProcessed = 'imageProcessed',
    imageProcessedToNumberDetect = 'imageProcessedToNumberDetect',
    detectGrid = 'detectGrid',
    detectCells = 'detectCells',
    detectColumnGroupValues = 'detectColumnGroupValues',
    detectRowGroupsValues = 'detectRowGroupsValues',
    resolverJob = 'resolverJob',
    resolverLoop = 'resolverLoop',
    resolverError = 'resolverError',
    resolverDone = 'resolverDone',
    finishJob = 'finishJob',
    rerender = 'rerender',
}

let eventId = new Date().getTime();

export class EventModel {
    public readonly id: string;

    constructor(
        public readonly type: EventType,
        public inProgress: boolean = true,
        public duration: number = 0,
        public error: string = '',
    ) {
        this.id = `event-${++eventId}`;
    }

    finish(duration: number = 0, error = '') {
        this.duration = duration;
        this.error = error;
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
