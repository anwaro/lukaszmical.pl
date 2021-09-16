import React from 'react';

import s from './styles.module.scss';

const Half: React.FC = ({children}) => {
    return <div className={s.half}>{children}</div>;
};

export default Half;
