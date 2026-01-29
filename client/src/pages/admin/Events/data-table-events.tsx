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
import { Event } from "./columns";
import ShareddModal from "@/components/app/common/Modal";
import { ToastContainer, toast } from "react-toastify";
import EventComponent from "./child/EventComponent";
import { view, edit, deleteIcon, plusWhite, leftArrow, arrow } from "@/utils/icons";
import {
  createEvent,
  deleteEventById,
  getAllEvents,
  updateEvent,
} from "../Common/events";

interface DataTableProps {
  columns: ColumnDef<Event>[];
  isDashboard?: boolean;
}

export function DataTableEvents({
  columns,
  isDashboard = false,
}: DataTableProps) {

  const eventDefaultVal = {
    title: "",
    startDateTime: new Date(),
    endDateTime: new Date(),
    venue: "",
    description: "",
    focusAreas: "",
    targetAudience: "",
    objectives: "",
    impact: "",
    donateOption: false,
    pocDetails: ""
  }

  const [formData, setFormData] = useState(eventDefaultVal);

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
  const [pageSize, setPageSize] = useState(5); // Number of items per page
  const [data, setData] = useState<Event[]>([]);
  const [eventId, setEventId] = useState("");

  const handleOpenModal = (modalType: string, isOpen: boolean) => {
    if(modalType == 'isEditModalOpen'){
      setFormData(eventDefaultVal);
    }
    setIsModalOpen((prev) => ({ ...prev, [modalType]: isOpen }));
  };

  const handleAddEvent = async (eventData: Event) => {
    const response = await createEvent(eventData);
    if (response) {
      toast.success("Event created successfully.");
      handleOpenModal("isAddModalOpen", false);
    } else {
      console.error("Failed to create the Event.");
      toast.error("Failed to create the Event.");
    }
  };

  const handleEditEvent = async (eventData: Event) => {
    handleOpenModal("isEditModalOpen", false);
    const response = await updateEvent(eventId, eventData);
    if (response) {
      toast.success("Event updated successfully.");
      handleOpenModal("isEditModalOpen", false);
    } else {
      console.error("Failed to create the Event.");
      toast.error("Failed to create the Event.");
    }
  };

  const handleDeleteEvent = async () => {
    try {
      if (eventId) {
        const success = await deleteEventById(eventId);
        if (success) {
          toast.success("Event deleted successfully.");
          handleOpenModal("isDeleteModalOpen", false);
        } else {
          toast.error("Failed to delete the event.");
        }
      }
    } catch (error) {
      console.error("Error deleting the event:", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleView = (rowData: any) => {
    let viewData = {...rowData}
    viewData.startDateTime = new Date(viewData.startDateTime)
    viewData.endDateTime = new Date(viewData.endDateTime)
    setFormData(viewData);
    handleOpenModal("isViewModalOpen", true);
  };

  const handleDelete = (rowData: Event) => {
    handleOpenModal("isDeleteModalOpen", true);
    setEventId(rowData?._id);
  };

  const handleEdit = (rowData: Event) => {
    handleOpenModal("isEditModalOpen", true);
    setEventId(rowData?._id);
    let editData = {...rowData}
    editData.startDateTime = new Date(editData.startDateTime)
    editData.endDateTime = new Date(editData.endDateTime)
    for (const item in editData) {
      setFormData((prevState) => ({
        ...prevState,
        [item]: editData[item as keyof Event],
      }));
    }
  };

  const handleToggle = async (rowData: Event) => {
  const id = rowData._id; 
  let editData = { ...rowData };
  editData.startDateTime = new Date(editData.startDateTime);
  editData.endDateTime = new Date(editData.endDateTime);
  const response = await updateEvent(id, editData);
  if (response) {
    if(editData.isEventEnabled){
    toast.success("Event has been enabled successfully.");
    }else{
    toast.success("Event has been disabled successfully.");
    }
  } else {
    console.error("Failed to update the Event.");
    toast.error("Failed to update the Event.");
  }
};


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const EventList = await getAllEvents();
        if (isDashboard && EventList.length > 5) {
          const slicedEventList = EventList.slice(0, 5);
          setData(slicedEventList);
        } else {
          setData(EventList);
        }
      } catch (error) {
        console.log("Error while getting the error", JSON.stringify(error));
      }
    };
    fetchEvents();
  }, [isModalOpen, isDashboard]);

  const table = useReactTable({
    data,
    columns: columns.map((column) => ({
      ...column,
      meta: { handleView, handleDelete, handleEdit , handleToggle}, // Set meta for every column
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
              <h2 className="text-xl font-semibold">Events</h2>
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
        title="Add New Event"
        open={isModalOpen.isAddModalOpen}
        setOpen={() => handleOpenModal("isAddModalOpen", false)}
        handleClose={() => handleOpenModal("isAddModalOpen", false)}
        action="Add"
        isValid={isFormValid}
        onSubmit={handleAddEvent}
        formState={formState}
      >
        <EventComponent
          title="For the Events we can have the following fields:"
          actionType="add"
          onFormValid={setIsFormValid}
          onSubmit={handleAddEvent}
          setFormState={setFormState}
          defaultValues={formData}
        />
      </ShareddModal>

      <ShareddModal
        title="Edit Event"
        open={isModalOpen.isEditModalOpen}
        setOpen={() => handleOpenModal("isEditModalOpen", false)}
        handleClose={() => handleOpenModal("isEditModalOpen", false)}
        action="Edit"
        isValid={isFormValid}
        onSubmit={handleEditEvent}
        formState={formState}
      >
        <EventComponent
          title="Event for Banashree Foundation :"
          actionType="edit"
          onFormValid={setIsFormValid}
          onSubmit={handleEditEvent}
          setFormState={setFormState}
          defaultValues={formData}
        />
      </ShareddModal>

      <ShareddModal
        title="View Event Details"
        open={isModalOpen.isViewModalOpen}
        setOpen={() => handleOpenModal("isViewModalOpen", false)}
        handleClose={() => handleOpenModal("isViewModalOpen", false)}
        action="View"
        isValid={isFormValid}
        onSubmit={handleAddEvent}
        formState={formState}
      >
        <EventComponent
          title="Event for Banashree Foundation’s Initiatives :"
          actionType="view"
          onFormValid={setIsFormValid}
          onSubmit={handleAddEvent}
          setFormState={setFormState}
          defaultValues={formData}
        />
      </ShareddModal>

      <ShareddModal
        title="Delete Event"
        open={isModalOpen.isDeleteModalOpen}
        setOpen={() => handleOpenModal("isDeleteModalOpen", false)}
        handleClose={() => handleOpenModal("isDeleteModalOpen", false)}
        action="Delete"
        isValid={isFormValid}
        onSubmit={handleDeleteEvent}
        formState={formState}
      >
        <div className="m-[30px] mx-auto w-[300px] text-center">
          <img
            src="src/assets/images/delete.png"
            className="w-[50px] mx-auto"
          />
          <div className="mt-5 text-xl font-ciscosans-medium">
            Do you really want to delete this Event?
          </div>
        </div>
      </ShareddModal>
    </>
  );
}
