import Head from 'next/head'
import Link from 'next/link'
import * as React from 'react'
import { api } from '~/utils/api'
import { getUsername, removeAllToken } from '~/utils/localstorage'

interface MainLayoutProps {
  children: React.ReactNode
  title: string
}

export default function MainLayout({children, title = "Dashboard"}: MainLayoutProps) {
  const [loggedUser, setLoggedUser] = React.useState('')

  React.useEffect(() => {
    if(getUsername()) {
      setLoggedUser(getUsername() as string)
    }
  }, [])

  const { mutate: logout, isLoading: isLogeedOut } =
    api.auth.logout.useMutation({
      onSuccess: () => {
        removeAllToken();
        window.location.href = "/login";
      },
    });

  return (
    <>
      <Head>
        <title>{`Free Super Fast WIFI | ${title}`}</title>
        <meta name="description" content="Free Super Fast WIFI By Interads" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="navbar bg-base-100 mb-8">
        <div className="flex-1">
          <Link href="/admin/dashboard" className="btn btn-ghost normal-case text-xl">FSFW</Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><Link href="/admin/user/list">User</Link></li>
            <li><Link href="/admin/manage/notif">Notification</Link></li>
            <li>
              <details>
                <summary>
                  {loggedUser.toUpperCase()}
                </summary>
                  <ul className="p-2 bg-base-100">
                  <li><Link href="/admin/manage/portal">Portal</Link></li>
                  <li><Link href="/admin/manage/hotspot">Hotspot</Link></li>
                  <li><button onClick={() => logout()}>{isLogeedOut ? "Loading..." : "Sign out"}</button></li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>

      <section className="mx-auto w-[min(100%-2rem,1200px)]">
        {children}
      </section>
    </>
  )
}