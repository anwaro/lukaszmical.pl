import {SignJWT, jwtVerify} from 'jose';

export const SESSION_COOKIE = 'admin_session';

const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret(): Uint8Array {
    const value = process.env.AUTH_SECRET;
    if (!value) {
        throw new Error('AUTH_SECRET is not set');
    }
    return new TextEncoder().encode(value);
}

export async function createSessionToken(): Promise<string> {
    return new SignJWT({role: 'admin'})
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime(`${SESSION_MAX_AGE}s`)
        .sign(secret());
}

export async function verifySessionToken(
    token: string | undefined,
): Promise<boolean> {
    if (!token) {
        return false;
    }
    try {
        await jwtVerify(token, secret());
        return true;
    } catch {
        return false;
    }
}

export const sessionCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
} as const;
