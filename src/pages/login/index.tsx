import * as React from 'react'
import Head from "next/head";
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { toast } from 'react-hot-toast';
import { getCSRFToken, setCSRFToken, setUserInfo } from '~/utils/localstorage';

export default function LoginPage() {
  const router = useRouter();

  React.useEffect(() => {
    if(getCSRFToken()) {
      void router.replace('/admin/dashboard')
    }
  }, [router])

  const [formData, setFormData] = React.useState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: "",
  });

  const { username, password } = formData;
  const { mutate: processLogin, isLoading: isProcessLogin } =
    api.auth.login.useMutation({
      onSuccess: ({ token, id, username }) => {
        setFormData({
          username: "",
          password: "",
        });
        setCSRFToken(token);
        setUserInfo({ userId: id, username });

        const search = location.search.substring(1);
        const callback = decodeURIComponent(search.split("=")[1] || "");

        void router.replace(callback ? callback : "/admin/dashboard");
      },
      onError: (e) => {
        console.log(e.message)
        const errorMessageUsername = e.data?.zodError?.fieldErrors.username;
        const errorMessagePassword = e.data?.zodError?.fieldErrors.password;
        if (errorMessageUsername && errorMessageUsername[0]) {
          toast.error(errorMessageUsername[0]);
        } else if (errorMessagePassword && errorMessagePassword[0]) {
          toast.error(errorMessagePassword[0]);
        } else if(e.message) {
          toast.error(e.message);
        } else {
          toast.error("Failed to login! Please try again later.");
        }
      },
    });
  const handleChangeInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [evt.target.name]: evt.target.value,
    }));
  };

  const handleSubmit = (evt: React.MouseEvent<HTMLFormElement>) => {
    evt.preventDefault();
    processLogin({ username, password });
  };

  return (
    <>
      <Head>
        <title>Free Super Fast WIFI &bull; Masuk</title>
        <meta
          name="description"
          content="Masuk ke Free Super Fast WIFI Admin"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <span className="absolute inset-0 mx-auto mb-3 mt-auto max-h-fit max-w-fit text-center">
          &copy; {new Date().getFullYear()} PT Interads Kreasi Indonesia. All right reserved.
        </span>
        <div
          id="card-container"
          className="absolute inset-0 m-auto flex max-h-fit max-w-[370px] flex-col gap-8 rounded-lg bg-[#e6e6e6] px-4 pb-4 pt-6"
        >
          <div id="card-header" className="flex flex-col">
            <h1 className="mb-4 text-sm font-semibold text-[#343434]">
              FSFW
            </h1>
            <h3 className="mb-2 text-4xl font-bold text-[#343434]">
              Selamat Datang Kembali,
            </h3>
            <p className="text-xs font-extralight text-[#343434]">
              Silahkan masukkan akun anda dibawah ini.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            id="card-form"
            className="flex flex-col gap-4"
          >
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-[#666666]">Username</span>
              </label>
              <input
                type="text"
                value={username}
                name="username"
                required
                onChange={handleChangeInput}
                placeholder="Masukkan username"
                className="input-bordered input w-full"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-[#666666]">Password</span>
              </label>
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                name="password"
                required
                onChange={handleChangeInput}
                className="input-bordered input w-full"
              />
            </div>
            <button
              className={`btn mt-8 ${isProcessLogin ? "loading" : ""}`}
              type="submit"
            >
              {isProcessLogin ? 'Loading...': 'Masuk'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
