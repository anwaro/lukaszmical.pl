import React from 'react';

import {Card} from '@/admin/components/card/card';
import {Button} from '@/admin/components/button/button';

export default function ErrorPage() {
    return (
        <Card padding="lg">
            <h1 className="text-lg/7 font-semibold text-slate-900 dark:text-white">
                Coś poszło nie tak
            </h1>
            <p className="mt-1 mb-5 text-sm/6 text-slate-600 dark:text-slate-400">
                Spróbuj zalogować się ponownie.
            </p>
            <Button href="/admin/auth/login">Przejdź do logowania</Button>
        </Card>
    );
}
