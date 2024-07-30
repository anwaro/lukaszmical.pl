import {redirect} from 'next/navigation';

import {createClient} from '@/utils/supabase/server';

export async function GET() {
    const supabase = createClient();
    await supabase.auth.signOut();

    redirect('/admin/auth/login');
}
