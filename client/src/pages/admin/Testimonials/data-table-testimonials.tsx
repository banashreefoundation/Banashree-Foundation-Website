/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useEffect, useState } from "react";
import { Testimonial } from "./columns";
import ShareddModal from "@/components/app/common/Modal";
import { ToastContainer, toast } from "react-toastify";
import TestimonialComponent from "./child/TestimonialComponent";
import { plusWhite, leftArrow, deleteIcon as deleteIconImage } from "@/utils/icons";
import {
  createTestimonial,
  deleteTestimonialById,
  getAllTestimonials,
  updateTestimonial,
  publishTestimonial,
  unpublishTestimonial,
} from "../Common/testimonials";

interface DataTableProps {
  columns: ColumnDef<Testimonial>[];
  isDashboard?: boolean;
}

export function DataTableTestimonials({
  columns,
  isDashboard = false,
}: DataTableProps) {
  const testimonialDefaultVal: Partial<Testimonial> = {
    name: "",
    designation: "",
    message: "",
    status: "pending" as const,
    order: 0,
  };

  const [formData, setFormData] = useState<Partial<Testimonial>>(testimonialDefaultVal);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formState, setFormState] = useState<{
    isValid: boolean;
    handleSubmit: any;
  }>({
    isValid: false,
    handleSubmit: () => {},
  });

  const [sorting, setSorting] = useState<SortingState>([]);

  const [isModalOpen, setIsModalOpen] = useState({
    isAddModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    isViewModalOpen: false,
  });

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [data, setData] = useState<Testimonial[]>([]);
  const [testimonialId, setTestimonialId] = useState("");

  const handleOpenModal = (modalType: string, isOpen: boolean) => {
    if (modalType === "isAddModalOpen" && isOpen) {
      setFormData(testimonialDefaultVal);
    }
    setIsModalOpen((prev) => ({ ...prev, [modalType]: isOpen }));
  };

  const handleAddTestimonial = async (testimonialData: Testimonial) => {
    const response = await createTestimonial(testimonialData);
    if (response) {
      toast.success("Testimonial created successfully.");
      handleOpenModal("isAddModalOpen", false);
      // Refresh data
      fetchTestimonials();
    } else {
      console.error("Failed to create the Testimonial.");
      toast.error("Failed to create the Testimonial.");
    }
  };

  const handleEditTestimonial = async (testimonialData: Testimonial) => {
    const response = await updateTestimonial(testimonialId, testimonialData);
    if (response) {
      toast.success("Testimonial updated successfully.");
      handleOpenModal("isEditModalOpen", false);
      fetchTestimonials();
    } else {
      console.error("Failed to update the Testimonial.");
      toast.error("Failed to update the Testimonial.");
    }
  };

  const handleDeleteTestimonial = async () => {
    try {
      if (testimonialId) {
        const success = await deleteTestimonialById(testimonialId);
        if (success) {
          toast.success("Testimonial deleted successfully.");
          handleOpenModal("isDeleteModalOpen", false);
          fetchTestimonials();
        } else {
          toast.error("Failed to delete the testimonial.");
        }
      }
    } catch (error) {
      console.error("Error deleting the testimonial:", error);
    }
  };

  const handleView = (rowData: any) => {
    setFormData(rowData);
    handleOpenModal("isViewModalOpen", true);
  };

  const handleDelete = (rowData: Testimonial) => {
    handleOpenModal("isDeleteModalOpen", true);
    setTestimonialId(rowData?._id);
  };

  const handleEdit = (rowData: Testimonial) => {
    handleOpenModal("isEditModalOpen", true);
    setTestimonialId(rowData?._id);
    setFormData(rowData);
  };

  const handleTogglePublish = async (rowData: Testimonial) => {
    const id = rowData._id;
    const isPublished = rowData.isPublished;

    try {
      let response;
      if (isPublished) {
        response = await unpublishTestimonial(id);
        if (response) {
          toast.success("Testimonial unpublished successfully.");
        }
      } else {
        response = await publishTestimonial(id);
        if (response) {
          toast.success("Testimonial published successfully.");
        }
      }

      if (response) {
        fetchTestimonials();
      } else {
        toast.error("Failed to update testimonial publish status.");
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("Failed to update testimonial publish status.");
    }
  };

  const fetchTestimonials = async () => {
    try {
      console.log('Fetching testimonials...');
      const testimonialList = await getAllTestimonials();
      console.log('Testimonials received:', testimonialList);
      if (isDashboard && testimonialList.length > 5) {
        const slicedTestimonialList = testimonialList.slice(0, 5);
        setData(slicedTestimonialList);
      } else {
        setData(testimonialList);
      }
    } catch (error) {
      console.error("Error while getting testimonials:", error);
      toast.error("Failed to load testimonials.");
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [isModalOpen, isDashboard]);

  const table = useReactTable({
    data,
    columns: columns.map((column) => ({
      ...column,
      meta: { handleView, handleDelete, handleEdit, handleTogglePublish },
    })),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const nextState = updater({ pageIndex, pageSize });
        setPageIndex(nextState.pageIndex);
        setPageSize(nextState.pageSize);
      }
    },
  });

  return (
    <>
      <div className="bg-white mt-12 rounded-md border shadow-lg">
        {!isDashboard && (
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center space-x-2">
              <img src={leftArrow} alt="Icon" className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Testimonials</h2>
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
                <img src={plusWhite} className="h-6 mr-2" />
                Add New
              </button>
            </div>
          </div>
        )}
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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

      <ShareddModal
        title="Add New Testimonial"
        open={isModalOpen.isAddModalOpen}
        setOpen={() => handleOpenModal("isAddModalOpen", false)}
        handleClose={() => handleOpenModal("isAddModalOpen", false)}
        action="Add"
        isValid={isFormValid}
        onSubmit={handleAddTestimonial}
        formState={formState}
      >
        <TestimonialComponent
          title="Add Testimonial for Banashree Foundation:"
          actionType="add"
          onFormValid={setIsFormValid}
          onSubmit={handleAddTestimonial}
          setFormState={setFormState}
          defaultValues={formData}
        />
      </ShareddModal>

      <ShareddModal
        title="Edit Testimonial"
        open={isModalOpen.isEditModalOpen}
        setOpen={() => handleOpenModal("isEditModalOpen", false)}
        handleClose={() => handleOpenModal("isEditModalOpen", false)}
        action="Edit"
        isValid={isFormValid}
        onSubmit={handleEditTestimonial}
        formState={formState}
      >
        <TestimonialComponent
          title="Edit Testimonial for Banashree Foundation:"
          actionType="edit"
          onFormValid={setIsFormValid}
          onSubmit={handleEditTestimonial}
          setFormState={setFormState}
          defaultValues={formData}
        />
      </ShareddModal>

      <ShareddModal
        title="View Testimonial Details"
        open={isModalOpen.isViewModalOpen}
        setOpen={() => handleOpenModal("isViewModalOpen", false)}
        handleClose={() => handleOpenModal("isViewModalOpen", false)}
        action="View"
        isValid={isFormValid}
        onSubmit={handleAddTestimonial}
        formState={formState}
      >
        <TestimonialComponent
          title="Testimonial Details:"
          actionType="view"
          onFormValid={setIsFormValid}
          onSubmit={handleAddTestimonial}
          setFormState={setFormState}
          defaultValues={formData}
        />
      </ShareddModal>

      <ShareddModal
        title="Delete Testimonial"
        open={isModalOpen.isDeleteModalOpen}
        setOpen={() => handleOpenModal("isDeleteModalOpen", false)}
        handleClose={() => handleOpenModal("isDeleteModalOpen", false)}
        action="Delete"
        isValid={isFormValid}
        onSubmit={handleDeleteTestimonial}
        formState={formState}
      >
        <div className="m-[30px] mx-auto w-[300px] text-center">
          <img src={deleteIconImage} className="w-[50px] mx-auto" />
          <div className="mt-5 text-xl font-ciscosans-medium">
            Do you really want to delete this Testimonial?
          </div>
        </div>
      </ShareddModal>
    </>
  );
}
