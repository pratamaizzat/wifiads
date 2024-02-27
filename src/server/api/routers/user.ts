import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.input(z.object({
    macAddress: z.string()
  }).partial()).query(async ({ ctx, input }) => {
    return ctx.prisma.user.findMany({
      where: {
        mac: {
          contains: input.macAddress
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
});
