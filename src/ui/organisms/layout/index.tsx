import {clsx} from 'clsx';
import Head from 'next/head';

type Props = {
    locale: string;
    className?: string;
};

export default function Layout({children, locale, className}: PWC<Props>) {
    return (
        <html lang={locale}>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
            </Head>
            <body
                className={clsx(
                    'flex flex-col flex-1 bg-black min-h-[100vh]',
                    className,
                )}
            >
                {children}
            </body>
        </html>
    );
}
