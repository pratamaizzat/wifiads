import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Clients, Controller, Hotspots, type Site } from "unifi-client";
import { z } from "zod";
import { env } from "~/env.mjs";
import { phoneRegex } from "./phoneNumber";
import dayjs from 'dayjs'
import { TRPCError } from "@trpc/server";

export const wifiRouter = createTRPCRouter({
  setup: publicProcedure
    .input(
      z.object({
        mac: z.string().nonempty("mac cannot be empty"),
        ap: z.string().nonempty("ap cannot be empty"),
        phoneNumber: z
          .string()
          .nonempty("phone number cannot be empty")
          .regex(phoneRegex, "invalid phone number"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {

        const latestHotspot = await ctx.prisma.hotspot.findFirst({
          orderBy: {
            createdAt: "desc"
          }
        })

        if (!latestHotspot) throw new TRPCError({ code: "BAD_REQUEST" })
        const controller = new Controller({
          username: env.UNIFI_USERNAME,
          password: env.UNIFI_PASSWORD,
          url: env.UNIFI_URL,
          strictSSL: false,
        });
        await controller.login();
        const sites = await controller.getSites();

        const site = sites[0] as Site;
        const hostpot = new Hotspots({
          controller,
          site,
        });
        const authorize = await hostpot.authorizeGuest({
          mac: input.mac,
          minutes: +latestHotspot.duration,
          up: +latestHotspot.upSpeed,
          down: +latestHotspot.downSpeed,
          bytes: +latestHotspot.maxBytes,
          ap_mac: input.ap,
        });

        const clients = new Clients({
          controller,
          site,
        });

        const foundClient = (await clients.list()).find(
          (foundClient) => foundClient.mac === authorize.mac
        );

        console.log({ authorize, foundClient });

        const user = await ctx.prisma.user.create({
          data: {
            mac: authorize.mac,
            phoneNumber: input.phoneNumber,
            hostname: foundClient?.hostname,
            firstSeen: foundClient?.firstSeen
              ? dayjs(foundClient.firstSeen).toDate()
              : dayjs().toDate(),
            lastSeen: foundClient?.lastSeen
              ? dayjs(foundClient.lastSeen).toDate()
              : dayjs().toDate(),
            lastDisconnect: foundClient?.lastDisconnect
              ? dayjs(foundClient.lastDisconnect).toDate()
              : dayjs().toDate(),
          },
        });

        return user;
      } catch (e) {
        return {
          status: 500,
          message: "uneble to connect",
          stack: e,
        };
      }
    }),
  getGroups: publicProcedure.query(async () => {
    const controller = new Controller({
      username: env.UNIFI_USERNAME,
      password: env.UNIFI_PASSWORD,
      url: env.UNIFI_URL,
      strictSSL: false,
    });
    await controller.login();
    const sites = await controller.getSites();

    const site = sites[0] as Site;
    console.log(site.clientsGroups)
    return site.clientsGroups;
  }),

  getLatestHotspot: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.hotspot.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  updateLatestHotspot: publicProcedure.input(z.object({
    duration: z.number().min(1),
    upSpeed: z.number().min(1),
    downSpeed: z.number().min(1),
    maxBytes: z.number().min(1),
    redirectUrl: z.string().url().nonempty()
  })).mutation(async ({ ctx, input }) => {
    const latestHotspot = await ctx.prisma.hotspot.findFirst({
      orderBy: {
        createdAt: "desc"
      }
    })

    if (!latestHotspot) throw new TRPCError({
      code: "BAD_REQUEST"
    })


    return await ctx.prisma.hotspot.update({
      where: {
        id: latestHotspot.id
      },
      data: {
        duration: input.duration.toString(),
        upSpeed: input.upSpeed.toString(),
        downSpeed: input.downSpeed.toString(),
        maxBytes: input.maxBytes.toString(),
        redirectUrl: input.redirectUrl
      }
    })
  }),

});
