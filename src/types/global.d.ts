import React, {PropsWithChildren} from 'react';

declare global {
    type FCC<T = {}> = React.FC<PropsWithChildren<T>>;
    type PWC<T = {}> = PropsWithChildren<T>;
}
