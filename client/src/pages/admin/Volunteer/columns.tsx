"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

type PersonalDetails = {
  fullname: string;
  email: string;
  phoneNumber: string;
  location: string;
  city: string;
  state: string;
  availability: string;
};

type InterestsAndSkillsDetails = {
  interests: string;
  skills: string;
};

type volunteerTypeDetails = {
  volunteerType: string;
  isAvailableForTravel: string;
};

type motivationDetails = {
  reasonForJoinBanashree: string;
  objective: string;
};

type emergencyContactDetails = {
  contactName: string;
  phoneNumber: string;
  relation: string;
};

export type Volunteer = {
  _id: string;
  personalDetails: PersonalDetails;
  skillsAndInterestsDetails: InterestsAndSkillsDetails;
  volunteerTypeDetails: volunteerTypeDetails;
  motivationDetails: motivationDetails;
  emergencyContactDetails: emergencyContactDetails;
};

// Define a meta type for action handlers
interface ColumnMeta {
  handleView: (rowData: Volunteer) => void;
  handleDelete: (rowData: Volunteer) => void;
  handleEdit: (rowData: Volunteer) => void;
}

const columns: ColumnDef<Volunteer, unknown>[] = [
  {
    accessorKey: "personalDetails.fullname",
    header: "Full Name",
  },
  {
    accessorKey: "personalDetails.email",
    header: ({ column }) => (
      <Button
        className="tableheadings"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email Address
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "personalDetails.phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "personalDetails.location",
    header: "Location",
  },
  {
    accessorKey: "personalDetails.availability",
    header: "Active",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, column }) => {
      const { handleView, handleDelete, handleEdit } = column.columnDef
        .meta as ColumnMeta; // Use type assertion

      return (
        <div className="flex space-x-2">
          <img
            className="h-4 w-5"
            src="../src/assets/images/view.png"
            onClick={() => handleView(row.original)}
          ></img>
          <img
            className="h-4 w-4"
            src="../src/assets/images/edit.png"
            onClick={() => handleEdit(row.original)}
          ></img>
          <img
            className="h-4 w-4"
            src="../src/assets/images/delete.png"
            onClick={() => handleDelete(row.original)}
          ></img>
        </div>
      );
    },
  },
];

export default columns;
