/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { type AppProps, type AppType } from "next/app";
import { type NextLayout } from "next";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import type { Locales, Translation } from "~/i18n/i18n-types";
import { loadFormatters } from "~/i18n/i18n-util.async";
import TypesafeI18n from "~/i18n/i18n-react";
import { loadedLocales } from "~/i18n/i18n-util";
import React from "react";
import run from "~/utils/onesignal";

type AppLayoutProps = AppProps & {
  Component: NextLayout;
};

const MyApp: AppType = ({ Component, pageProps }: AppLayoutProps) => {
  React.useEffect(() => {
    void run();
  }, []);

  const getLayout = Component.getLayout ?? ((page: React.ReactNode) => page);

  if (!pageProps.i18n) {
    return (
      <>
        <Toaster position="bottom-center" />
        {getLayout(<Component {...pageProps} />)}
      </>
    );
  }
  const locale: Locales = pageProps.i18n.locale;
  const dictionary: Translation = pageProps.i18n.dictionary;

  loadedLocales[locale] = dictionary as Translation;
  loadFormatters(locale);
  return (
    <TypesafeI18n locale={locale}>
      <Toaster position="bottom-center" />
      {getLayout(<Component {...pageProps} />)}
    </TypesafeI18n>
  );
};

export default api.withTRPC(MyApp);
