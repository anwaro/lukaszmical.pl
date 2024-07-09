import {NextIntlClientProvider} from 'next-intl';

type Messages = {
    [id: string]: Messages | string;
};
type Props = {
    messages: Messages;
    locale: string;
    timeZone: string;
};

export default function Providers({
    children,
    locale,
    messages,
    timeZone,
}: PWC<Props>) {
    return (
        <NextIntlClientProvider
            messages={messages}
            locale={locale}
            timeZone={timeZone}
        >
            <body>{children}</body>
        </NextIntlClientProvider>
    );
}
