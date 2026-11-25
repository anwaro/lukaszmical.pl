import {Children, cloneElement, ReactElement} from 'react';

import {clsx} from 'clsx';
import {LucideIcon} from 'lucide-react';

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

const columns: Record<number, string> = {
    2: 'grid grid-cols-1 gap-3 sm:grid-cols-2',
    3: 'grid grid-cols-1 gap-3 sm:grid-cols-3',
    4: 'grid grid-cols-1 gap-3 sm:grid-cols-4',
};

// A label over one or more controls (side by side from sm) and a help line.
export const FormField = ({icons = [], locale, ...props}: Props) => {
    // toArray drops the empty nodes left by conditional children.
    const children = Children.toArray(props.children) as ReactElement<{
        className?: string;
    }>[];

    return (
        <div className="kv-field mb-5 last:mb-0">
            {props.label && (
                <label htmlFor={props.labelFor} className="kv-field-label">
                    {props.label}
                </label>
            )}
            <div className={columns[children.length]}>
                {children.map((child, index) => {
                    const Icon = icons[index];
                    return (
                        <div key={child.key} className="relative">
                            {cloneElement(child, {
                                className: clsx(
                                    'kv-input',
                                    Icon && 'pl-10',
                                    locale && !props.hasTextareaHeight && 'pr-10',
                                    child.props.className,
                                ),
                            })}
                            {Icon && (
                                <span className="kv-input-addon left-0">
                                    <Icon className="size-4" strokeWidth={1.8} />
                                </span>
                            )}
                            {locale && (
                                <span className="kv-input-addon kv-kbd right-0">
                                    {locale.toLocaleUpperCase()}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
            {props.help && <p className="kv-field-help">{props.help}</p>}
        </div>
    );
};
