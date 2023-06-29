import Image from "next/image";
import * as React from 'react';

import ReactDOM from 'react-dom/client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

/*
https://github.com/r-spacex/SpaceX-API/blob/master/docs/crew/v4/all.md
*/
type Crew = {
  name: string;
  agency: string;
  image: string;
  wikipedia: string;
  launches: string[];
  status: string;
  id: string;
};

async function fetchSpaceXCrew() {
  const url = `https://api.spacexdata.com/v4/crew`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      // Process the fetched data here
      return data;
    } else {
      console.error("Request failed with status:", response.status);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

const columnHelper = createColumnHelper<Crew>()

const columns = [

  columnHelper.accessor('name', {
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Name</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('agency', {
    header: () => 'agency',
    cell: info => info.renderValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('status', {
    header: () => <span>Visits</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('launches', {
    header: 'Status',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('wikipedia', {
    header: 'wiki',
    footer: info => info.column.id,
  }),
]


export default async function Home() {
  const crewInfo: Crew[] = await fetchSpaceXCrew();

  const [data, setData] = React.useState(() => [...crewInfo])
  const rerender = React.useReducer(() => ({}), {})[1]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <main className="">
      <h1 className="text-4xl font-bold text-center py-4">
        SpaceX Crew Members
      </h1>
      <section>
        {/* 
        SOME STUFF TO DO:
        1. Lets start by making this a table where we can see all of the crews information
        2. We should be able to sort by name, agency, status (https://tanstack.com/table/v8) WE use this in our company.
        3. We should be able to filter by agency
        4. When we click on the image, we should be able to see a modal with more information about the crew member specifically more information about the launches they have been on.
        5. We should be able to search by name
        6. when we click on wiki we should open a new tab with the wikipedia page
        7. We should be able to see the number of launches they have been on
        */}
        {crewInfo?.map((crew) => (
            <div key={crew.id} className="w-auto h-auto">
              <Image src={crew.image} alt={crew.name} width={200} height={200} />
            </div>
        ))}
      </section>
          
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
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
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
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

    </main>
  );
}