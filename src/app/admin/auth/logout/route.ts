import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';

import {SESSION_COOKIE} from '@/utils/auth/session';

export async function GET() {
    const store = await cookies();
    store.delete(SESSION_COOKIE);

    redirect('/admin/auth/login');
}
