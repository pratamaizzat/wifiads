import { flexRender, type Table } from "@tanstack/react-table";

export type TableBuilderProps<T> = {
  table: Table<T>;
  data: T[];
  loading: boolean;
  colSpan?: number
};

export default function TableBuilder<T>({
  table,
  data,
  loading,
  colSpan = 0
}: TableBuilderProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="table-pin-rows table-pin-cols table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan={colSpan}>
                <div className="flex justify-center text-sm font-semibold">
                  <button className="btn-ghost loading btn-sm btn"></button>
                </div>
              </td>
            </tr>
          )}

          {!loading && data.length === 0 && (
            <tr>
              <td colSpan={colSpan}>
                <div className="flex justify-center text-sm font-semibold">
                  No Data
                </div>
              </td>
            </tr>
          )}

          {!!data && data.length !== 0 && (
            <>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )}
        </tbody>

        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
}
