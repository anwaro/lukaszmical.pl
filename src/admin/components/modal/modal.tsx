'use client';

import React, {ReactNode, useEffect} from 'react';

import {clsx} from 'clsx';
import {X} from 'lucide-react';

import {IconButton} from '@/admin/components/button/icon-button';

type Props = {
    open: boolean;
    onClose: () => void;
    title: string;
    size?: 'md' | 'lg';
    children: ReactNode;
};

// A fixed overlay, no portal — the repo's other overlay (the mobile sidebar
// drawer) works the same way.
export function Modal({open, onClose, title, size = 'md', children}: Props) {
    useEffect(() => {
        if (!open) {
            return;
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return (
        <>
            <div
                className="fixed inset-0 z-45 bg-slate-900/50 backdrop-blur-xs"
                onClick={onClose}
            />
            <dialog
                open
                className="fixed inset-0 z-50 m-0 flex max-h-none max-w-none items-center justify-center border-none bg-transparent p-4 text-inherit size-auto"
                aria-label={title}
            >
                <div
                    className={clsx(
                        'flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden',
                        'rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
                        size === 'lg' ? 'max-w-210' : 'max-w-130',
                    )}
                >
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                        <h2 className="text-base/6 font-semibold text-slate-900 dark:text-white">
                            {title}
                        </h2>
                        <IconButton icon={X} label="Zamknij" onClick={onClose} />
                    </div>
                    <div className="overflow-y-auto p-5">{children}</div>
                </div>
            </dialog>
        </>
    );
}
