import React from 'react';

import s from './styles.module.scss';

const PageTitle: React.FC = ({children}) => {
    return <div className={s.title}>{children}</div>;
};

export default PageTitle;
