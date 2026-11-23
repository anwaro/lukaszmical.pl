'use client';

import React, {useSyncExternalStore} from 'react';

import {decodeEmail} from '@/utils/email-obfuscate';

type Props = {
    // Value produced by encodeEmail() on the server.
    encoded: string;
    className?: string;
};

const subscribe = () => () => {};

// The address is decoded only in the browser, so neither the HTML nor the
// RSC payload contains it in plain text.
export function ObfuscatedEmail({encoded, className}: Props) {
    // false during SSR and hydration, true afterwards in the browser.
    const isClient = useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    );
    const email = isClient ? decodeEmail(encoded) : '';

    if (!email) {
        return (
            <span className={className} aria-hidden="true">
                {'\u00a0'}
            </span>
        );
    }

    return (
        <a href={`mailto:${email}`} className={className}>
            {email}
        </a>
    );
}
