import {buttonClass} from '../../site-parts';

import {Link} from '@/navigation';

// Internal paths go through the localized router, anything else opens in a new tab.
export function Button({
    href,
    variant,
    children,
}: PWC<{href: string; variant?: string}>) {
    const className =
        variant === 'primary' ? buttonClass.primary : buttonClass.secondary;

    if (href.startsWith('/')) {
        return (
            <Link href={href} className={className}>
                {children}
            </Link>
        );
    }
    return (
        <a href={href} target="_blank" rel="noreferrer" className={className}>
            {children}
        </a>
    );
}
