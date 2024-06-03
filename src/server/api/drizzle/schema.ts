import { sql } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";

const foo = sqliteTable("foo", {
    bar: text("bar").notNull().default("Hey!"),
});

