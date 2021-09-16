import React from 'react';

import s from './styles.module.scss';

const Row: React.FC = ({children}) => {
    return <div className={s.row}>{children}</div>;
};

export default Row;
