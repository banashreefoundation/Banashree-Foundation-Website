import { Projects } from "../Projects/columns";
const baseUrl ="http://localhost:4001/api/v1/";



interface createProject {
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
}


export async function createProject(projectData: createProject): Promise<createProject | null> {
  try {
    const response = await fetch(baseUrl+"projects", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(projectData), 
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`); 
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating project:", error);
    return null; 
  }
}

export async function getAllProjects(limit?: number): Promise<Projects[]> {
  try {
    const response = await fetch(`${baseUrl}/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok){
      const projectData = await response.json();
      const data: Projects[] = projectData.data;
      return limit ? data.slice(0, limit) : data;
    } else{
      console.log(`Failed to fetch projects. Status:${response.status}`)
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return []
  }
}

export async function updateProject(id: string,projectData: createProject): Promise<createProject | null> {
  try {
    const response = await fetch(baseUrl+`/projects/${id}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(projectData), 
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`); 
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating project:", error);
    return null; 
  }
}

export async function getProjectById(id: string): Promise<Projects | null> {
  try {
    const response = await fetch(`${baseUrl}/projects/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

export async function deleteProjectById(id: string): Promise<boolean> {
 try{
  const response = await fetch(`${baseUrl}projects/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    // console.log(`Deleted program with ID: ${id}`);
    return true;
  } else {
    console.error(
      `Failed to delete the project. Status: ${response.status}`
    );
    return false;
  }
 }
 catch(error){
  console.error("Error deleting project:", error);
  return false;
 }
}


