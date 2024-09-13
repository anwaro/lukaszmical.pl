import {StoreModel} from '../model/model-store';
import {EventModel, EventType} from '../model/model-event';

export abstract class TaskModel {
    abstract eventName: EventType;
    public event = new EventModel(EventType.resolverDone);
    private startTime = 0;

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
