"use client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";
import { view, edit, deleteIcon } from "@/utils/icons";

export type Event = {
  _id: string;
  title: string;
  description: string;
  startDateTime: Date;
  endDateTime: Date;
  venue: string;
  focusAreas: string;
  program?: string;
  targetAudience: string;
  objectives: string;
  impact: string;
  donateOption: boolean;
  pocDetails: string;
  isEventEnabled?: boolean; // optional new key
};

interface ColumnMeta {
  handleView: (rowData: Event) => void;
  handleDelete: (rowData: Event) => void;
  handleEdit: (rowData: Event) => void;
  handleToggle?: (rowData: Event, enabled: boolean) => void;
}

const columnsEvent: ColumnDef<Event, unknown>[] = [
  {
    accessorKey: "title",
    header: "Event Name",
  },
  {
    accessorFn: (row) => `${format(row.startDateTime, "dd-MMM-yyyy hh:mm aa")}`,
    header: "Start Date and Time",
  },
  {
    accessorFn: (row) => `${format(row.endDateTime, "dd-MMM-yyyy hh:mm aa")}`,
    header: "End Date and Time",
  },
  {
    accessorKey: "venue",
    header: "Venue",
  },
  {
    accessorKey: "description",
    header: "Event Description",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, column }) => {
      const { handleView, handleDelete, handleEdit, handleToggle } =
        column.columnDef.meta as ColumnMeta;

      //Default ON (true) if not explicitly set
      const [enabled, setEnabled] = useState(
        row.original.isEventEnabled !== undefined
          ? row.original.isEventEnabled
          : true
      );

      // Ensure default value persists in the data object too
      if (row.original.isEventEnabled === undefined) {
        row.original.isEventEnabled = true;
      }

      const toggleHandler = () => {
        const newValue = !enabled;
        setEnabled(newValue);

        // Update the row data object
        row.original.isEventEnabled = newValue;

        // Optional: notify parent or backend
        handleToggle?.(row.original, newValue);
      };

      return (
        <div className="flex items-center space-x-2">
          <img
            className="h-4 w-5 cursor-pointer"
            src={view} alt="View"
            onClick={() => handleView(row.original)}
            alt="View"
            title="View Event"
          />
          <img
            className="h-4 w-4 cursor-pointer"
            src={edit} alt="Edit"
            onClick={() => handleEdit(row.original)}
            alt="Edit"
            title="Edit Event"
          />
          <img
            className="h-4 w-4 cursor-pointer"
            src={deleteIcon} alt="Delete"
            onClick={() => handleDelete(row.original)}
            alt="Delete"
            title="Delete Event"
          />

          {/* Toggle Switch with hover title */}
          <button
            onClick={toggleHandler}
            title={enabled ? "Disable Event" : "Enable Event"}
            className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${
              enabled ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                enabled ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
      );
    },
  },
];

export default columnsEvent;
