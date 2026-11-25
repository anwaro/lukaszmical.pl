import React from 'react';

import {Card} from '@/admin/components/card/card';
import {Button} from '@/admin/components/button/button';

export default function ErrorPage() {
    return (
        <Card padding="lg">
            <h1 className="kv-section-title">Coś poszło nie tak</h1>
            <p className="kv-body mt-1 mb-5">Spróbuj zalogować się ponownie.</p>
            <Button href="/admin/auth/login">Przejdź do logowania</Button>
        </Card>
    );
}
