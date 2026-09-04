import argon2 from 'argon2';

export async function verifyPassword(password: string): Promise<boolean> {
    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash || !password) {
        return false;
    }
    try {
        return await argon2.verify(hash, password);
    } catch {
        return false;
    }
}
