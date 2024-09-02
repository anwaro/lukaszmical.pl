import {StoreModel} from '@/services/projects/number-sums-resolver/model/model-store';
import {
    EventModel,
    EventType,
} from '@/services/projects/number-sums-resolver/model/model-event';

export abstract class TaskModel {
    abstract eventName: EventType;
    private startTime = 0;
    public event = new EventModel(EventType.solveDone);

    start() {
        this.startTime = new Date().getTime();
        this.event = new EventModel(this.eventName);
    }

    duration() {
        return new Date().getTime() - this.startTime;
    }

    abstract run(
        canvas: HTMLCanvasElement,
        store: StoreModel,
        emitEvent: (event: EventModel) => void,
    ): Promise<void>;
}

export type TaskConstructor = new () => TaskModel;
