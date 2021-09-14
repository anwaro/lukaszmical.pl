import React from 'react';

import s from './styles.module.scss';

export type PersonBackgroundProps = {};

const PersonBackground: React.FC<PersonBackgroundProps> = () => {
    return <div className={s.bg} />;
};

export default PersonBackground;
