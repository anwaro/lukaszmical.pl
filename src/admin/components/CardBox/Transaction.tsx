import React from 'react';

import {mdiCashMinus, mdiCashPlus, mdiCreditCard, mdiReceipt} from '@mdi/js';

import {IconRounded} from '@/admin/components/icon/icon-rounded';

import {Transaction} from '../../interfaces';
import PillTag from '../PillTag';

import CardBox from '.';

type Props = {
    transaction: Transaction;
};

const CardBoxTransaction = (props: Props) => {
    const icon = {
        withdraw: mdiCashMinus,
        deposit: mdiCashPlus,
        invoice: mdiReceipt,
        payment: mdiCreditCard,
    }[props.transaction.type];

    const typeColor = () => {
        switch (props.transaction.type) {
            case 'withdraw':
                return 'danger';
            case 'deposit':
                return 'success';
            case 'invoice':
                return 'warning';
            case 'payment':
                return 'info';
        }
    };

    return (
        <CardBox className="mb-6 last:mb-0">
            <div className="flex flex-col items-center justify-between md:flex-row">
                <div className="mb-6 flex flex-col items-center justify-start md:mb-0 md:flex-row">
                    <IconRounded
                        icon={icon}
                        color={typeColor()}
                        className="mb-6 md:mb-0 md:mr-6"
                    />
                    <div className="space-y-1 text-center md:mr-6 md:text-left">
                        <h4 className="text-xl">${props.transaction.amount}</h4>
                        <p className="text-slate-400">
                            <b>{props.transaction.date}</b> via{' '}
                            {props.transaction.business}
                        </p>
                    </div>
                </div>
                <div className="space-y-2 text-center md:text-right">
                    <p className="text-sm text-gray-500">{props.transaction.name}</p>
                    <div>
                        <PillTag
                            color={typeColor()}
                            label={props.transaction.type}
                            small
                        />
                    </div>
                </div>
            </div>
        </CardBox>
    );
};

export default CardBoxTransaction;
