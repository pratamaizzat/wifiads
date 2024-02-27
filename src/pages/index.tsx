import { type GetStaticProps } from "next";
import Head from "next/head";
import React from "react";
import { I18nContext } from "~/i18n/i18n-react";
import type { Locales } from "~/i18n/i18n-types";
import { loadedLocales } from "~/i18n/i18n-util";
import { loadLocaleAsync } from "~/i18n/i18n-util.async";

const getI18nProps: GetStaticProps = async (context) => {
  const locale = context.locale as Locales;
  await loadLocaleAsync(locale);

  return {
    props: {
      i18n: {
        locale: locale,
        dictionary: loadedLocales[locale],
      },
    },
  };
};

export default function Home() {
  const { LL } = React.useContext(I18nContext);
  return (
    <>
      <Head>
        <title>Wifi Ads</title>
        <meta
          name="description"
          content="Free Wifi for everyone and anywhare by PT. Interads Kreasi Indonesia"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="absolute inset-0 m-auto max-h-fit max-w-fit px-3 py-4">
        <h1>{LL.message.welcome()}</h1>
      </main>
    </>
  );
}

export const getStaticProps = getI18nProps;
