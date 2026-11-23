import {TaskModel} from '../model/model-task';
import {EventType} from '../model/model-event';
import {NumberDetector} from '../detector/detector-number';

export class TerminateWorkersTask extends TaskModel {
    public eventName = EventType.finishJob;

    async run() {
        const detector = new NumberDetector();

        await detector.terminate();
    }
}
