// `db-client.ts` connects lazily (postgres.js only opens a socket on the
// first query) but throws eagerly at import time if `DATABASE_URL` is unset.
// Unit tests that import repository code through a type-only path (e.g. a
// default-parameter fallback they never exercise) still trigger that import
// — give it a placeholder so the module loads; no test should run a real
// query against it.
process.env.DATABASE_URL ??= 'postgres://test:test@localhost:5432/test';
