import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';

import {SESSION_COOKIE, verifySessionToken} from './session';

export async function auth() {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;

    if (!(await verifySessionToken(token))) {
        redirect('/admin/auth/login');
    }
}

// Non-redirecting check, for gating UI on the public site (draft entries,
// the "edit" button) rather than protecting an admin route.
export async function isLoggedIn(): Promise<boolean> {
    const store = await cookies();
    return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
