"use client"
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { EyeIcon , TrashIcon} from '@heroicons/react/24/outline'; 

export type Projects = {
  _id: string,
  projectName: string;
  tagLine: string;
  program: string;
  projectObjective: string;
  projectDescription: string;
  targetBeneficiaries: string;
  projectLocation: string;
  keyActivities: string;
  expectedOutcome: string;
  collaboratingPartners: string;
  metrics: string;
  endorsementAndPartnership: string;
};

// Define a meta type for action handlers
interface ColumnMeta {
  handleView: (rowData: Projects) => void;
  handleEdit: (rowData: Projects) => void;
  handleDelete: (rowData: Projects) => void;
}

const columnsProjects: ColumnDef<Projects, unknown>[] = [
  {
    accessorKey: "projectName",
    header: "Project Name",
  },
  {
    accessorKey: "program",
    header: "Program Name",
  },
  {
    accessorKey: "projectObjective",
    header: "Project Objective",
  },
  // {
  //   accessorKey: "email",
  //   header: ({ column }) => (
  //     <Button className="tableheadings"
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Email
  //       <ArrowUpDown className="ml-2 h-4 w-4" />
  //     </Button>
  //   ),
  // },
  // {
  //   accessorKey: "donation",
  //   header: "Donation",
  // },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, column }) => {
      const { handleView, handleEdit, handleDelete } = column.columnDef.meta as ColumnMeta; // Use type assertion

      return (
        <div className="flex space-x-2">
        <img className="h-4 w-5" src="../src/assets/images/view.png" onClick={() => handleView(row.original)} ></img>
          <img className="h-4 w-4" src="../src/assets/images/edit.png" onClick={() => handleEdit(row.original)} ></img>
          <img className="h-4 w-4" src="../src/assets/images/delete.png" onClick={() => handleDelete(row.original)} ></img>
        </div>
      );
    },
  },
];

export default columnsProjects;
