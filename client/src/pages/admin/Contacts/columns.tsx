"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Contact } from "@/types/contact.types"; // Import from shared types

// Define a meta type for action handlers
interface ColumnMeta {
  handleView: (rowData: Contact) => void;
  handleDelete: (rowData: Contact) => void;
}

const columnsContact: ColumnDef<Contact, unknown>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        className="tableheadings"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        className="tableheadings"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string | undefined;
      return phone || "N/A";
    },
  },
  {
    accessorKey: "inquiryType",
    header: ({ column }) => (
      <Button
        className="tableheadings"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("inquiryType") as string;
      const typeLabels: { [key: string]: string } = {
        general: "General",
        partnership: "Partnership",
        volunteer: "Volunteer",
        donation: "Donation",
        other: "Other",
      };
      return <span>{typeLabels[type] || type}</span>;
    },
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => {
      const subject = row.getValue("subject") as string;
      return (
        <div className="max-w-[200px] truncate" title={subject}>
          {subject}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        className="tableheadings"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig: {
        [key: string]: { color: string; label: string };
      } = {
        new: { color: "bg-blue-100 text-blue-800", label: "NEW" },
        "in-progress": {
          color: "bg-yellow-100 text-yellow-800",
          label: "IN PROGRESS",
        },
        resolved: { color: "bg-green-100 text-green-800", label: "RESOLVED" },
        closed: { color: "bg-gray-100 text-gray-800", label: "CLOSED" },
      };
      const config = statusConfig[status] || {
        color: "bg-gray-100 text-gray-800",
        label: status.toUpperCase(),
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}
        >
          {config.label}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        className="tableheadings"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="flex flex-col">
          <span className="text-sm">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="text-xs text-gray-500">
            {date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, column }) => {
      const { handleView, handleDelete } = column.columnDef
        .meta as ColumnMeta;
      return (
        <div className="flex space-x-2">
          <img
            className="h-4 w-5 cursor-pointer hover:opacity-75"
            src="../src/assets/images/view.png"
            alt="View"
            title="View Details"
            onClick={() => handleView(row.original)}
          />
          <img
            className="h-4 w-4 cursor-pointer hover:opacity-75"
            src="../src/assets/images/delete.png"
            alt="Delete"
            title="Delete Contact"
            onClick={() => handleDelete(row.original)}
          />
        </div>
      );
    },
  },
];

export default columnsContact;
export type { Contact }; // Re-export for convenience