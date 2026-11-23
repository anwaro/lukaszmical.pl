import React from 'react';

import {renderToString} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import {encodeEmail} from '@/utils/email-obfuscate';

import {ObfuscatedEmail} from './obfuscated-email';

describe('ObfuscatedEmail', () => {
    it('does not put the address in server-rendered HTML', () => {
        const html = renderToString(
            <ObfuscatedEmail encoded={encodeEmail('john@example.com')} />,
        );

        expect(html).not.toContain('@');
        expect(html).not.toContain('example');
        expect(html).not.toContain('mailto');
    });
});
