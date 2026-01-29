"use client"
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { EyeIcon , TrashIcon, PencilIcon} from '@heroicons/react/24/outline'; 
import { view, edit, deleteIcon, plusWhite, leftArrow, arrow } from "@/utils/icons";

export type Initiatives = {
  id: string;
  title: string;
  tagLine: string;
  description: string;
  goal: string;
  metrics: string;
};

// Define a meta type for action handlers
interface ColumnMeta {
  handleView: (rowData: Initiatives) => void;
  handleEdit: (rowData: Initiatives) => void;
  handleDelete: (rowData: Initiatives) => void;
}

const columnsInit: ColumnDef<Initiatives, unknown>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "tagLine",
    header: "Tag Line",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "goal",
    header: "Goal",
  },
  {
    accessorKey: "metrics",
    header: "Metrics/Statistics",
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, column }) => {
      const { handleView, handleEdit, handleDelete } = column.columnDef.meta as ColumnMeta; // Use type assertion

      return (
        <div className="flex space-x-2">
            <img className="h-4 w-5" src={view} onClick={() => handleView(row.original)} ></img>
          <img className="h-4 w-4" src={edit} onClick={() => handleView(row.original)} ></img>
          <img className="h-4 w-4" src={deleteIcon} onClick={() => handleDelete(row.original)} ></img>
        </div>
      );
    },
  },
];

export default columnsInit;
