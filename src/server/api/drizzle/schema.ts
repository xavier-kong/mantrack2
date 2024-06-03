import { sql } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
    username: text("username").unique().notNull().primaryKey(),
    password: text("password").notNull()
})

export const entriesTable = sqliteTable("entries", {
    username: text("username").notNull(),
})
