"use client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { view, edit, deleteIcon } from "@/utils/icons";

export type Testimonial = {
  _id: string;
  name: string;
  designation: string;
  message: string;
  image?: string;
  status: "pending" | "approved" | "rejected";
  isPublished: boolean;
  publishedAt?: Date;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
};

interface ColumnMeta {
  handleView: (rowData: Testimonial) => void;
  handleDelete: (rowData: Testimonial) => void;
  handleEdit: (rowData: Testimonial) => void;
  handleTogglePublish?: (rowData: Testimonial) => void;
}

const columnsTestimonial: ColumnDef<Testimonial, unknown>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.original.image;
      const baseUrl = "http://localhost:4001"; // Server base URL
      return image ? (
        <img
          src={`${baseUrl}${image}`}
          alt={row.original.name}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e: any) => {
            e.target.style.display = "none";
          }}
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
          No Img
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "designation",
    header: "Designation",
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const message = row.original.message;
      return (
        <div className="max-w-xs truncate" title={message}>
          {message.length > 80 ? `${message.substring(0, 80)}...` : message}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        approved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
  {
    accessorFn: (row) =>
      row.createdAt ? format(new Date(row.createdAt), "dd-MMM-yyyy") : "-",
    header: "Created Date",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, column }) => {
      const { handleView, handleDelete, handleEdit, handleTogglePublish } =
        column.columnDef.meta as ColumnMeta;

      const [published, setPublished] = useState(
        row.original.isPublished || false
      );

      // Sync state with row data when it changes
      useEffect(() => {
        setPublished(row.original.isPublished || false);
      }, [row.original.isPublished]);

      const toggleHandler = () => {
        // Don't update local state here - let the data refresh handle it
        handleTogglePublish?.(row.original);
      };

      return (
        <div className="flex items-center space-x-2">
          <img
            className="h-4 w-5 cursor-pointer"
            src={view}
            alt="View"
            onClick={() => handleView(row.original)}
            title="View Testimonial"
          />
          <img
            className="h-4 w-4 cursor-pointer"
            src={edit}
            alt="Edit"
            onClick={() => handleEdit(row.original)}
            title="Edit Testimonial"
          />
          <img
            className="h-4 w-4 cursor-pointer"
            src={deleteIcon}
            alt="Delete"
            onClick={() => handleDelete(row.original)}
            title="Delete Testimonial"
          />

          {/* Toggle Switch for Published/Unpublished */}
          {row.original.status === "approved" && (
            <button
              onClick={toggleHandler}
              title={published ? "Unpublish Testimonial" : "Publish Testimonial"}
              className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${
                published ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  published ? "translate-x-5" : ""
                }`}
              />
            </button>
          )}
        </div>
      );
    },
  },
];

export default columnsTestimonial;
