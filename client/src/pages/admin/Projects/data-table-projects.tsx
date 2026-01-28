"use client";
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  // getPaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast, ToastContainer } from "react-toastify";

import { useState, useEffect } from "react";
import { Projects } from "./columns";


import ShareddModal from "@/components/app/common/Modal";
import ProjectComponent from "./child/ProjectComponent";
import {
  createProject,
  deleteProjectById,
  getAllProjects,
  getProjectById,
  updateProject,
} from "../Common/projects";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
  </div>
);

interface DataTableProps {
  columnsProjects: ColumnDef<Projects>[];
  data: Projects[];
  isDashboard?: boolean;
}

export function DataTableProjects({
  columnsProjects,
  isDashboard = false,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [formData, setFormData] = useState({
    projectName: "",
    tagLine: "",
    program: "",
    projectObjective: "",
    projectDescription: "",
    targetBeneficiaries: "",
    projectLocation: "",
    keyActivities: "",
    expectedOutcome: "",
    collaboratingPartners: "",
    metrics: "",
    endorsementAndPartnership: "",
  });

  const [isModalOpen, setIsModalOpen] = useState({
    isAddModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    isViewModalOpen: false,
  });

  const [data, setData] = useState<Projects[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowData, setSelectedRowData] = useState<Projects>();
  const [isFormValid, setIsFormValid] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [formState, setFormState] = useState<{
    isValid: boolean;
    handleSubmit: any;
  }>({
    isValid: false,
    handleSubmit: () => {},
  });

  // Pagination state
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Number of items per page
  const handleOpenModal = (modalType: string, isOpen: boolean) => {
    setIsModalOpen((prev) => ({ ...prev, [modalType]: isOpen }));
    resetProject();
  };

  const resetProject = () => {
    setFormData({
      projectName: "",
      tagLine: "",
      program: "",
      projectObjective: "",
      projectDescription: "",
      targetBeneficiaries: "",
      projectLocation: "",
      keyActivities: "",
      expectedOutcome: "",
      collaboratingPartners: "",
      metrics: "",
      endorsementAndPartnership: "",
    });
  };

  const handleEditProject = async (projectData: any) => {
    console.log(`Edited a project`);
    handleOpenModal("isEditModalOpen", false);
    const response = await updateProject(projectId, projectData);
    if (response) {
      toast.success("Project updated successfully.");
      handleOpenModal("isEditModalOpen", false);
      setLoading(false);
      resetProject();
    } else {
      console.error("Failed to update the Project.");
      toast.error("Failed to update the Project.");
    }
    // const response = await updateProject(projectData?._id, projectData);
    //     if (response) {
    //       toast.success("Project updated successfully.");
    //       handleOpenModal("isEditModalOpen", false);
    //       resetProjectForm()
    //       setLoading(false);
    //     } else {
    //       console.error("Failed to edit project.");
    //       toast.error("Failed to edit the project.");
    //     }
  };

  const handleView = (rowData: Projects) => {
    setSelectedRowData(rowData);
    handleOpenModal("isViewModalOpen", true);
  };

  const getProject = async (projectId: string) => {
    const response = await getProjectById(projectId);
    if (response) {
      return response;
    } else {
      console.error("Failed to create the Project.");
      toast.error("Failed to create the Project.");
    }
  };

  const handleEdit = async (rowData: Projects) => {
    const project = await getProject(rowData["_id"]);
    setProjectId(rowData?._id);
    setSelectedRowData(rowData);
    handleOpenModal("isEditModalOpen", true);
    setFormData(project["data"]);
  };

  const handleDelete = (rowData: Projects) => {
    handleOpenModal("isDeleteModalOpen", true);
    setSelectedRowData(rowData);
    setProjectId(rowData?._id);
  };

  const handleDeleteProject = async () => {
    try {
      if (projectId) {
        const success = await deleteProjectById(projectId);
        if (success) {
          toast.success("Project deleted successfully.");
          handleOpenModal("isDeleteModalOpen", false);
          setLoading(false);
        } else {
          toast.error("Failed to delete the volunteer.");
        }
      }
    } catch (error) {
      console.error("Error deleting the volunteer:", error);
    }
  };

  const handleClose = () => {
    console.log("Handle close");
  };

  const handleAddProject = async (projectData: any) => {
    console.table(projectData);
    handleOpenModal("isAddModalOpen", false);
    const response = await createProject(projectData);
    if (response) {
      toast.success("Project created successfully.");
      handleOpenModal("isAddModalOpen", false);
      resetProject();
      setLoading(false);
    } else {
      console.error("Failed to create the Project.");
      toast.error("Failed to create the Project.");
    }
  };

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const programList = await getAllProjects();
        console.log("fetch completed");

        if (isDashboard && programList.length > 5) {
          const slicedProjectList = programList.slice(0, 5);
          setData(slicedProjectList);
        } else {
          setData(programList);
        }
      } catch (error) {
        console.log("Error while getting the error", JSON.stringify(error));
      }
    };

    fetchProgram();
    setLoading(false);
  }, [isModalOpen, isDashboard]);

  const table = useReactTable({
    data,
    columns: columnsProjects.map((column) => ({
      ...column,
      meta: { handleView, handleEdit, handleDelete }, // Set meta for every column
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
      <div className="bg-white mt-12 rounded-md border shadow-lg">
        {!isDashboard && (
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center space-x-2">
              <img
                src="../src/assets/images/left-arrow.png"
                alt="Icon"
                className="w-6 h-6"
              />
              <h2 className="text-xl font-semibold">Projects</h2>
            </div>
            <div className="flex items-center space-x-2 w-full max-w-sm">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 rounded border"
              />
              <button
                onClick={() => handleOpenModal("isAddModalOpen", true)}
                className="flex items-center justify-center py-2 text-white rounded px-4 w-full btn"
              >
                <img
                  src="../src/assets/images/plus-white.png"
                  className="w-6 h-6 mr-2"
                />
                Add New
              </button>
            </div>
          </div>
        )}
        <div className="h-full flex flex-col">
          {/* Show loading spinner while loading */}
          {loading ? (
            <LoadingSpinner />
          ) : (
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
                      colSpan={columnsProjects.length}
                      className="h-24 text-center"
                    >
                      No Project Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

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
        </div>
        <ToastContainer />
      </div>
      {/* ADD POPUP */}
      <ShareddModal
        title="Add New Project"
        open={isModalOpen.isAddModalOpen}
        setOpen={() => handleOpenModal("isAddModalOpen", false)}
        handleClose={() => handleOpenModal("isAddModalOpen", false)}
        action="Add"
        isValid={isFormValid}
        onSubmit={handleAddProject}
        formState={formState}
      >
        <ProjectComponent
          title="Project for Banashree Foundation :"
          actionType="add"
          onFormValid={setIsFormValid}
          onSubmit={handleAddProject}
          setFormState={setFormState}
          defaultValues={formData}
        />
      </ShareddModal>

      <ShareddModal
        title="Edit Project"
        open={isModalOpen.isEditModalOpen}
        setOpen={() => handleOpenModal("isEditModalOpen", false)}
        handleClose={() => handleOpenModal("isEditModalOpen", false)}
        action="Edit"
        isValid={isFormValid}
        onSubmit={handleEditProject}
        formState={formState}
      >
        <ProjectComponent
          title="Project for Banashree Foundation :"
          actionType="edit"
          onFormValid={setIsFormValid}
          onSubmit={handleEditProject}
          setFormState={setFormState}
          defaultValues={formData}
        />
      </ShareddModal>

      <ShareddModal
        title="Delete Project Details"
        open={isModalOpen.isDeleteModalOpen}
        setOpen={() => handleOpenModal("isDeleteModalOpen", false)}
        handleClose={() => handleOpenModal("isDeleteModalOpen", false)}
        action="Delete"
        isValid={isFormValid}
        onSubmit={handleDeleteProject}
        formState={formState}
      >
        <div className="m-[30px] mx-auto w-[300px] text-center">
          <img
            src="src/assets/images/delete.png"
            className="w-[50px] mx-auto"
          />
          <div className="mt-5 text-xl font-ciscosans-medium">
            Do you really want to delete this project?
          </div>
        </div>
      </ShareddModal>
      {/* <SharedModal 
        open={isModalOpen.isAddModalOpen} 
        width="1471px"
        height="926px"
        handleClose={() => handleOpenModal("isAddModalOpen", false)}
        title="Add a new Project"
        cancel="Cancel" 
        action="Add"
        actionCallback={() => {
          handleAddProject(formData);
        }}
         >
        <AddProject
          formData={formData}
          setFormData={setFormData}
        />
      </SharedModal> */}

      {/* EDIT POPUP */}
      {/*<SharedModal
      width="1471px"
        height="926px"
        title="Edit Project"
        cancel="Cancel"
        action="Edit"
        open={isModalOpen.isEditModalOpen}
        handleClose={() => handleOpenModal("isEditModalOpen", false)}
        actionCallback={() => {
          handleEditProject(formData)
        }}
      >
        <AddProject
          formData={formData}
          setFormData={setFormData}
        />
      </SharedModal>*/}

      {/* DELETE POPUP */}
      {/* <SharedModal
        title="Alert"
        cancel="Cancel"
        action="Yes"
        width="536px"
        open={isModalOpen.isDeleteModalOpen}
        handleClose={() => handleOpenModal("isDeleteModalOpen", false)}
        actionCallback={() => {
          handleDeleteProject()
        }}
      >
        <div className="m-[30px] mx-auto w-[300px] text-center">
          <img
            src="src/assets/images/delete.png"
            className="w-[50px] mx-auto"
          />
          <div className="mt-5 text-xl font-ciscosans-medium">
            Do you really want to delete this Project?
          </div>
        </div>
      </SharedModal> */}
    </>
  );
}
