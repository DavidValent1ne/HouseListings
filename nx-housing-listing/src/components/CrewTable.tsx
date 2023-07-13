// You need to tell nextjs "hey this is a react client side component" by adding the following comment
"use client";

import { useMemo, useState, useEffect } from "react";


import {
  Column,
  Table,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Crew } from "@/app/page";

const columnHelper = createColumnHelper<Crew>();
const columns = [
  columnHelper.accessor("name", {
    cell: (info) => <i>{info.getValue()}</i>,
    id: 'name',
    header: () => <span>Name</span>,
  }),
  columnHelper.accessor("agency", {
    header: () => "Agency",
    cell: (info) => info.renderValue(),
    id: 'agency',
  }),
  columnHelper.accessor("status", {
    header: () => <span style={{width: '100px'}}>Status</span>,
    id: 'status',
    }),
  columnHelper.accessor("wikipedia", {
    header: "Wikipedia",
    cell: ({ cell }) => <a className="link-style" href={cell.getValue()} >More Info</a>,
    id: 'wikipedia', 
  }),
  columnHelper.accessor("image", {
    header: "Crew",
    
    cell: ({ cell }) => (
      <a href={`/model/${cell.row.original.id}`}>
        <img src={cell.getValue()} height="150" width="150" alt="image" />
      </a>
    ),
    id: 'crew',
  })
];


type CrewTableProps = {
  crewInfo: Crew[]
}

export function CrewTable({ crewInfo }: CrewTableProps) {
  // This is not an error but you dont need to spread the array into a new array
  const [data, setData] = useState(crewInfo)
  const [sorting, setSorting] = useState([])
  const [filtering, setFiltering] = useState('')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),

    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting as any,
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div>
      <table style={{ margin: '0 auto' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  <div
                      {...{
                        className: ['name', 'agency'].includes(header.id) && header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : 'select-none',
                        onClick: ['name', 'agency'].includes(header.id) && header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined,
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                       
                    </div>

                    <div>
                      {['name'].includes(header.id) && (
                        <FilterInput column={header.column} table={table} droppable={false} />
                      )}
                      {['agency', 'status'].includes(header.id) && (
                        <FilterInput column={header.column} table={table} droppable={true} />
                      )}
                      {!['name', 'agency', 'status'].includes(header.id) && <br />}
                    </div>
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
      </table>
    </div>
  );
}

export function FilterInput({
  column,
  table,
  droppable = false,
}:{
  column: Column<any, any>
  table: Table<any>
  droppable?: boolean
}) {
  const flatRows = table.getFilteredRowModel().flatRows;
  const uniqueValues = new Set<any>();

  flatRows.forEach((row) => {
    const value = row.getValue(column.id);
    uniqueValues.add(value);
  });
  const sortedUniqueValues = Array.from(uniqueValues).sort()

  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()
  const columnValueAsString = column.getFilterValue() as string;

  return (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 100).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>

      {droppable ? (
        <select
        value={columnValueAsString ?? ''}
        style={{
          color: '#000',
          height: '23px',
          width: '100px'
        }}
        onChange={(e) => column.setFilterValue(e.target.value)}
      >
        <option value="">All</option>
        {sortedUniqueValues.map((value: string) => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </select>
      ) : (
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={value => column.setFilterValue(value)}
        placeholder={`Search... (${sortedUniqueValues.length})`}
        style={{
          color: '#000',
          height: '23px',
        }}
        list={column.id + 'list'}
      />
      )}
      <div/>
    </>
  )
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 250,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}
