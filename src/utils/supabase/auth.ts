import {redirect} from 'next/navigation';

import {createClient} from './server';

export async function auth() {
    const supabase = createClient();

    const {data, error} = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect('/admin/auth/login');
    }

    return data.user;
}
