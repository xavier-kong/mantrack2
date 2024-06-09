import { z } from "zod";
import { db } from '../db';

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { entries, users } from "../drizzle/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
    createUser: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
        const userQuery = await db.select().from(users).where(eq(users.username, input.username));

        if (userQuery.length !== 0) {
            throw new TRPCError({ 
                code: 'BAD_REQUEST',
                message: 'username already taken'
            });
        }

        try {
            await db.insert(users).values(input);

            return {
                username: input.username,
                password: input.password,
                success: true
            };
        } catch (error) {
            console.log(error);
            return {
                success: false
            };
        }
    }),
    login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
        await validateUserCreds({ ...input });
        return { success: true };
    }),
    getUserdata: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .query(async ({ input }) => {
        await validateUserCreds({ ...input });

        const userData = await db.select().from(entries).where(eq(entries.username, input.username));

        return { data: userData };
    }),
    insertNewEntry: publicProcedure
    .input(z.object({ username: z.string(), password: z.string(), url: z.string(), name: z.string() }))
    .mutation(async ({ input }) => {
        await validateUserCreds({ ...input });

        const existing = await db.select().from(entries).where(
            and(
                eq(entries.username, input.username),
                eq(entries.name, input.name)
            )
        );

        await db.insert(entries).values({
            username: input.username,
            url: input.url,
            name: input.name
        });
    }),
    updateEntry: publicProcedure
    .input(z.object({ username: z.string(), password: z.string(), url: z.string(), name: z.string(), id: z.number() }))
    .mutation(async ({ input }) => {
        await validateUserCreds({ ...input });

        await db.update(entries).set({ name: input.name, url: input.url }).where(eq(entries.id, input.id));
    }),
    deleteEntry: publicProcedure
    .input(z.object({ username: z.string(), password: z.string(), url: z.string(), name: z.string(), id: z.number() }))
    .mutation(async ({ input }) => {
        await validateUserCreds({ ...input });

        await db.update(entries).set({ softDeleted: true }).where(eq(entries.id, input.id));
    }),
})

async function validateUserCreds({ username, password }: { username: string; password: string }) {
    const userQuery = await db.select().from(users).where(eq(users.username, username));

    if (userQuery.length === 0) {
        throw new TRPCError({ 
            code: 'BAD_REQUEST',
            message: 'user not found'
        });
    }

    const userPassword = userQuery[0]?.password;

    if (userPassword !== password) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'username or password invalid'
        })
    }
}
