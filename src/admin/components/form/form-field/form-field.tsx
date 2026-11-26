import {Children, cloneElement, ReactElement} from 'react';

import {LucideIcon} from 'lucide-react';

import {
    formFieldChildClassName,
    formFieldColumnsClassName,
} from './form-field-model';

type Props = PWC<{
    label?: string;
    // Shown at the right edge of every control: the language of the value.
    locale?: string;
    labelFor?: string;
    help?: string;
    // An icon per control, at its left edge.
    icons?: (LucideIcon | undefined)[];
    hasTextareaHeight?: boolean;
}>;

// A label over one or more controls (side by side from sm) and a help line.
export const FormField = ({icons = [], locale, ...props}: Props) => {
    // toArray drops the empty nodes left by conditional children.
    const children = Children.toArray(props.children) as ReactElement<{
        className?: string;
    }>[];

    return (
        <div className="mb-5 block last:mb-0">
            {props.label && (
                <label
                    htmlFor={props.labelFor}
                    className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                    {props.label}
                </label>
            )}
            <div className={formFieldColumnsClassName(children.length)}>
                {children.map((child, index) => {
                    const Icon = icons[index];
                    return (
                        <div key={child.key} className="relative">
                            {cloneElement(child, {
                                className: formFieldChildClassName(
                                    Icon,
                                    locale,
                                    props.hasTextareaHeight,
                                    child.props.className,
                                ),
                            })}
                            {Icon && (
                                <span className="pointer-events-none absolute top-0 left-0 flex h-[38px] w-10 items-center justify-center text-slate-400">
                                    <Icon className="size-4" strokeWidth={1.8} />
                                </span>
                            )}
                            {locale && (
                                <span className="pointer-events-none absolute top-0 right-0 flex h-[38px] w-10 items-center justify-center font-mono text-xs text-slate-400">
                                    {locale.toLocaleUpperCase()}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
            {props.help && (
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {props.help}
                </p>
            )}
        </div>
    );
};
