import {clsx} from 'clsx';
import {LucideIcon} from 'lucide-react';

import {fieldInputClassName} from '@/admin/components/form/field-input-class-name';

const columnsByCount: Record<number, string> = {
    2: 'grid grid-cols-1 gap-3 sm:grid-cols-2',
    3: 'grid grid-cols-1 gap-3 sm:grid-cols-3',
    4: 'grid grid-cols-1 gap-3 sm:grid-cols-4',
};

export function formFieldColumnsClassName(childCount: number) {
    return columnsByCount[childCount];
}

export function formFieldChildClassName(
    icon: LucideIcon | undefined,
    locale: string | undefined,
    hasTextareaHeight: boolean | undefined,
    existingClassName: string | undefined,
) {
    return fieldInputClassName(
        clsx(
            icon && 'pl-10',
            locale && !hasTextareaHeight && 'pr-10',
            existingClassName,
        ),
    );
}
