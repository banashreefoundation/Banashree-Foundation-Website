"use client"
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { EyeIcon , TrashIcon} from '@heroicons/react/24/outline'; 

export type Campaigns = {
  _id: string;
  campaignID: string;
  title: string;
  goal: string;
  isActive: boolean;
};

// Define a meta type for action handlers
interface ColumnMeta {
  handleView: (rowData: Campaigns) => void;
  handleDelete: (rowData: Campaigns) => void;
}

const columnsCamp: ColumnDef<Campaigns, unknown>[] = [
  {
    accessorKey: "campaignID",
    header: "Id",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "goal",
    header: "Goal",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (row.original.isActive ? "Active" : "Inactive"),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, column }) => {
      const { handleView, handleDelete } = column.columnDef.meta as ColumnMeta; // Use type assertion

      return (
        <div className="flex space-x-2">
             <img className="h-4 w-5" src="../src/assets/images/view.png" onClick={() => handleView(row.original)} ></img>
          <img className="h-4 w-4" src="../src/assets/images/edit.png" onClick={() => handleView(row.original)} ></img>
          <img className="h-4 w-4" src="../src/assets/images/delete.png" onClick={() => handleDelete(row.original)} ></img>
        </div>
      );
    },
  },
];

export default columnsCamp;
