import { migrate } from 'drizzle-orm/libsql/migrator'
import { db } from './db';
import { env } from '../../env.js';

await migrate(db, { migrationsFolder: '../../../drizzle' });
