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
import { useState, useEffect } from "react";
import SharedModal from "@/components/ui/modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createProgram,
  deleteProgramById,
  getAllPrograms,
  updateProgram,
} from "../Common/dataFetchFunctions";
import AddProgram from "./AddProgram";
import ViewProgram from "./ViewProgram";
import { Programs } from "./columns";

// Shared component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
  </div>
);

interface DataTableProps {
  columnsPro: ColumnDef<Programs>[];
  isDashboard?: boolean;
}

export function DataTablePrograms({
  columnsPro,
  isDashboard = false,
}: DataTableProps) {
  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    detailedDescription: "",
    goals: "",
    media: null,
    metrics: [],
    endorsement: "",
    projects: [],
  });

  const [isModalOpen, setIsModalOpen] = useState({
    isAddModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    isViewModalOpen: false,
  });

  const [data, setData] = useState<Programs[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(true);
  const [selectedRowData, setSelectedRowData] = useState<Programs>();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (modalType: string, isOpen: boolean) => {
    setIsModalOpen((prev) => ({ ...prev, [modalType]: isOpen }));
  };

  const resetProgramForm = () => {
    setFormData({
      title: "",
      tagline: "",
      detailedDescription: "",
      goals: "",
      media: null,
      metrics: [],
      endorsement: "",
      projects: [],
    });
    setErrors({}); // Reset errors as well
  };

  const handleView = (rowData: Programs) => {
    setSelectedRowData(rowData);
    handleOpenModal("isViewModalOpen", true);
  };

  const handleDelete = (rowData: Programs) => {
    handleOpenModal("isDeleteModalOpen", true);
    setSelectedRowData(rowData);
  };

  const handleEdit = (rowData: Programs) => {
    handleOpenModal("isEditModalOpen", true);
    setSelectedRowData(rowData);
    setFormData({
      title: rowData.title || "",
      tagline: rowData.tagline || "",
      detailedDescription: rowData.detailedDescription || "",
      goals: rowData.goals ? rowData.goals.join(", ") : "",
      media: rowData.media || null,
      metrics: rowData.metrics || [],
      endorsement: rowData.endorsement || "",
      projects: rowData.projects || [],
    });
  };

  const handleDeleteProgram = async () => {
    try {
      if (selectedRowData) {
        const success = await deleteProgramById(selectedRowData["_id"]);
        if (success) {
          toast.success("Program deleted successfully.");
          setLoading(false);
        } else {
          toast.error("Failed to delete the program.");
        }
      }
    } catch (error) {
      console.error("Error deleting the program:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.tagline.trim()) {
      newErrors.tagline = "Tag Line is required";
    }
    if (!formData.detailedDescription.trim()) {
      newErrors.detailedDescription = "Description is required";
    }
    if (!formData.metrics) {
      newErrors.metrics = "Metrics are required.";
    }
    if (typeof formData.goals === "string" && formData.goals.trim() === "") {
      newErrors.goals = "Goals are required.";
    } else if (Array.isArray(formData.goals)) {
      newErrors.goals = "Goals are required.";
    }
    setErrors(newErrors); // Update the error state
    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };

  const handleAddProgram = async (programData: any) => {
    const response = await createProgram(programData);
    if (response) {
      toast.success("Program created successfully.");
      handleOpenModal("isAddModalOpen", false);
      setLoading(false);
      resetProgramForm();
    } else {
      console.error("Failed to create the program.");
      toast.error("Failed to create the program.");
    }
  };

  const handleEditProgram = async (programData: any) => {
    setIsSubmitting(true);
    if (validateForm()) {
      const response = await updateProgram(selectedRowData["_id"], programData);
      if (response) {
        toast.success("Program updated successfully.");
        handleOpenModal("isEditModalOpen", false);
        resetProgramForm();
      } else {
        toast.error("Failed to update the program.");
      }
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const programList = await getAllPrograms();
        if (isDashboard && programList.length > 5) {
          const slicedprogramList = programList.slice(0, 5);
          setData(slicedprogramList);
        } else {
          setData(programList);
        }
      } catch (error) {
        console.log("Error while getting the error", JSON.stringify(error));
      }finally {
        setLoading(false); 
      }
    };

    fetchProgram();
    setLoading(false);
  }, [isModalOpen, isDashboard]);

  // Reset form when opening Add or Edit Modals
  useEffect(() => {
    if (isModalOpen.isAddModalOpen) {
      resetProgramForm();
    }
    if (isModalOpen.isEditModalOpen) {
      setErrors({});
      // here we can populate data for editing, this will be done in handleEdit
    }
  }, [isModalOpen.isAddModalOpen, isModalOpen.isEditModalOpen]);

  const table = useReactTable({
    data,
    columns: columnsPro.map((column) => ({
      ...column,
      meta: { handleView, handleDelete, handleEdit }, // Set meta for every column
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
              <h2 className="text-xl font-semibold">Programs</h2>
            </div>
            <div className="flex items-center space-x-2 w-full max-w-sm">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 rounded border"
              />
              <button
                className="flex items-center justify-center py-2 text-white rounded px-4 w-full btn"
                onClick={() => handleOpenModal("isAddModalOpen", true)}
              >
                <img
                  src="../src/assets/images/plus-white.png"
                  className="w-6 h-6 mr-2"
                />
                Add New
              </button>
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
                    colSpan={columnsPro.length}
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

      <SharedModal
        title="View Program Details"
        cancel="Cancel"
        action="Add"
        width="calc(100vw - 420px)"
        height="calc(100vh - 130px)"
        viewAction={true}
        open={isModalOpen.isViewModalOpen}
        handleClose={() => handleOpenModal("isViewModalOpen", false)}
      >
        <ViewProgram data={selectedRowData} />
      </SharedModal>

      <SharedModal
        title="Add New Programs"
        cancel="Cancel"
        width="calc(100vw - 420px)"
        height="calc(100vh - 130px)"
        action="Add"
        open={isModalOpen.isAddModalOpen}
        handleClose={() => handleOpenModal("isAddModalOpen", false)}
        actionCallback={() => {
          handleAddProgram(formData); // Make sure this uses the form data from AddProgram
        }}
        validateForm={validateForm} // Pass the validation function
      >
        <AddProgram
          title="For add new Initiative please fill the below fields:"
          formData={formData}
          setFormData={setFormData}
          errors={errors} // Pass errors to the AddProgram component
          setErrors={setErrors}
        />
      </SharedModal>

      <SharedModal
        title="Edit New Programs"
        cancel="Cancel"
        width="calc(100vw - 420px)"
        height="calc(100vh - 130px)"
        action="Update"
        open={isModalOpen.isEditModalOpen}
        handleClose={() => handleOpenModal("isEditModalOpen", false)}
        actionCallback={() => {
          handleEditProgram(formData);
        }}
        validateForm={validateForm}
      >
        <AddProgram
          title="For update existing Initiative please edit the below fields:"
          formData={formData}
          setFormData={setFormData}
          errors={errors} // Pass errors to the AddProgram component
          setErrors={setErrors}
        />
      </SharedModal>

      <SharedModal
        title="Alert"
        cancel="Cancel"
        action="Yes"
        width="536px"
        open={isModalOpen.isDeleteModalOpen}
        handleClose={() => handleOpenModal("isDeleteModalOpen", false)}
        actionCallback={() => {
          handleDeleteProgram();
        }}
        skipValidation={true} // Skip validation for delete action
      >
        <div className="m-[30px] mx-auto w-[300px] text-center">
          <img
            src="src/assets/images/delete.png"
            className="w-[50px] mx-auto"
          />
          <div className="mt-5 text-xl font-ciscosans-medium">
            Do you really want to delete this Program?
          </div>
        </div>
      </SharedModal>
    </>
  );
}
