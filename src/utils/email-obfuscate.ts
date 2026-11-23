// Keeps the e-mail address out of the HTML: the server sends only
// base64(caesar(email)) and the browser decodes it after hydration.

const SHIFT = 7;
// Printable ASCII range (space..~), so '@' and '.' are shifted as well.
const FIRST = 32;
const SIZE = 95;

const caesar = (value: string, shift: number) =>
    Array.from(value, (char) => {
        const code = char.charCodeAt(0) - FIRST;

        if (code < 0 || code >= SIZE) {
            return char;
        }

        return String.fromCharCode(FIRST + ((code + shift + SIZE) % SIZE));
    }).join('');

export const encodeEmail = (email: string) => btoa(caesar(email, SHIFT));

export const decodeEmail = (encoded: string) => {
    try {
        return caesar(atob(encoded), -SHIFT);
    } catch {
        return '';
    }
};
