import classNames from 'classnames';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useMemo} from 'react';

import s from './styles.module.scss';

type Props = {
    fixed?: boolean;
};

const LocaleSwitcher: React.FC<Props> = ({fixed}) => {
    const {locale, locales, route} = useRouter();
    const enableLocales = useMemo(
        () => (locales || []).filter((l) => l !== locale),
        [locales, locale],
    );
    return (
        <div className={classNames(s.row, fixed && s.fixed)}>
            {enableLocales.map((l) => (
                <Link key={l} href={route} locale={l}>
                    <a className={s.link}>{l.toLocaleUpperCase()}</a>
                </Link>
            ))}
        </div>
    );
};

export default LocaleSwitcher;
