import { z } from "zod";
import { db } from '../db';

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { userTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const mainRouter = createTRPCRouter({
  createUser: publicProcedure
  .input(z.object({ username: z.string(), password: z.string() }))
  .mutation(async ({ input }) => {
    const userQuery = await db.select().from(userTable).where(eq(userTable.username, input.username));

    if (userQuery.length !== 0) {
      throw new TRPCError({ 
        code: 'BAD_REQUEST',
        message: 'username already taken'
      });
    }

    try {
      await db.insert(userTable).values(input);

      return {
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

    const dataQuery = await db.select().from(entriesTable).where(eq(entriesTable.username, username));

  })

})

async function validateUserCreds({ username, password }: { username: string; password: string }) {
  const userQuery = await db.select().from(userTable).where(eq(userTable.username, username));

  if (userQuery.length === 0) {
    throw new TRPCError({ 
      code: 'BAD_REQUEST',
      message: 'user not found'
    });
  }

  const userPassword = userQuery[0]?.password;

  if (userPassword !== password) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'username or password invalid'
    })
  }
}


/*
export const postRouter = createTRPCRouter({
  hello: publicProcedure
  .input(z.object({ text: z.string() }))
  .query(({ input }) => {
    return {
      greeting: `Hello ${input.text}`,
    };
  }),

  create: publicProcedure
  .input(z.object({ name: z.string().min(1) }))
  .mutation(async ({ input }) => {
    // simulate a slow db call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    post = { id: post.id + 1, name: input.name };
    return post;
  }),

  getLatest: publicProcedure.query(() => {
    return post;
  }),
});
*/
