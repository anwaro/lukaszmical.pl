import {Base64} from 'js-base64';
import Cookies from 'js-cookie';

const encode = <T>(val: T) => {
    return Base64.encode(JSON.stringify(val));
};

const decode = <T>(val: string): T => {
    return JSON.parse(Base64.decode(val));
};

export const createCookieStore = <T = unknown>(key: string) => {
    return {
        set: (value: T, expires?: number | Date) => {
            try {
                Cookies.set(key, encode(value), {
                    path: '/',
                    expires,
                });
            } catch (e) {
                //pass
            }
        },
        get: (): T | undefined => {
            try {
                const data = Cookies.get(key);
                if (data) {
                    return decode(data);
                }
                return undefined;
            } catch (e) {
                return undefined;
            }
        },
        remove: () =>
            Cookies.remove(key, {
                path: '/',
            }),
    };
};
