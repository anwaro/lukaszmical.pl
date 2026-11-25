import {ReactNode} from 'react';

import {clsx} from 'clsx';

type Props = {
    isColumn?: boolean;
    children: ReactNode;
};

export const CheckboxFieldGroup = ({isColumn = false, children}: Props) => {
    return (
        <div
            className={clsx(
                'flex gap-x-6 gap-y-3',
                isColumn ? 'flex-col' : 'flex-wrap',
            )}
        >
            {children}
        </div>
    );
};
