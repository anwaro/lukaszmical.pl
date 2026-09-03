import {CellStatus} from '../model/model-cell';

export type StatusGroup = {
    index: number;
    start: number;
    len: number;
    status: CellStatus;
};
