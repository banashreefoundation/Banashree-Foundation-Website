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
import { useState, useEffect } from "react";
import SharedModal from "@/components/ui/modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  createCampaign,
  deleteCampaignById,
  getAllCampaigns,
  getAllPrograms,
  getProjectById,
} from "../Common/dataFetchFunctions";

import AddCampaign from "./AddCampaign";
import { Campaigns } from "./columns";

/* ---------------- Loading ---------------- */
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
  </div>
);

interface DataTableProps {
  columnsCamp: ColumnDef<Campaigns>[];
  isDashboard?: boolean;
}

export function DataTableCampaigns({
  columnsCamp,
  isDashboard = false,
}: DataTableProps) {
  /* ================= FORM DATA ================= */
  const [formData, setFormData] = useState({
    campaignName: "",
    tagline: "",
    program: "",
    project: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    description: "",
    goal: "",
    story: "",
    breakdown: "",
    impact: "",
    timeline: "",
    beneficiary: "",
    campaignUpdates: "",
    ctaName: "Donate",
    ctaLink: "",
    socialShare: "",
    taxBenefit: "",
    panName: "",
    panNumber: "",
    address: "",
    endorsement: "",
  });

  /* ================= DROPDOWN DATA ================= */
  const [programs, setPrograms] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  const [errors, setErrors] = useState<any>({});
  const [data, setData] = useState<Campaigns[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(true);
  const [selectedRowData, setSelectedRowData] = useState<Campaigns>();

  const [isModalOpen, setIsModalOpen] = useState({
    isAddModalOpen: false,
    isDeleteModalOpen: false,
  });

  const handleOpenModal = (modalType: string, isOpen: boolean) => {
    setIsModalOpen((prev) => ({ ...prev, [modalType]: isOpen }));
  };

  /* ================= RESET FORM ================= */
  const resetProgramForm = () => {
    setFormData({
      campaignName: "",
      tagline: "",
      program: "",
      project: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      description: "",
      goal: "",
      story: "",
      breakdown: "",
      impact: "",
      timeline: "",
      beneficiary: "",
      campaignUpdates: "",
      ctaName: "Donate",
      ctaLink: "",
      socialShare: "",
      taxBenefit: "",
      panName: "",
      panNumber: "",
      address: "",
      endorsement: "",
    });
    setProjects([]);
    setErrors({});
  };

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.campaignName.trim())
      newErrors.campaignName = "Campaign Name is required";
    if (!formData.tagline.trim())
      newErrors.tagline = "Tag Line is required";
    if (!formData.program)
      newErrors.program = "Program is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.goal.trim())
      newErrors.goal = "Goal is required";
    if (!formData.ctaLink.trim())
      newErrors.ctaLink = "CTA Link is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= FETCH PROGRAMS ================= */
  useEffect(() => {
    const fetchPrograms = async () => {
      if (!isModalOpen.isAddModalOpen) return;

      try {
        const res = await getAllPrograms();
        setPrograms(res || []);
      } catch (err) {
        console.error("Error fetching programs", err);
      }
    };

    fetchPrograms();
  }, [isModalOpen.isAddModalOpen]);

  /* ================= FETCH PROJECTS (ON PROGRAM CHANGE) ================= */
  useEffect(() => {
    const fetchProjects = async () => {
      if (!formData.program) {
        setProjects([]);
        return;
      }

      try {
        const res = await getProjectById(formData.program);

        if (!res || res.length === 0) {
          setProjects([]);
          toast.error("No projects available for the selected program");
          return;
        }

        setProjects(res);
      } catch (err) {
        setProjects([]);
        toast.error("Failed to load projects for selected program");
        console.error("Error fetching projects", err);
      }
    };

    fetchProjects();
  }, [formData.program]);

  /* ================= ADD CAMPAIGN ================= */
  const handleAddCampaign = async (data: any) => {
    if (!validateForm()) return;

    const payload = {
      title: data.campaignName,
      tagline: data.tagline,
      program: data.program,
      project: data.project,
      detailedDescription: data.description,
      goals: data.goal,
      story: data.story,
      breakdown: data.breakdown,
      impact: data.impact,
      timeline: data.timeline,
      beneficiary: data.beneficiary,
      campaignUpdates: data.campaignUpdates,
      cta: {
        name: data.ctaName,
        link: data.ctaLink,
      },
      socialShare: data.socialShare === "yes",
      taxBenefit: data.taxBenefit === "yes",
      panDetails:
        data.taxBenefit === "yes"
          ? {
              name: data.panName,
              number: data.panNumber,
              address: data.address,
            }
          : null,
      endorsement: data.endorsement,
    };

    const response = await createCampaign(payload);

    if (response) {
      toast.success("Campaign created successfully.");
      handleOpenModal("isAddModalOpen", false);
      resetProgramForm();
    } else {
      toast.error("Failed to create campaign.");
    }
  };

  /* ================= DELETE ================= */
  const handleDeleteProgram = async () => {
    if (!selectedRowData) return;
    await deleteCampaignById(selectedRowData["_id"]);
    toast.success("Campaign deleted successfully.");
    setLoading(false);
  };

  /* ================= FETCH CAMPAIGNS ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allCampaigns = await getAllCampaigns();
        setData(isDashboard ? allCampaigns.slice(0, 5) : allCampaigns);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isModalOpen, isDashboard]);

  /* ================= TABLE ================= */
  const table = useReactTable({
    data,
    columns: columnsCamp.map((column) => ({
      ...column,
      meta: {
        handleView: (row: Campaigns) => console.log("View", row),
        handleEdit: (row: Campaigns) => console.log("Edit", row),
        handleDelete: (row: Campaigns) => {
          setSelectedRowData(row);
          handleOpenModal("isDeleteModalOpen", true);
        },
      },
    })),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: (updater) => {
      const next = updater({ pageIndex, pageSize });
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
  });

  /* ================= RENDER ================= */
  return (
    <>
      <div className="bg-white mt-12 rounded-md border shadow-lg">

        {!isDashboard && (
          <div className="flex justify-between items-center p-4">
            <h2 className="text-xl font-semibold">Campaigns</h2>
            <button
              className="flex items-center px-4 py-2 text-white rounded btn"
              onClick={() => handleOpenModal("isAddModalOpen", true)}
            >
              + Add New
            </button>
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
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
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
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
                  <TableCell colSpan={columnsCamp.length} className="text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        <ToastContainer />
      </div>

      {/* ADD MODAL */}
      <SharedModal
        title="Add New Campaign"
        action="Add"
        cancel="Cancel"
        open={isModalOpen.isAddModalOpen}
        handleClose={() => handleOpenModal("isAddModalOpen", false)}
        actionCallback={() => handleAddCampaign(formData)}
        validateForm={validateForm}
      >
        <AddCampaign
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          programs={programs}
          projects={projects}
        />
      </SharedModal>

      {/* DELETE MODAL */}
      <SharedModal
        title="Alert"
        action="Yes"
        open={isModalOpen.isDeleteModalOpen}
        handleClose={() => handleOpenModal("isDeleteModalOpen", false)}
        actionCallback={handleDeleteProgram}
        skipValidation
      >
        <div className="text-center p-6">
          Do you really want to delete this Campaign?
        </div>
      </SharedModal>
    </>
  );
}
