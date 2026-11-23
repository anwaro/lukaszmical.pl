import {Inter, JetBrains_Mono} from 'next/font/google';
import {getMessages} from 'next-intl/server';
import {NextIntlClientProvider} from 'next-intl';
import {clsx} from 'clsx';

type Props = {
    params: Promise<{
        locale: string;
    }>;
};

const inter = Inter({
    weight: ['400', '500', '600'],
    subsets: ['latin', 'latin-ext'],
    variable: '--font-inter',
});

const jetbrains = JetBrains_Mono({
    weight: ['400', '500', '700'],
    subsets: ['latin', 'latin-ext'],
    variable: '--font-jetbrains',
});

export default async function RootLayout({children, params}: PWC<Props>) {
    const {locale} = await params;
    const messages = await getMessages();

    return (
        <NextIntlClientProvider
            messages={messages}
            locale={locale}
            timeZone={'Europe/Warsaw'}
        >
            <div
                className={clsx(
                    inter.variable,
                    jetbrains.variable,
                    'flex min-h-screen flex-1 flex-col bg-ink font-site text-fg',
                )}
            >
                {children}
            </div>
        </NextIntlClientProvider>
    );
}
