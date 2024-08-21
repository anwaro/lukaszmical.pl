import type {ColorButtonKey} from './interfaces';

export const gradientBgBase = 'bg-gradient-to-tr';
export const gradientBgPurplePink = `${gradientBgBase} from-purple-400 via-pink-500 to-red-500`;
export const gradientBgDark = `${gradientBgBase} from-slate-700 via-slate-900 to-slate-800`;
export const gradientBgPinkRed = `${gradientBgBase} from-pink-400 via-red-500 to-yellow-500`;

export const colorsBgLight = {
    white: 'bg-white text-black',
    light: 'bg-slate-900/70 text-white',
    contrast: 'bg-white text-black',
    success: 'bg-emerald-500 border-emerald-500 text-white',
    danger: 'bg-red-500 border-red-500 text-white',
    warning: 'bg-yellow-500 border-yellow-500 text-white',
    info: 'bg-blue-500 border-blue-500 text-white',
};

export const colorsText = {
    white: 'text-slate-100',
    light: 'text-slate-400',
    contrast: 'text-white',
    success: 'text-emerald-500',
    danger: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
};

export const colorsOutline = {
    white: [colorsText.white, 'border-gray-100'].join(' '),
    light: [colorsText.light, 'border-gray-100'].join(' '),
    contrast: [colorsText.contrast, 'border-slate-100'].join(' '),
    success: [colorsText.success, 'border-emerald-500'].join(' '),
    danger: [colorsText.danger, 'border-red-500'].join(' '),
    warning: [colorsText.warning, 'border-yellow-500'].join(' '),
    info: [colorsText.info, 'border-blue-500'].join(' '),
};

export const getButtonColor = (
    color: ColorButtonKey,
    isOutlined: boolean,
    hasHover: boolean,
    isActive = false,
) => {
    if (color === 'void') {
        return '';
    }

    const colors = {
        ring: {
            white: 'ring-gray-500',
            whiteDark: 'ring-gray-500',
            lightDark: 'ring-gray-500',
            contrast: 'ring-gray-400',
            success: 'ring-emerald-700',
            danger: 'ring-red-700',
            warning: 'ring-yellow-700',
            info: 'ring-blue-700',
        },
        active: {
            white: 'bg-gray-100',
            whiteDark: 'bg-slate-800',
            lightDark: 'bg-slate-700',
            contrast: 'bg-slate-100',
            success: 'bg-emerald-600',
            danger: 'bg-red-600',
            warning: 'bg-yellow-600',
            info: 'bg-blue-600',
        },
        bg: {
            white: 'bg-white text-black',
            whiteDark: 'bg-slate-900 text-white',
            lightDark: 'bg-slate-800 text-white',
            contrast: 'bg-white text-black',
            success: 'bg-emerald-500 text-white',
            danger: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-white',
            info: 'bg-blue-500 text-white',
        },
        bgHover: {
            white: 'hover:bg-gray-100',
            whiteDark: 'hover:bg-slate-800',
            lightDark: 'hover:bg-slate-700',
            contrast: 'hover:bg-slate-100',
            success: 'hover:bg-emerald-600 hover:border-emerald-600',
            danger: 'hover:bg-red-600 hover:border-red-600',
            warning: 'hover:bg-yellow-600 hover:border-yellow-600',
            info: 'hover:bg-blue-600 hover:border-blue-600',
        },
        borders: {
            white: 'border-white',
            whiteDark: ' border-slate-900',
            lightDark: 'border-slate-800',
            contrast: 'border-white',
            success: 'border-emerald-500',
            danger: 'border-red-500',
            warning: 'border-yellow-500',
            info: 'border-blue-500',
        },
        text: {
            contrast: 'text-slate-100',
            success: 'text-emerald-500',
            danger: 'text-red-500',
            warning: 'text-yellow-500',
            info: 'text-blue-500',
        },
        outlineHover: {
            contrast: 'hover:bg-slate-100 hover:text-black',
            success: 'hover:text-white hover:text-white hover:border-emerald-600',
            danger: 'hover:text-white hover:text-white hover:border-red-600',
            warning: 'hover:text-white hover:text-white hover:border-yellow-600',
            info: 'hover:text-white hover:border-blue-600',
        },
    };

    const isOutlinedProcessed =
        isOutlined && ['white', 'whiteDark', 'lightDark'].indexOf(color) < 0;

    const base = [colors.borders[color], colors.ring[color]];

    if (isActive) {
        base.push(colors.active[color]);
    } else {
        // @ts-ignore
        base.push(isOutlinedProcessed ? colors.text[color] : colors.bg[color]);
    }

    if (hasHover) {
        base.push(
            // @ts-ignore
            isOutlinedProcessed ? colors.outlineHover[color] : colors.bgHover[color],
        );
    }

    return base.join(' ');
};
