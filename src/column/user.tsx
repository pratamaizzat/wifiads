import { type User } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from 'dayjs'

const columnHelper = createColumnHelper<User>();

export const usersColumn = [
  columnHelper.accessor("phoneNumber", {
    header: () => <span>Phone Number</span>,
    footer: () => <span>Phone Number</span>,
  }),
  columnHelper.accessor("mac", {
    header: () => <span>Mac Address</span>,
    footer: () => <span>Mac Address</span>,
  }),
  columnHelper.accessor("hostname", {
    header: () => <span>Hostname</span>,
    footer: () => <span>Hostname</span>,
  }),
  columnHelper.accessor("firstSeen", {
    header: () => <span>First Seen</span>,
    cell: (info) => (
      <span>
        {dayjs(info.getValue()).format("DD MMM YYYY, H:mm")}
      </span>
    ),
    footer: () => <span>First Seen</span>,
  }),
  columnHelper.accessor("lastSeen", {
    header: () => <span>Last Seen</span>,
    cell: (info) => (
      <span>
        {dayjs(info.getValue()).format("DD MMM YYYY, H:mm")}
      </span>
    ),
    footer: () => <span>Last Seen</span>,
  }),
  columnHelper.accessor("lastDisconnect", {
    header: () => <span>Last Disconnect</span>,
    cell: (info) => (
      <span>
        {dayjs(info.getValue()).format("DD MMM YYYY, H:mm")}
      </span>
    ),
    footer: () => <span>Last Disconnenct</span>,
  }),
  columnHelper.accessor("createdAt", {
    header: () => <span>Date Join</span>,
    cell: (info) => (
      <span>
        {dayjs(info.getValue()).format("DD MMM YYYY, H:mm")}
      </span>
    ),
    footer: () => <span>Date Join</span>,
  }),
];
