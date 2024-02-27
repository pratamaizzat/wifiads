import type { BaseTranslation, Translation } from "../i18n-types";
import en from "../en";

const id = {
  ...(en as Translation),
  message: {
    welcome: "WIFI SUPER CEPAT DAN GRATIS",
    caption: "Masukkan nomer ponsel anda dibawah untuk mendapatkan password.",
  },
  input: {
    placeHolderPhoneNumber: "Masukkan nomer ponsel disini",
    placeHolderPhoneNumberOffNotif: "Tolong hidupkan notifikasi",
  },
  button: {
    login: "Masuk",
  },
  notSupport: {
    title: "Browser Tidak Didukung!",
    caption: "Gunakan chrome untuk melanjutkan",
    button: {
      title: "Buka dengan chrome",
      caption: "Salin",
    },
  },
} satisfies BaseTranslation;

export default id;
