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
