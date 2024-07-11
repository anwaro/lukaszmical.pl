import {ReactNode} from 'react';

export type MenuAsideItem = {
    label: string;
    icon?: string;
    href?: string;
    target?: string;
    color?: ColorButtonKey;
    menu?: MenuAsideItem[];
};

export type MenuNavBarItem = {
    label?: string;
    icon?: string | ReactNode;
    href?: string;
    isDivider?: boolean;
    isDesktopNoLabel?: boolean;
    onClick?: () => void;
    menu?: MenuNavBarItem[];
};

export type ColorKey =
    | 'white'
    | 'light'
    | 'contrast'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info';

export type ColorButtonKey =
    | 'white'
    | 'whiteDark'
    | 'lightDark'
    | 'contrast'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'void';

export type BgKey = 'purplePink' | 'pinkRed';

export type TrendType = 'up' | 'down' | 'success' | 'danger' | 'warning' | 'info';

export type TransactionType = 'withdraw' | 'deposit' | 'invoice' | 'payment';

export type Transaction = {
    id: number;
    amount: number;
    account: string;
    name: string;
    date: string;
    type: TransactionType;
    business: string;
};

export type Client = {
    id: number;
    avatar: string;
    login: string;
    name: string;
    company: string;
    city: string;
    progress: number;
    created: string;
    created_mm_dd_yyyy: string;
};

export type UserForm = {
    name: string;
    email: string;
};
