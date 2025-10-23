import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

export const client = new PGlite('idb://test', {});

export const db = drizzle(client);
