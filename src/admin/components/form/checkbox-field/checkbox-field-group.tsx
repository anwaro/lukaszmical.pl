import {Children, cloneElement, ReactElement, ReactNode} from 'react';

type Props = {
    isColumn?: boolean;
    children: ReactNode;
};

export const CheckboxFieldGroup = (props: Props) => {
    return (
        <div
            className={`-mb-3 flex flex-wrap justify-start ${props.isColumn ? 'flex-col' : ''}`}
        >
            {/* toArray drops the empty nodes left by conditional children. */}
            {/* @ts-ignore */}
            {Children.toArray(props.children).map((child: ReactElement) =>
                cloneElement(child, {
                    /* @ts-ignore */
                    className: `mr-6 mb-3 last:mr-0 ${child.props.className}`,
                }),
            )}
        </div>
    );
};
