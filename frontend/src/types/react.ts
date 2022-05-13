import React, {PropsWithChildren} from 'react';

export type ReactFC<R = {}> = React.FC<PropsWithChildren<R>>;
