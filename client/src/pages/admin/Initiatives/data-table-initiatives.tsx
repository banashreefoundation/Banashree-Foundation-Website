"use client"
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Initiatives } from "./columns";
import Modal from "./Modal";

interface DataTableProps {
  columnsInit: ColumnDef<Initiatives>[];
  data: Initiatives[];
  isDashboard?: boolean;
}

export function DataTableInitiatives({ columnsInit, data, isDashboard = false }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Number of items per page
  const handleView = (rowData: Initiatives) => {
    setModalContent({type: 'view', data: rowData});
    setIsModalOpen(true);
  };

  const handleEdit = (rowData: Initiatives) => {
    setModalContent({type: 'edit', data: rowData});
    setIsModalOpen(true);
  };

  const handleDelete = (rowData: Initiatives) => {
    console.log('Deleting:', rowData);
  };

  const table = useReactTable({
    data,
    columns: columnsInit.map(column => ({
      ...column,
      meta: { handleView, handleEdit, handleDelete }, 
    })),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination: { pageIndex, pageSize }, // Add pagination state
    },
    onPaginationChange: (updater) => {
      const nextState = updater({ pageIndex, pageSize });
      setPageIndex(nextState.pageIndex);
      setPageSize(nextState.pageSize);
    },
  });

  return (
    <>
      <div className="bg-white mt-5  rounded-md border shadow-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} >
                {headerGroup.headers.map(header => (
                  <TableHead className="tableheadings" key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}   className={index % 2 === 0 ? 'bg-[#FDEBE8]' : 'bg-white'}  >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnsInit.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

          {/* Pagination Controls */}
          {!isDashboard && (
          <div className="flex justify-between items-center p-4">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 text-white bg-blue-500 rounded disabled:bg-gray-400 btn"
            >
              First
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 text-white bg-blue-500 rounded disabled:bg-gray-400 btn"
            >
              Previous
            </button>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 text-white bg-blue-500 rounded disabled:bg-gray-400 btn"
            >
              Next
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 text-white bg-blue-500 rounded disabled:bg-gray-400 btn"
            >
              Last
            </button>

            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-4 py-2 rounded border"
            >
              {[5,10, 20, 30, 40, 50].map(size => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
          )}
          
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        input={modalContent ?  modalContent: (
          <p>No content available.</p>
        )}
      /> 
    </>
  );
}
