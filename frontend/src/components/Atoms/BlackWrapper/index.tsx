import React from 'react';

import s from './styles.module.scss';

const BlackWrapper: React.FC = ({children}) => (
    <div className={s.container}>{children}</div>
);

export default BlackWrapper;
