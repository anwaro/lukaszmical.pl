import React from 'react';

import {mdiTrendingDown, mdiTrendingNeutral, mdiTrendingUp} from '@mdi/js';

import {Client} from '../../interfaces';
import PillTag from '../PillTag';
import {UserAvatar} from '../user-avatar/user-avatar';

import CardBox from '.';

type Props = {
    client: Client;
};

const CardBoxClient = (props: Props) => {
    const pillColor = () => {
        if (props.client.progress >= 60) {
            return 'success';
        }
        if (props.client.progress >= 40) {
            return 'warning';
        }

        return 'danger';
    };

    const pillIcon = {
        success: mdiTrendingUp,
        warning: mdiTrendingNeutral,
        danger: mdiTrendingDown,
    }[pillColor()];

    return (
        <CardBox className="mb-6 last:mb-0">
            <div className="flex flex-col items-center justify-between md:flex-row">
                <div className="mb-6 flex flex-col items-center justify-start md:mb-0 md:flex-row">
                    <UserAvatar
                        className="mb-6 size-12 md:mb-0 md:mr-6"
                        username={props.client.name}
                    />
                    <div className="overflow-hidden text-center md:text-left">
                        <h4 className="text-ellipsis text-xl">
                            {props.client.name}
                        </h4>
                        <p className="text-slate-400">
                            {props.client.created} @ {props.client.login}
                        </p>
                    </div>
                </div>

                <PillTag
                    color={pillColor()}
                    icon={pillIcon}
                    label={`${props.client.progress}%`}
                />
            </div>
        </CardBox>
    );
};

export default CardBoxClient;
