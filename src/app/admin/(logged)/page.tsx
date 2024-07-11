import {auth} from '@/utils/supabase/auth';

export default async function PrivatePage() {
    const user = await auth();

    return (
        <>
            <a href={'/admin/auth/logout'}>Logout</a>

            <p>Hello {user.email}</p>
        </>
    );
}
