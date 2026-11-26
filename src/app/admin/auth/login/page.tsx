import React from 'react';

import {Card} from '@/admin/components/card/card';
import {Button} from '@/admin/components/button/button';
import {fieldInputClassName} from '@/admin/components/form/field-input-class-name';
import {noticeDangerClassName} from '@/admin/components/notice-class-name';

import {login} from './actions';

type Props = {
    searchParams: Promise<{error?: string}>;
};

export default async function LoginPage({searchParams}: Props) {
    const {error} = await searchParams;

    return (
        <>
            <div className="mb-6 flex items-center gap-2.5">
                <span
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white"
                    aria-hidden
                >
                    Ł
                </span>
                <span className="text-sm font-semibold">lukaszmical.pl</span>
            </div>
            <Card padding="lg">
                <h1 className="text-lg/7 font-semibold text-slate-900 dark:text-white">
                    Zaloguj się
                </h1>
                <p className="mt-1 mb-5 text-sm/6 text-slate-600 dark:text-slate-400">
                    Panel administracyjny serwisu.
                </p>
                <form className="flex flex-col gap-4">
                    <label className="block">
                        <span className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
                            Hasło
                        </span>
                        <input
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            className={fieldInputClassName()}
                            required
                        />
                    </label>

                    {error && (
                        <p className={noticeDangerClassName()}>Nieprawidłowe hasło.</p>
                    )}

                    <Button formAction={login} type="submit" className="w-full">
                        Zaloguj się
                    </Button>
                </form>
            </Card>
        </>
    );
}
