import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";

export const manageNotifRouter = createTRPCRouter({
  sendNotif: publicProcedure.input(z.object({
    content: z.string().nonempty(),
    segment: z.string().nonempty(),
  })).mutation(async ({input}) => {
    const res = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      body: JSON.stringify({
        app_id: env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        included_segments: [input.segment],
        contents: {
          en: input.content,
        }
      }),
      headers: {
        'Authorization': `Basic ${env.ONESIGNAL_REST_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const response = await res.json() as {id: string, errors: string[], external_id: string|null}

    return response
  }),
})

export const managePortalRouter = createTRPCRouter({

  updatePortal: publicProcedure
    .input(
      z.object({
        key: z.string(),
        keyAds: z.string(),
        message: z.string(),
        title: z.string(),
      }).partial()
    )
    .mutation(async ({ ctx, input }) => {

      const latestPortal = await ctx.prisma.portal.findFirst({
        orderBy: {
          createdAt: "desc"
        }
      })

      if(!latestPortal) throw new TRPCError({
        code: "BAD_REQUEST"
      })

      const response = await ctx.prisma.portal.update({
        where: {
          id: latestPortal.id
        },
        data: {
          key: input.key ?? latestPortal.key,
          message: input.message ?? latestPortal.message,
          title: input.title ?? latestPortal.title,
          keyAds: input.keyAds ?? latestPortal.keyAds
        }
      })

      return response
    }),

  getLatestBanner: publicProcedure.query(() => {
    return ""
  }),

  getLatestPortal: publicProcedure.query(async ({ctx}) => {
    const latest = await ctx.prisma.portal.findFirst({
      orderBy: {
        id: 'desc'
      },
    })

    return latest
  }),

  updateBanner: publicProcedure
    .input(
      z.object({
        key: z.string().nonempty(),
        url: z.string().nonempty(),
      })
    )
    .mutation(() => {
      return ""
    }),
});
