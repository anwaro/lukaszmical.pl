import {TaskModel} from '../model/model-task';
import {EventModel, EventType} from '../model/model-event';
import {StoreModel} from '../model/model-store';
import {NumberDetector} from '../detector/detector-number';

export class TerminateWorkersTask extends TaskModel {
    public eventName = EventType.finishJob;

    async run(
        canvas: HTMLCanvasElement,
        store: StoreModel,
        emitEvent: (event: EventModel) => void,
    ) {
        const detector = new NumberDetector();

        await detector.terminate();
    }
}
