
import { defineConfig } from 'drizzle-kit';
import { env } from './src/env.js';

export default defineConfig({
    schema: './src/server/api/drizzle/schema.ts',
    out: './drizzle',
    dialect: 'sqlite', // 'postgresql' | 'mysql' | 'sqlite'
    dbCredentials: {
        url: env.TURSO_DATABASE_URL,
        authToken: env.TURSO_AUTH_TOKEN
    },
});
