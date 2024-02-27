import { createTRPCRouter } from "~/server/api/trpc";
import { phoneRouter } from "~/server/api/routers/phoneNumber";
import { wifiRouter } from "~/server/api/routers/wifi";
import { userRouter } from "~/server/api/routers/user";
import { authRouter } from "~/server/api/routers/auth";
import { uploadRouter } from "~/server/api/routers/upload";
import { manageNotifRouter, managePortalRouter } from "~/server/api/routers/manage";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  phone: phoneRouter,
  wifi: wifiRouter,
  user: userRouter,
  auth: authRouter,
  upload: uploadRouter,
  managePortal: managePortalRouter,
  manageNotif: manageNotifRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
