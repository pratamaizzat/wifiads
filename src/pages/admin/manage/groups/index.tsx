
import * as React from 'react'
import MainLayout from "~/layout/main";
import { api } from '~/utils/api';

export default function Groups() {

  const { data: clientGroups, isFetching: gettingClientGroups } = api.wifi.getGroups.useQuery(undefined, { refetchOnWindowFocus: false })

  React.useEffect(() => {
    console.log("client groups :", gettingClientGroups, clientGroups)
  }, [gettingClientGroups, clientGroups])

  return (
    <section>
      Anjr
    </section>
  );
}

Groups.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout title="Manage Hotspot">{page}</MainLayout>;
};
