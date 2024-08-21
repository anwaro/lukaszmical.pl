import React from 'react';

import {mdiLoading} from '@mdi/js';

import {Icon} from '../../icon/icon';

export const MdxFieldLoader = () => {
    return (
        <div className={`flex items-center justify-center`} style={{minHeight: 500}}>
            <Icon path={mdiLoading} size={40} className={'animate-spin'} />
        </div>
    );
};
