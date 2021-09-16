import React from 'react';

import s from './styles.module.scss';

const Container: React.FC = ({children}) => {
    return <div className={s.container}>{children}</div>;
};

export default Container;
