import {Children, cloneElement, ReactElement, ReactNode} from 'react';

type Props = {
    isColumn?: boolean;
    children: ReactNode;
};

export const FormCheckRadioGroup = (props: Props) => {
    return (
        <div
            className={`-mb-3 flex flex-wrap justify-start ${props.isColumn ? 'flex-col' : ''}`}
        >
            {/* @ts-ignore */}
            {Children.map(props.children, (child: ReactElement) =>
                cloneElement(child, {
                    /* @ts-ignore */
                    className: `mr-6 mb-3 last:mr-0 ${child.props.className}`,
                }),
            )}
        </div>
    );
};

export default FormCheckRadioGroup;
