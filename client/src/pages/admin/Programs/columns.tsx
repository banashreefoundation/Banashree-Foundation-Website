"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { view, edit, deleteIcon } from "@/utils/icons";

export type Programs = {
  goals: any;
  media: null;
  metrics: [string];
  endorsement: string;
  projects: never[];
  _id: string;
  title: string;
  tagline: string;
  detailedDescription: string;
};

// Define a meta type for action handlers
interface ColumnMeta {
  handleView: (rowData: Programs) => void;
  handleDelete: (rowData: Programs) => void;
  handleEdit: (RowData: Programs) => void;
}

const columnsPro: ColumnDef<Programs, unknown>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        className="tableheadings"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Program Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "tagline",
    header: "Tagline",
  },
  {
    accessorKey: "detailedDescription",
    header: "Description",
  },
  {
    accessorKey: "goals",
    header: "Goals",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, column }) => {
      const { handleView, handleDelete, handleEdit } = column.columnDef
        .meta as ColumnMeta;
      return (
        <div className="flex space-x-2">
          <img
            className="h-4 w-5"
            src={view}
            onClick={() => handleView(row.original)}
            alt="View"
          />
          <img
            className="h-4 w-4"
            src={edit}
            onClick={() => handleEdit(row.original)}
            alt="Edit"
          />
          <img
            className="h-4 w-4"
            src={deleteIcon}
            onClick={() => handleDelete(row.original)}
            alt="Delete"
          />
        </div>
      );
    },
  },
];

export default columnsPro;
