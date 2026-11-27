'use server';

import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {z} from 'zod';

import {
    createSessionToken,
    SESSION_COOKIE,
    sessionCookieOptions,
} from '@/utils/auth/session';
import {verifyPassword} from '@/utils/auth/password';

const loginSchema = z.object({
    password: z.string().min(1),
});

export async function login(formData: FormData) {
    const parsed = loginSchema.safeParse(Object.fromEntries(formData));

    if (!parsed.success || !(await verifyPassword(parsed.data.password))) {
        redirect('/admin/auth/login?error=1');
    }

    const token = await createSessionToken();
    const store = await cookies();
    store.set(SESSION_COOKIE, token, sessionCookieOptions);

    redirect('/admin');
}
