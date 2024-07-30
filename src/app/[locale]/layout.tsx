import {getMessages} from 'next-intl/server';
import {NextIntlClientProvider} from 'next-intl';
import {clsx} from 'clsx';

type Props = {
    params: {
        locale: string;
    };
};

export default async function RootLayout({children, params}: PWC<Props>) {
    const messages = await getMessages();

    return (
        <NextIntlClientProvider
            messages={messages}
            locale={params.locale}
            timeZone={'Europe/Warsaw'}
        >
            <div className={clsx('flex min-h-screen flex-1 flex-col bg-black')}>
                {children}
            </div>
        </NextIntlClientProvider>
    );
}
