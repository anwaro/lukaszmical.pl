'use client';

import React from 'react';

import {Moon, Sun} from 'lucide-react';

import {IconButton} from '@/admin/components/button/icon-button';

import {useAdminTheme} from './theme-provider';

export function ThemeToggle() {
    const {theme, toggle} = useAdminTheme();

    return (
        <IconButton
            icon={theme === 'dark' ? Sun : Moon}
            label={theme === 'dark' ? 'Jasny motyw' : 'Ciemny motyw'}
            onClick={toggle}
        />
    );
}
