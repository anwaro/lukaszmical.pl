import {describe, expect, it} from 'vitest';

import {flattenMessages, setMessage} from './content-messages';

describe('content-messages', () => {
    it('flattens nested messages to dotted keys', () => {
        expect(flattenMessages({a: {b: 'x', c: {d: 'y'}}, e: 'z'})).toEqual({
            'a.b': 'x',
            'a.c.d': 'y',
            e: 'z',
        });
    });

    it('sets a value at a dotted path, creating parents', () => {
        const tree = {hero: {title: 'old'}};
        setMessage(tree, 'hero.title', 'new');
        setMessage(tree, 'hero.cta.primary', 'go');
        expect(tree).toEqual({hero: {title: 'new', cta: {primary: 'go'}}});
    });

    it('replaces a leaf that stands where a branch is needed', () => {
        const tree = {hero: 'leaf'};
        setMessage(tree, 'hero.title', 'new');
        expect(tree).toEqual({hero: {title: 'new'}});
    });
});
