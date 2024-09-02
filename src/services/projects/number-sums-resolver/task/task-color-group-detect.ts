import {ColorGroupDetector} from '../detector/detector-color-group';
import {TaskModel} from '../model/model-task';
import {EventModel, EventType} from '../model/model-event';
import {StoreModel} from '../model/model-store';

export class ColorGroupDetectTask extends TaskModel {
    public eventName = EventType.detectColorGroupsSums;

    async run(
        canvas: HTMLCanvasElement,
        store: StoreModel,
        emitEvent: (event: EventModel) => void,
    ) {
        const detector = new ColorGroupDetector(canvas, store.data.cells);
        await detector.run();
        store.setItem('groups', [...store.data.groups, ...detector.groups]);
    }
}
