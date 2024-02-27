import jwt from 'jsonwebtoken'
import { TRPCError } from '@trpc/server';
import { z } from 'zod'
import * as argon2 from 'argon2'
import Cookies from "cookies";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(z.object({
    username: z.string().nonempty("username cannot be empty"),
    password: z.string().nonempty("password cannot be empty"),
  })).mutation(async ({ ctx, input }) => {
    const foundUser = await ctx.prisma.admin.findFirst({
      where: { username: input.username },
    });

    if (!foundUser)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "username or password is invalid",
      });

    if (!(await argon2.verify(foundUser.password, input.password)))
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "username or password is invalid",
      });

    // create token
    const accessToken = jwt.sign(
      { id: foundUser.id, username: foundUser.username },
      env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { id: foundUser.id, username: foundUser.username },
      env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" }
    );

    const csrfToken = jwt.sign({}, env.CSRF_SECRET);
    const cookies = new Cookies(ctx.req, ctx.res);
    cookies.set("access", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(new Date().setDate(new Date().getDate() + 1)),
    });
    cookies.set("refresh", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(new Date().setDate(new Date().getDate() + 30)),
    });

    return {
      token: csrfToken,
      id: foundUser.id,
      username: foundUser.username,
    };

  }),
  logout: privateProcedure.mutation(({ ctx }) => {
    const cookies = new Cookies(ctx.req, ctx.res);
    cookies.set("access", "", {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(1),
    });

    cookies.set("refresh", "", {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(1),
    });
    return {
      message: "Success logout",
    };
  }),
});
