'use server';

import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';

import {
    createSessionToken,
    SESSION_COOKIE,
    sessionCookieOptions,
} from '@/utils/auth/session';
import {verifyPassword} from '@/utils/auth/password';

export async function login(formData: FormData) {
    const password = formData.get('password') as string;

    if (!(await verifyPassword(password))) {
        redirect('/admin/auth/login?error=1');
    }

    const token = await createSessionToken();
    const store = await cookies();
    store.set(SESSION_COOKIE, token, sessionCookieOptions);

    redirect('/admin');
}
