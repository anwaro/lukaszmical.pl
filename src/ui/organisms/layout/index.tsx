import {clsx} from 'clsx';

type Props = {
    locale: string;
    className?: string;
};

export default function Layout({children, locale, className}: PWC<Props>) {
    return (
        <html lang={locale}>
            <head>
                <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
            </head>
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
