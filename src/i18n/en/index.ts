import type { BaseTranslation } from "../i18n-types";

const en = {
  message: {
    welcome: "FREE SUPER FAST WIFI",
    caption: "Enter your phone number below to get your wifi password.",
  },
  input: {
    placeHolderPhoneNumber: "Type phone number here",
    placeHolderPhoneNumberOffNotif: "Please turn on the notification first",
  },
  button: {
    login: "Login",
  },
  notSupport: {
    title: "Browser Not Supported!",
    caption: "Please Use Chrome to continue.",
    button: {
      title: "Open With Chrome",
      caption: "Copy to clipboard",
    },
  },
} satisfies BaseTranslation;

export default en;
