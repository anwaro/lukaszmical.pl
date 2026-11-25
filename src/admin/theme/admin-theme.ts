// The theme chosen in the admin header; without a choice the system decides.
export type AdminTheme = 'light' | 'dark';

export const ADMIN_THEME_COOKIE = 'admin-theme';

export function parseAdminTheme(value: string | undefined): AdminTheme | undefined {
    return value === 'light' || value === 'dark' ? value : undefined;
}
