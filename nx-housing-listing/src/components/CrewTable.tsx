// You need to tell nextjs "hey this is a react client side component" by adding the following comment
"use client";

import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Crew } from "@/app/page";
const columnHelper = createColumnHelper<Crew>();

const columns = [
  columnHelper.accessor("name", {
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Name</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("agency", {
    header: () => "agency",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("status", {
    header: () => <span>Visits</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("launches", {
    header: "Status",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("wikipedia", {
    header: "wiki",
    footer: (info) => info.column.id,
  }),
];
type CrewTableProps = {
  crewInfo: Crew[];
};
export function CrewTable({ crewInfo }: CrewTableProps) {
  // This is not an error but you dont need to spread the array into a new array
  const [data, setData] = useState(crewInfo);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <table>
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
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
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
  );
}
