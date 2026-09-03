import {StatusGroup} from './model-status-group';

export type SeparatedGroup = {
    index: number;
    separatorStart: StatusGroup;
    groups: StatusGroup[];
    separatorEnd: StatusGroup;
    isResolved: boolean;
    size: number;
    includedSize: number;
};
