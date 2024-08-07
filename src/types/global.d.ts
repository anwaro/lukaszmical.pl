import React, {PropsWithChildren} from 'react';

declare global {
    type FCC<T = {}> = React.FC<PropsWithChildren<T>>;
    type FC<T = {}> = React.FC<T>;
    type PWC<T = {}> = PropsWithChildren<T>;
}

interface CustomEventMap {
    'dark-mode': CustomEvent<{isEnabled: boolean}>;
}

declare global {
    interface Document {
        //adds definition to Document, but you can do the same with HTMLElement
        addEventListener<K extends keyof CustomEventMap>(
            type: K,
            listener: (this: Document, ev: CustomEventMap[K]) => void,
        ): void;

        dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;

        dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;

        removeEventListener<K extends keyof CustomEventMap>(
            type: K,
            listener: (this: Document, ev: CustomEventMap[K]) => any,
            options?: boolean | EventListenerOptions,
        ): void;
    }
}
