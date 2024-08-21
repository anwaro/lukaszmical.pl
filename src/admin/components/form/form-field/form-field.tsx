import {Children, cloneElement, ReactElement} from 'react';

import {clsx} from 'clsx';

import {Icon} from '../../icon/icon';

type Props = PWC<{
    label?: string;
    locale?: string;
    labelFor?: string;
    help?: string;
    icons?: string[] | null[];
    isBorderless?: boolean;
    isTransparent?: boolean;
    hasTextareaHeight?: boolean;
}>;

export const FormField = ({icons = [], locale, ...props}: Props) => {
    const childrenCount = Children.count(props.children);

    let elementWrapperClass = '';

    switch (childrenCount) {
        case 2:
            elementWrapperClass = 'grid grid-cols-1 gap-3 md:grid-cols-2';
            break;
        case 3:
            elementWrapperClass = 'grid grid-cols-1 gap-3 md:grid-cols-3';
            break;
        case 4:
            elementWrapperClass = 'grid grid-cols-1 gap-3 md:grid-cols-4';
    }

    const controlClassName = [
        'px-3 py-2 max-w-full border-gray-700 rounded w-full placeholder-gray-400',
        'focus:ring focus:ring-blue-600 focus:border-blue-600 focus:outline-none',
        props.hasTextareaHeight ? 'h-24' : 'h-12',
        props.isBorderless ? 'border-0' : 'border',
        props.isTransparent ? 'bg-transparent' : 'bg-slate-800',
    ].join(' ');

    return (
        <div className="mb-6 last:mb-0">
            {props.label && (
                <label
                    htmlFor={props.labelFor}
                    className={`mb-2 block font-bold ${props.labelFor ? 'cursor-pointer' : ''}`}
                >
                    {props.label}
                </label>
            )}
            <div className={elementWrapperClass}>
                {/* @ts-ignore */}
                {Children.map(props.children, (child: ReactElement, index) => (
                    <div className="relative">
                        {cloneElement(child, {
                            /* @ts-ignore */
                            className: clsx(
                                controlClassName,
                                icons[index] && 'pl-10',
                                locale && !props.hasTextareaHeight && 'pr-10',
                            ),
                        })}
                        {icons[index] && (
                            <Icon
                                path={icons[index]}
                                w="w-10"
                                h={props.hasTextareaHeight ? 'h-full' : 'h-12'}
                                className="pointer-events-none absolute left-0 top-0 z-10 text-slate-400"
                            />
                        )}
                        {locale && (
                            <div className="pointer-events-none absolute right-0 top-0 z-10 flex h-12 w-10 items-center justify-center text-slate-400">
                                {locale.toLocaleUpperCase()}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {props.help && (
                <div className="mt-1 text-xs text-slate-400">{props.help}</div>
            )}
        </div>
    );
};
