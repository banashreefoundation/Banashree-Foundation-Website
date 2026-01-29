"use client";
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
import { useState, useEffect, useMemo, useCallback } from "react";
import SharedModal from "@/components/ui/modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactService from "@/services/contactService";
import ViewContact from "./ViewContact";
import { Contact } from "@/types/contact.types";
import { view, edit, deleteIcon, plusWhite, leftArrow, arrow } from "@/utils/icons";

// Shared component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
  </div>
);

interface DataTableProps {
  columnsContact: ColumnDef<Contact>[];
  isDashboard?: boolean;
}

export function DataTableContacts({
  columnsContact,
  isDashboard = false,
}: DataTableProps) {
  const [isModalOpen, setIsModalOpen] = useState({
    isAddModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    isViewModalOpen: false,
  });

  const [data, setData] = useState<Contact[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(true);
  const [selectedRowData, setSelectedRowData] = useState<Contact | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenModal = useCallback((modalType: string, isOpen: boolean) => {
    setIsModalOpen((prev) => ({ ...prev, [modalType]: isOpen }));
  }, []);

  const handleView = useCallback(async (rowData: Contact) => {
    console.log("View clicked for:", rowData);
    setSelectedRowData(rowData);
    setIsModalOpen((prev) => ({ ...prev, isViewModalOpen: true }));
    
    // Update status to in-progress if it's currently "new"
    if (rowData.status === "new") {
      try {
        await ContactService.updateContactStatus(rowData._id, "in-progress");
        toast.info("Contact status updated to In Progress");
        
        // Update the local data state to reflect the change
        setData((prevData) =>
          prevData.map((contact) =>
            contact._id === rowData._id
              ? { ...contact, status: "in-progress" }
              : contact
          )
        );
        
        // Update the selected row data as well
        setSelectedRowData({ ...rowData, status: "in-progress" });
      } catch (error) {
        console.error("Error updating contact status:", error);
        toast.error("Failed to update contact status");
      }
    }
  }, []);

  const handleDelete = useCallback((rowData: Contact) => {
    console.log("Delete clicked for:", rowData); // Debug log
    setSelectedRowData(rowData);
    setIsModalOpen((prev) => ({ ...prev, isDeleteModalOpen: true }));
  }, []);

  const handleDeleteContact = async () => {
    try {
      if (selectedRowData) {
        await ContactService.deleteContact(selectedRowData._id);
        toast.success("Contact deleted successfully.");
        handleOpenModal("isDeleteModalOpen", false);
        setLoading(true);
      }
    } catch (error) {
      console.error("Error deleting the contact:", error);
      toast.error("Failed to delete the contact.");
    }
  };

  // Fetch contacts - removed searchTerm from dependencies
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const response = await ContactService.getContacts({
          page: pageIndex + 1,
          limit: pageSize,
        });

        if (response.success && response.data) {
          if (isDashboard && response.data.length > 5) {
            setData(response.data.slice(0, 5));
          } else {
            setData(response.data);
          }
        } else {
          setData([]);
        }
      } catch (error) {
        console.log("Error while getting contacts:", JSON.stringify(error));
        toast.error("Failed to fetch contacts");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [pageIndex, pageSize, isDashboard, isModalOpen.isDeleteModalOpen]); // Removed searchTerm and loading

  // Filter data based on search term using useMemo
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter(
      (contact) =>
        contact.name.toLowerCase().includes(lowerSearchTerm) ||
        contact.email.toLowerCase().includes(lowerSearchTerm) ||
        contact.subject.toLowerCase().includes(lowerSearchTerm)
    );
  }, [data, searchTerm]);

  // Check if columnsContact is defined and is an array
  if (!columnsContact || !Array.isArray(columnsContact)) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-red-500">
          Error: Columns configuration is missing or invalid
        </p>
      </div>
    );
  }

  // Memoize columns with handlers
  const columnsWithHandlers = useMemo(
    () =>
      columnsContact.map((column) => ({
        ...column,
        meta: {
          ...column.meta,
          handleView,
          handleDelete,
        },
      })),
    [columnsContact, handleView, handleDelete]
  );

  const table = useReactTable({
    data: filteredData,
    columns: columnsWithHandlers,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
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
                src={leftArrow}
                alt="Icon"
                className="w-6 h-6"
              />
              <h2 className="text-xl font-semibold">Contact Inquiries</h2>
            </div>
            <div className="flex items-center space-x-2 w-full max-w-sm">
              <input
                type="text"
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded border"
              />
            </div>
          </div>
        )}

        {/* Show loading spinner while loading */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
                      <TableCell className="p-4" key={cell.id}>
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
                    colSpan={columnsContact.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

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
        <ToastContainer />
      </div>

      {/* View Contact Modal */}
      <SharedModal
        title="View Contact Details"
        cancel="Cancel"
        action="Close"
        width="calc(100vw - 420px)"
        height="calc(100vh - 130px)"
        viewAction={true}
        open={isModalOpen.isViewModalOpen}
        handleClose={() => handleOpenModal("isViewModalOpen", false)}
      >
        {selectedRowData ? (
          <ViewContact data={selectedRowData} />
        ) : (
          <div>Loading...</div>
        )}
      </SharedModal>

      {/* Delete Contact Modal */}
      <SharedModal
        title="Alert"
        cancel="Cancel"
        action="Yes"
        width="536px"
        open={isModalOpen.isDeleteModalOpen}
        handleClose={() => handleOpenModal("isDeleteModalOpen", false)}
        actionCallback={() => {
          handleDeleteContact();
        }}
        skipValidation={true}
      >
        <div className="m-[30px] mx-auto w-[300px] text-center">
          <img
            src="src/assets/images/delete.png"
            className="w-[50px] mx-auto"
            alt="Delete"
          />
          <div className="mt-5 text-xl font-ciscosans-medium">
            Do you really want to delete this contact inquiry?
          </div>
        </div>
      </SharedModal>
    </>
  );
}