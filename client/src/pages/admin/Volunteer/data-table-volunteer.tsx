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
import { Volunteer } from "./columns";
import ShareddModal from "@/components/app/common/Modal";
import VolunteerComponent from "./child/VolunteerComponent";
import {
  createVolunteer,
  deleteVolunteerById,
  getAllVolunteers,
  updateVolunteer,
} from "../Common/volunteer";
import { ToastContainer, toast } from "react-toastify";
import { view, edit, deleteIcon, plusWhite, leftArrow, arrow } from "@/utils/icons";

interface DataTableProps {
  columns: ColumnDef<Volunteer>[];
  isDashboard?: boolean;
}

export function DataTableVolunteer({
  columns,
  isDashboard = false,
}: DataTableProps) {
  const [formData, setFormData] = useState({
    personalDetails: {
      fullname: "Vaibhav",
      email: "",
      phoneNumber: "",
      location: "",
      state: "",
      city: "",
      availability: "",
    },
    skillsAndInterestsDetails: {
      interests: "",
      skills: "",
    },
    volunteerTypeDetails:{
      volunteerType: "",
      isAvailableForTravel: ""
    },
    motivationDetails: {
      reasonForJoinBanashree: "",
      objective: "",
    },
    emergencyContactDetails: {
      contactName: "",
      phoneNumber: "",
      relation: "",
    }
  });

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
  const [modalContent, setModalContent] = useState<Volunteer | null>(null);
  const [selectedRowData, setSelectedRowData] = useState<Volunteer | null>(
    null
  );

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Number of items per page
  const [data, setData] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [volunteerId, setVolunteerId] = useState("");

  const handleOpenModal = (modalType: string, isOpen: boolean) => {
    setIsModalOpen((prev) => ({ ...prev, [modalType]: isOpen }));
  };

  // const VolunteerProgram = () => {
  //   setFormData({
  //     title: "",
  //     tagline: "",
  //     detailedDescription: "",
  //     goal: "",
  //     media: null,
  //     metrics: [],
  //     projects: [],
  //   });
  // };

  const handleAddVolunteer = async (volunteerData: Volunteer) => {
    handleOpenModal("isAddModalOpen", false);
    const response = await createVolunteer(volunteerData);
    if (response) {
      toast.success("Volunteer created successfully.");
      handleOpenModal("isAddModalOpen", false);
      setLoading(false);
    } else {
      console.error("Failed to create the Volunteer.");
      toast.error("Failed to create the Volunteer.");
    }
    // const response = await createProgram(programData);
    // if (response) {
    //   toast.success("Program created successfully.");
    //   handleOpenModal("isAddModalOpen", false)
    //   setLoading(false);
    //   resetProgramForm()

    // } else {
    //   console.error("Failed to create the program.");
    //   toast.error("Failed to create the program.");
    // }
  };

  const handleEditVolunteer = async (volunteerData: Volunteer) => {
    handleOpenModal("isEditModalOpen", false);
    const response = await updateVolunteer(volunteerId, volunteerData);
    if (response) {
      toast.success("Volunteer updated successfully.");
      handleOpenModal("isEditModalOpen", false);

      setLoading(false);
    } else {
      console.error("Failed to create the Volunteer.");
      toast.error("Failed to create the Volunteer.");
    }
  };

  const handleDeleteVolunteer = async () => {
    try {
      if (volunteerId) {
        const success = await deleteVolunteerById(volunteerId);
        if (success) {
          toast.success("Volunteer deleted successfully.");
          handleOpenModal("isDeleteModalOpen", false);
          setLoading(false);
        } else {
          toast.error("Failed to delete the volunteer.");
        }
      }
    } catch (error) {
      console.error("Error deleting the volunteer:", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleView = (rowData: any) => {
    setSelectedRowData(rowData);
    setFormData(rowData);
    handleOpenModal("isViewModalOpen", true);
  };

  const handleDelete = (rowData: Volunteer) => {
    handleOpenModal("isDeleteModalOpen", true);
    setSelectedRowData(rowData);
    setVolunteerId(rowData?._id);
  };

  const handleEdit = (rowData: Volunteer) => {
    handleOpenModal("isEditModalOpen", true);
    setSelectedRowData(rowData);
    setVolunteerId(rowData?._id);
    for (const item in rowData) {
      setFormData((prevState) => ({
        ...prevState,
        [item]: rowData[item as keyof Volunteer],
      }));
    }
  };

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const volunteerList = await getAllVolunteers();
        if (isDashboard && volunteerList.length > 5) {
          const slicedvolunteerList = volunteerList.slice(0, 5);
          setData(slicedvolunteerList);
        } else {
          setData(volunteerList);
        }
      } catch (error) {
        console.log("Error while getting the error", JSON.stringify(error));
      }
    };

    fetchVolunteers();
    setLoading(false);
  }, [isModalOpen, isDashboard]);

  const table = useReactTable({
    data,
    columns: columns.map((column) => ({
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
      <div className="bg-white mt-12  rounded-md border shadow-lg">
        {!isDashboard && (
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center space-x-2">
              <img
                src={leftArrow}
                alt="Icon"
                className="w-6 h-6"
              />
              <h2 className="text-xl font-semibold">Volunteer</h2>
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
                  src={plusWhite}
                  className=" h-6 mr-2"
                />
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
        title="Add New Volunteer"
        open={isModalOpen.isAddModalOpen}
        setOpen={() => handleOpenModal("isAddModalOpen", false)}
        handleClose={() => handleOpenModal("isAddModalOpen", false)}
        action="Add"
        isValid={isFormValid}
        onSubmit={handleAddVolunteer}
        formState={formState}
      >
        <VolunteerComponent
          title="Volunteer for Banashree Foundation’s Initiatives :"
          actionType="add"
          onFormValid={setIsFormValid}
          onSubmit={handleAddVolunteer}
          setFormState={setFormState}
          defaultValues={formData}
        />
      </ShareddModal>

      <ShareddModal
        title="Edit Volunteer"
        open={isModalOpen.isEditModalOpen}
        setOpen={() => handleOpenModal("isEditModalOpen", false)}
        handleClose={() => handleOpenModal("isEditModalOpen", false)}
        action="Edit"
        isValid={isFormValid}
        onSubmit={handleEditVolunteer}
        formState={formState}
      >
        <VolunteerComponent
          title="Volunteer for Banashree Foundation :"
          actionType="edit"
          onFormValid={setIsFormValid}
          onSubmit={handleEditVolunteer}
          setFormState={setFormState}
          defaultValues={formData}
        />
      </ShareddModal>

      <ShareddModal
        title="View Volunteer Details"
        open={isModalOpen.isViewModalOpen}
        setOpen={() => handleOpenModal("isViewModalOpen", false)}
        handleClose={() => handleOpenModal("isViewModalOpen", false)}
        action="View"
        isValid={isFormValid}
        onSubmit={handleAddVolunteer}
        formState={formState}
      >
        <VolunteerComponent
          title="Volunteer for Banashree Foundation’s Initiatives :"
          actionType="view"
          onFormValid={setIsFormValid}
          onSubmit={handleAddVolunteer}
          setFormState={setFormState}
          defaultValues={formData}
        />
      </ShareddModal>

      <ShareddModal
        title="View Volunteer Details"
        open={isModalOpen.isDeleteModalOpen}
        setOpen={() => handleOpenModal("isDeleteModalOpen", false)}
        handleClose={() => handleOpenModal("isDeleteModalOpen", false)}
        action="Delete"
        isValid={isFormValid}
        onSubmit={handleDeleteVolunteer}
        formState={formState}
      >
        <div className="m-[30px] mx-auto w-[300px] text-center">
          <img
            src="src/assets/images/delete.png"
            className="w-[50px] mx-auto"
          />
          <div className="mt-5 text-xl font-ciscosans-medium">
            Do you really want to delete this Volunteer?
          </div>
        </div>
      </ShareddModal>
    </>
  );
}
