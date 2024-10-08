import {Transaction} from '@/admin/interfaces';

export const useHistory = (): {data: Transaction[]} => ({
    data: [
        {
            id: 45721474,
            amount: 375.53,
            account: '45721474',
            name: 'Home Loan Account',
            date: '3 days ago',
            type: 'deposit',
            business: 'Turcotte',
        },
        {
            id: 94486537,
            amount: 470.26,
            account: '94486537',
            name: 'Savings Account',
            date: '3 days ago',
            type: 'payment',
            business: 'Murazik - Graham',
        },
        {
            id: 63189893,
            amount: 971.34,
            account: '63189893',
            name: 'Checking Account',
            date: '5 days ago',
            type: 'invoice',
            business: 'Fahey - Keebler',
        },
        {
            id: 74828780,
            amount: 374.63,
            account: '74828780',
            name: 'Auto Loan Account',
            date: '7 days ago',
            type: 'withdraw',
            business: 'Collier - Hintz',
        },
    ],
});
