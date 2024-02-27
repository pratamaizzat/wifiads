import OneSignal from "react-onesignal";
import { env } from "~/env.mjs";

export default async function run() {
  await OneSignal.init({
    appId: env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
    allowLocalhostAsSecureOrigin: true,
    notifyButton: {
      enable: true,
    },
    welcomeNotification: {
      disable: false,
      message: "Welcome to WiFi Ads",
    },
  });
}
