import React, {ReactNode} from 'react';

type Props = {
    zIndex?: string;
    type?: string;
    children?: ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
};

export default function OverlayLayer({
    zIndex = 'z-50',
    type = 'flex',
    children,
    className,
    ...props
}: Props) {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();

        if (props.onClick) {
            props.onClick(e);
        }
    };

    return (
        <div
            className={`${type} ${zIndex} ${className} fixed inset-0 flex-col items-center justify-center overflow-hidden`}
        >
            <div
                className={`overlay absolute inset-0 bg-gradient-to-tr from-gray-700 via-gray-900 to-gray-700 opacity-90`}
                onClick={handleClick}
            />

            {children}
        </div>
    );
}
