import {describe, expect, it} from 'vitest';

import {messageRows, planMessageSync} from './message-sync';

describe('message-sync', () => {
    it('turns a message tree into rows keyed by namespace and dotted key', () => {
        expect(messageRows('pl', {common: {nav: {about: 'o mnie'}, brand: 'x'}})).toEqual([
            {namespace: 'common', key: 'nav.about', locale: 'pl', value: 'o mnie'},
            {namespace: 'common', key: 'brand', locale: 'pl', value: 'x'},
        ]);
    });

    it('adds missing keys, removes obsolete ones and keeps stored values', () => {
        const required = [
            {namespace: 'common', key: 'brand', locale: 'pl' as const, value: 'file'},
            {namespace: 'common', key: 'new', locale: 'pl' as const, value: 'added'},
        ];
        const stored = [
            {namespace: 'common', key: 'brand', locale: 'pl' as const, value: 'edited'},
            {namespace: 'common', key: 'old', locale: 'pl' as const, value: 'gone'},
        ];

        expect(planMessageSync(required, stored)).toEqual({
            missing: [{namespace: 'common', key: 'new', locale: 'pl', value: 'added'}],
            obsolete: [{namespace: 'common', key: 'old', locale: 'pl'}],
        });
    });

    it('treats the same key in another language as a separate message', () => {
        const required = [
            {namespace: 'common', key: 'brand', locale: 'pl' as const, value: 'a'},
            {namespace: 'common', key: 'brand', locale: 'en' as const, value: 'b'},
        ];
        const stored = [{namespace: 'common', key: 'brand', locale: 'pl' as const}];

        expect(planMessageSync(required, stored).missing).toEqual([required[1]]);
    });
});
