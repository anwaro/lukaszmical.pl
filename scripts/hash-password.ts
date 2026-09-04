// Generates an argon2 hash for the single admin password.
//
// Usage:
//   pnpm auth:hash 'your-password'
//
// Paste the printed hash into ADMIN_PASSWORD_HASH (.env.local for dev,
// Vercel project env for production). Never commit the hash.

import argon2 from 'argon2';

async function main() {
    const password = process.argv[2];

    if (!password) {
        console.error("Usage: pnpm auth:hash '<password>'");
        process.exit(1);
    }

    const hash = await argon2.hash(password, {type: argon2.argon2id});
    console.log(hash);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
