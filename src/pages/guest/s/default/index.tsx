/* eslint-disable @next/next/no-img-element */
import { type GetStaticProps } from "next";
import OneSignal from "react-onesignal";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-hot-toast";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { I18nContext } from "~/i18n/i18n-react";
import type { Locales } from "~/i18n/i18n-types";
import { loadedLocales } from "~/i18n/i18n-util";
import { loadLocaleAsync } from "~/i18n/i18n-util.async";
import { api } from "~/utils/api";

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
  const router = useRouter();
  const { LL } = React.useContext(I18nContext);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [disableLogin, setDisableLogin] = React.useState(true);
  const [link, setLink] = React.useState("");
  const [isBrowserSupported, setIsBrowserSupported] = React.useState(true);
  const [seconds, setSeconds] = React.useState(15);
  const [showPopup, setShowPopup] = React.useState(true)


  const latestPortal = api.managePortal.getLatestPortal.useQuery(undefined, {refetchOnWindowFocus: false})

  const { data: latestHotspot } = api.wifi.getLatestHotspot.useQuery(undefined, {refetchOnWindowFocus: false})

  const { mutate: authorizeGuest, isLoading: isAuthorizingGuest } =
    api.wifi.setup.useMutation({
      onSuccess: () => {
        void router.replace(latestHotspot?.redirectUrl ?? "/logged");
      },
      onError: () => {
        toast.error("Gagal");
      },
    });

  const { mutate: sendPhoneNumber, isLoading: isSendingPhoneNumber } =
    api.phone.create.useMutation({
      onSuccess: () => {
        authorizeGuest({
          ap: router.query.ap as string,
          mac: router.query.id as string,
          phoneNumber,
        });

        setPhoneNumber("");
      },
      onError: (e) => {
        const errorMessagePhoneNumber =
          e.data?.zodError?.fieldErrors.phoneNumber;
        if (errorMessagePhoneNumber && errorMessagePhoneNumber[0]) {
          toast.error(errorMessagePhoneNumber[0]);
        } else {
          toast.error("Failed to login! Please try again later.");
        }
      },
    });

  const handleSubmit = (evt: React.MouseEvent<HTMLFormElement>) => {
    evt.preventDefault();
    sendPhoneNumber({ phoneNumber });
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds - 1);
    }, 1000);

    if (seconds === 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [seconds]);

  React.useEffect(() => {
    const handlePermissionChange = (permissionChange: { to: string }) => {
      if (permissionChange.to === "granted") {
        setDisableLogin(false);
      } else {
        setDisableLogin(true);
      }
    };

    OneSignal.on("notificationPermissionChange", handlePermissionChange);

    return () => {
      OneSignal.off("notificationPermissionChange", handlePermissionChange);
    };
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setLink(window.location.href);
      if ("Notification" in window) {
        setIsBrowserSupported(true);
      } else {
        setIsBrowserSupported(false);
      }
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          setDisableLogin(false);
        } else {
          setDisableLogin(true);
        }
      }
    }
  }, []);

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
        {showPopup && (
          <section className="fixed w-full h-full p-4 inset-0 bg-slate-900/[0.5] z-10 pointer-events-auto">
            <div className="flex justify-end gap-2 items-center">
              {seconds !== 0 && (
                <span>Lewati dalam</span>
              )}
              <button onClick={() => setShowPopup(false)} disabled={seconds !== 0} className="btn btn-circle btn-outline">
                {seconds !== 0 ? seconds : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                )}
              </button>
            </div>


            {!latestPortal.isFetching && latestPortal.data && (
              <div className="absolute z-40 opacity-100 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[min(100%-2rem,850px)] overflow-hidden rounded-md">
                <video
                  autoPlay
                  muted
                  playsInline
                  controls={false}
                  loop
                >
                  <source src={`/api/media/${latestPortal.data?.keyAds}`} type="video/mp4" />
                  Maaf, browser Anda tidak mendukung pemutaran video.
                </video>
              </div>
            )}
            
          </section>
        )}
        
        {!isBrowserSupported && (
          <div className="alert alert-error mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-bold">{LL.notSupport.title()}</h3>
              <div className="text-xs">{LL.notSupport.caption()}</div>
            </div>
            <CopyToClipboard
              text={link}
              onCopy={() => {
                toast.success("Copied!");
                window.open(`intent:${link}#intent;end`);
              }}
            >
              <button className="btn-lg btn">
                <div className="flex flex-col items-center gap-2">
                  <span>{LL.notSupport.button.title()}</span>
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                      />
                    </svg>
                    <span className="text-[10px] font-light">
                      {LL.notSupport.button.caption()}
                    </span>
                  </div>
                </div>
              </button>
            </CopyToClipboard>
          </div>
        )}

        <div className="mx-auto h-[350px] w-[min(100%-2rem,850px)] overflow-hidden rounded-2xl">
        {/* <div > */}
        {!latestPortal.isFetching && latestPortal.data && (
          <img
          src={`/api/media/${latestPortal.data.key || ""}`}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <h1 className="text-center text-3xl font-bold">
            {latestPortal.data?.title}
          </h1>
          <p className="text-center text-sm font-light">
            {LL.message.caption()}
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex max-w-md flex-col gap-4"
        >
          <input
            disabled={disableLogin}
            type="text"
            placeholder={
              !disableLogin
                ? LL.input.placeHolderPhoneNumber()
                : LL.input.placeHolderPhoneNumberOffNotif()
            }
            className="input-bordered input-primary input w-full"
            value={phoneNumber}
            onChange={(evt) => setPhoneNumber(evt.target.value)}
            required
          />
          <button
            disabled={disableLogin}
            type="submit"
            className={`btn-primary btn ${
              isSendingPhoneNumber ? "loading" : ""
            }`}
          >
            {LL.button.login()}
          </button>
        </form>

        {isAuthorizingGuest && (
          <div className="mt-10 flex items-center justify-center gap-3 text-center text-sm font-light">
            <span className="loading loading-dots loading-lg"></span>
            Authorizing Guest
          </div>
        )}
      </main>
    </>
  );
}

export const getStaticProps = getI18nProps;
