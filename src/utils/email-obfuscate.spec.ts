import {describe, expect, it} from 'vitest';

import {decodeEmail, encodeEmail} from './email-obfuscate';

describe('email-obfuscate', () => {
    const email = 'john.doe+tag@example.com';

    it('round-trips an address', () => {
        expect(decodeEmail(encodeEmail(email))).toBe(email);
    });

    it('does not expose the address in the encoded value', () => {
        const encoded = encodeEmail(email);

        expect(encoded).not.toContain('@');
        expect(encoded).not.toContain('example');
        // Plain base64 decode alone must not reveal it either.
        expect(atob(encoded)).not.toContain('@');
        expect(atob(encoded)).not.toContain('example');
    });

    it('returns an empty string for invalid input', () => {
        expect(decodeEmail('%%%')).toBe('');
    });
});
