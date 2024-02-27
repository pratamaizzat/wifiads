import * as React from 'react'
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { usersColumn } from "~/column/user";
import { TableBuilder } from "~/components/Table";
import MainLayout from "~/layout/main";
import { api } from "~/utils/api";
import useDebounce from '~/utils/useDebounce';

export default function UserList() {
  const [searchMac, setSearchMac] = React.useState("")

  const { data: users, isLoading: isLoadUsers } = api.user.getAll.useQuery({macAddress: searchMac});

  const table = useReactTable({
    columns: usersColumn,
    data: users ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearch = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchMac(e.target.value)
	})

  return (
    <section className="flex flex-col gap-4" >
      <input onChange={handleSearch} type="text" placeholder="Cari mac address" className="input input-bordered w-full max-w-xs" />
      <TableBuilder colSpan={7} table={table} data={users ?? []} loading={isLoadUsers} />
    </section>
  );
}

UserList.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout title="List User">{page}</MainLayout>;
};

