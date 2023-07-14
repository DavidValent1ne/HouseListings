"use client";

import { useState, useEffect } from "react";
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
  columnHelper.accessor("name", { //these define the cells that will be used in the tanstack table
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
  // ^^^ Im not too sure how to do it any other way I wouldn't mind feedback
  const [data] = useState(crewInfo)
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
                        className: ['name', 'agency'].includes(header.id) && header.column.getCanSort() //This makes sure that only the name and agency columns can be clicked and show as clickable
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
                        <FilterInput column={header.column} table={table} droppable={false} /> //by setting droppable to false it will return a text box rather than a drop down menu but will also have a list of auto completed names
                      )}
                      {['agency', 'status'].includes(header.id) && (
                        <FilterInput column={header.column} table={table} droppable={true} />
                      )}
                      {!['name', 'agency', 'status'].includes(header.id) && <br />/* This adds breaks for columns that don't have search features to keep the table even */}
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

function FilterInput({
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

  flatRows.forEach((row) => { //finds all unique values for the current column
    const value = row.getValue(column.id);
    uniqueValues.add(value);
  });
  const sortedUniqueValues = Array.from(uniqueValues).sort()
  const columnFilterValue = column.getFilterValue()

  return (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 100).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>

      {droppable ? (
        <select
        value={String(columnFilterValue) ?? ''}
        style={{
          color: '#000',
          height: '23px',//this is the exact value that makes the textbox the same height as the dropdown box
          width: '100px'
        }}
        onChange={(e) => column.setFilterValue(e.target.value)} //makes sure to display only values that contain the option from the drop table
      >
        <option value="">All</option>
        {sortedUniqueValues.map((value: string) => (// makes only unique values to be within the drop table
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
        placeholder={`Search... (${sortedUniqueValues.length})`} //lets the user know how many unique values are in the column, should only be used for searching names
        style={{
          color: '#000',
          height: '23px',
        }}
        list={column.id + 'list'} //enable the input box to have a list of unique values
      />
      )}
      <div/>
    </>
  )
}

function DebouncedInput({ //used to prevent the table from updating as the user is typing for minor optimization, only needed for input boxes
  value: initialValue,
  onChange,
  debounce = 250, //how much time of inactivity before updating the table
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) { // this line should make sure that the user input will not be ran as code
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
