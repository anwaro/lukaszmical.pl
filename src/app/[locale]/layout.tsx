import {getMessages} from 'next-intl/server';
import {NextIntlClientProvider} from 'next-intl';

type Props = {
    params: Promise<{
        locale: string;
    }>;
};

export default async function RootLayout({children, params}: PWC<Props>) {
    const {locale} = await params;
    const messages = await getMessages();

    return (
        <NextIntlClientProvider
            messages={messages}
            locale={locale}
            timeZone={'Europe/Warsaw'}
        >
            <div className="flex min-h-screen flex-1 flex-col bg-black text-white">
                {children}
            </div>
        </NextIntlClientProvider>
    );
}
