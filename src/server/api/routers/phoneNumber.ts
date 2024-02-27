import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const phoneRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        phoneNumber: z
          .string()
          .nonempty("phone number cannot be empty")
          .regex(phoneRegex, "invalid phone number"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const phoneNumber = await ctx.prisma.phoneNumber.create({
        data: {
          phoneNumber: input.phoneNumber,
        },
      });

      return phoneNumber;
    }),
});
