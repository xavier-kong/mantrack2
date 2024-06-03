import { relations, sql } from "drizzle-orm";
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
    username: text("username").unique().notNull().primaryKey(),
    password: text("password").notNull()
})

export const entries = sqliteTable("entries", {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }).unique(),
    username: text("username").notNull().references(() => users.username),
    url: text('url').notNull(),
    name: text("name").notNull().unique(),
    softDeleted: integer('softDeleted', { mode: 'boolean' }).default(true).notNull()
})

export const usersRelations = relations(users, ({ many }) => ({
    entriesTable: many(entries)
}))
