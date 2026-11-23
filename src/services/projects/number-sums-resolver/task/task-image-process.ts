import {FileToImageData} from '@/services/projects/number-sums-resolver/image/file-to-image-data';

import {TaskModel} from '../model/model-task';
import {EventType} from '../model/model-event';
import {StoreModel} from '../model/model-store';

export class ImageProcessTask extends TaskModel {
    public eventName = EventType.imageProcessed;

    async run(canvas: HTMLCanvasElement, store: StoreModel) {
        const image = await new FileToImageData().getImageData(store.data.file);
        store.setItem('image', image);
    }
}
