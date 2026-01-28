"use client";
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  // getPaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Campaigns } from "./columns";
import Modal from "./Modal";

interface DataTableProps {
  columnsCamp: ColumnDef<Campaigns>[];
  data: Campaigns[];
  isDashboard?: boolean;
}

export function DataTableCampaigns({
  columnsCamp,
  data,
  isDashboard = false,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<Campaigns | null>(null);

  // Pagination state
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Number of items per page

  // Fetch campaign data from API
  const [campaigns, setCampaigns] = useState<Campaigns[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:4001/api/v1/campaigns");
        const campaignData = await response.json();
        if (campaignData.success) {
          setCampaigns(campaignData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log('Campaign data state:', campaigns); // Debugging: Log state update
  }, [campaigns]);


  const handleView = (rowData: Campaigns) => {
    setModalContent(rowData);
    setIsModalOpen(true);
  };

  const handleDelete = (rowData: Campaigns) => {
    console.log("Deleting:", rowData);
  };

  const table = useReactTable({
    data: campaigns,
    columns: columnsCamp.map((column) => ({
      ...column,
      meta: { handleView, handleDelete }, // Set meta for every column
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
      <div className="bg-white mt-12 rounded-md border shadow-lg">
        {!isDashboard && (
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center space-x-2">
              <img
                src="../src/assets/images/left-arrow.png"
                alt="Icon"
                className="w-6 h-6"
              />
              <h2 className="text-xl font-semibold">Campaigns</h2>
            </div>
            <div className="flex items-center space-x-2 w-full max-w-sm">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 rounded border"
              />
              <button className="flex items-center justify-center py-2 text-white rounded px-4 w-full btn">
                <img
                  src="../src/assets/images/plus-white.png"
                  className="w-6 h-6 mr-2"
                />
                Add New
              </button>
            </div>
          </div>
        )}
        <div className="h-full flex flex-col">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead className="tableheadings" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={index % 2 === 0 ? "bg-[#FDEBE8]" : "bg-white"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columnsCamp.length}
                    className="h-24 text-center"
                  >
                    Data table for Campaigns... No results.
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
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
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
                {[5, 10, 20, 30, 40, 50].map((size) => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={modalContent ? modalContent : <p>No content available.</p>}
      />
    </>
  );
}
