'use client';

import React, {ReactNode, useEffect} from 'react';

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
            <div className="kv-modal-backdrop" onClick={onClose} />
            <dialog open className="kv-modal-wrap" aria-label={title}>
                <div className={`kv-modal ${size === 'lg' ? 'kv-modal-lg' : ''}`}>
                    <div className="kv-modal-header">
                        <h2 className="kv-card-title">{title}</h2>
                        <IconButton icon={X} label="Zamknij" onClick={onClose} />
                    </div>
                    <div className="kv-modal-body">{children}</div>
                </div>
            </dialog>
        </>
    );
}
