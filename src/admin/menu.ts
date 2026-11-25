import {
    Blocks,
    BookOpen,
    Code,
    Files,
    House,
    Languages,
    LayoutDashboard,
    LucideIcon,
} from 'lucide-react';

export type MenuItem = {
    href: string;
    icon: LucideIcon;
    label: string;
};

export const adminMenu: MenuItem[] = [
    {href: '/admin', icon: LayoutDashboard, label: 'Panel'},
    {href: '/admin/homepage', icon: House, label: 'Strona główna'},
    {href: '/admin/pages', icon: Files, label: 'Strony'},
    {href: '/admin/case-studies', icon: BookOpen, label: 'Case studies'},
    {href: '/admin/projects', icon: Code, label: 'Projekty'},
    {href: '/admin/translations', icon: Languages, label: 'Tłumaczenia'},
    {href: '/admin/blocks', icon: Blocks, label: 'Bloczki'},
];
