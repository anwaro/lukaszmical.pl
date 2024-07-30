'use client';

import {useEffect, useState} from 'react';

import {createCookieStore} from '@/utils/cookie';

function createDarkModeService() {
    const store = createCookieStore<boolean>('dark-mode');
    const isEnabled = () => {
        const darkModeEnabled = store.get();
        if (darkModeEnabled !== undefined) {
            return darkModeEnabled;
        }

        if (typeof window !== 'undefined') {
            return (
                window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches
            );
        }

        return false;
    };

    const setDarkMode = (isEnabled: boolean) => {
        updateDarkMode(isEnabled);
        document.dispatchEvent(new CustomEvent('dark-mode', {detail: {isEnabled}}));

        store.set(isEnabled);
    };

    const updateDarkMode = (isEnabled: boolean) => {
        document.body.classList[isEnabled ? 'add' : 'remove']('dark-scrollbars');
        document.documentElement.classList[isEnabled ? 'add' : 'remove'](
            'dark',
            'dark-scrollbars-compat',
        );
    };

    const init = () => {
        if (!document.body.classList.contains('dark-init')) {
            document.body.classList.add('dark-init');
            updateDarkMode(isEnabled());
        }
    };

    return {
        setDarkMode,
        isEnabled,
        init,
    };
}

const darkModeService = createDarkModeService();

export function useDarkMode() {
    const [isEnabled, setIsEnabled] = useState(darkModeService.isEnabled());

    useEffect(() => {
        darkModeService.init();
    }, []);

    useEffect(() => {
        const updateDarkMode = (e: CustomEvent<{isEnabled: boolean}>) => {
            setIsEnabled(e.detail.isEnabled);
        };
        document.addEventListener('dark-mode', updateDarkMode);

        return () => {
            document.removeEventListener('dark-mode', updateDarkMode);
        };
    }, []);

    return {
        darkModeEnabled: isEnabled,
        setDarkModeEnabled: darkModeService.setDarkMode,
        toggleDarkMode: () => {
            darkModeService.setDarkMode(!isEnabled);
        },
    };
}
