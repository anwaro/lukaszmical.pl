import React from 'react';

import {Card} from '@/admin/components/card/card';
import {Button} from '@/admin/components/button/button';

import {login} from './actions';

type Props = {
    searchParams: Promise<{error?: string}>;
};

export default async function LoginPage({searchParams}: Props) {
    const {error} = await searchParams;

    return (
        <>
            <div className="mb-6 flex items-center gap-2.5">
                <span className="kv-monogram" aria-hidden>
                    Ł
                </span>
                <span className="text-sm font-semibold">lukaszmical.pl</span>
            </div>
            <Card padding="lg">
                <h1 className="kv-section-title">Zaloguj się</h1>
                <p className="kv-body mt-1 mb-5">Panel administracyjny serwisu.</p>
                <form className="flex flex-col gap-4">
                    <label className="kv-field">
                        <span className="kv-field-label">Hasło</span>
                        <input
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            className="kv-input"
                            required
                        />
                    </label>

                    {error && (
                        <p className="kv-notice kv-notice-danger">
                            Nieprawidłowe hasło.
                        </p>
                    )}

                    <Button formAction={login} type="submit" className="w-full">
                        Zaloguj się
                    </Button>
                </form>
            </Card>
        </>
    );
}
