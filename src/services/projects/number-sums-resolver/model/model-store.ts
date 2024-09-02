import {EventModel} from '@/services/projects/number-sums-resolver/model/model-event';

import {CellModel} from './model-cell';
import {GroupModel} from './model-group';

export type Bounds = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type CellInfo = {
    size: number;
    count: number;
};

export const initialBounds = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
};

type Listener = () => void;

export type StoreData = {
    file: File;
    image: ImageData;
    imageProcessed: ImageData;
    gridBounds: Bounds;
    rowSumsBounds: Bounds;
    columnSumsBounds: Bounds;
    cellInfo: CellInfo;
    borderWidth: number;
    cells: CellModel[];
    groups: GroupModel[];
    events: EventModel[];
};

const initialState = (): StoreData => ({
    file: new File([], ''),
    image: new ImageData(1, 1),
    imageProcessed: new ImageData(1, 1),
    gridBounds: initialBounds,
    rowSumsBounds: initialBounds,
    columnSumsBounds: initialBounds,
    cellInfo: {size: 0, count: 0},
    borderWidth: 1,
    cells: [],
    groups: [],
    events: [],
});

export class StoreModel {
    private listeners: Listener[] = [];
    public data: StoreData = initialState();

    setItem<Key extends keyof StoreData>(key: Key, value: StoreData[Key]) {
        this.data[key] = value;
        this.emitChange();
    }

    reset = () => {
        this.data = initialState();
        this.emitChange();
    };

    subscribe = (listener: Listener) => {
        this.listeners = [...this.listeners, listener];

        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    };

    getSnapshot = () => {
        return this.data;
    };

    emitChange() {
        for (let listener of this.listeners) {
            listener();
        }
    }
}
