import {expect, test} from 'vitest';

import {string} from './string';

test('basic string.match', () => {
    expect(string.match('/projects/12', 'projects/:id')).toEqual({id: '12'});
});
test('part string.match', () => {
    expect(string.match('/projects/12', 'projects/:id')).toEqual({id: '12'});
});
test('double param string.match', () => {
    expect(string.match('/projects/12/delete', 'projects/:id/:action')).toEqual({
        id: '12',
        action: 'delete',
    });
});

test('part path string.match', () => {
    expect(
        string.match('api/v1/projects/12/delete', 'projects/:id/:action'),
    ).toEqual({
        id: '12',
        action: 'delete',
    });
});
