import { Campaigns, Initiatives,Projects, Volunteer } from './types';
import { Programs } from "../Programs/columns";
const baseUrl ="http://localhost:4001/api/v1/";

// Note: Currently I have added the dummy data for all the four tables, later will replace this with the actual API
// Function to get Campaigns
export async function getData(limit?: number): Promise<Campaigns[]> {

  const data: Campaigns[] = [
    { id: "1", username: "David", donation: "100", status: "Pending", email: "davis@example.com" },
    { id: "2", username: "Lisa", donation: "222", status: "Success", email: "lisa@example.com" },
    { id: "3", username: "David", donation: "100", status: "Pending", email: "davis@example.com" },
    { id: "4", username: "Lisa", donation: "222", status: "Success", email: "lisa@example.com" },
    { id: "5", username: "David", donation: "100", status: "Pending", email: "davis@example.com" },
    { id: "6", username: "Lisa", donation: "222", status: "Success", email: "lisa@example.com" },
    { id: "7", username: "David", donation: "100", status: "Pending", email: "davis@example.com" },
    { id: "8", username: "Lisa", donation: "222", status: "Success", email: "lisa@example.com" },
    { id: "9", username: "David", donation: "100", status: "Pending", email: "davis@example.com" },
    { id: "10", username: "Lisa", donation: "222", status: "Success", email: "lisa@example.com" },
    { id: "11", username: "David", donation: "100", status: "Pending", email: "davis@example.com" },
    { id: "12", username: "Lisa", donation: "222", status: "Success", email: "lisa@example.com" },
  ];
  
  // Note: For the time being, this is being handle on client side, once we have the APIs, we should get the data based on limit from the server itself.
 // If a limit is provided, return only the first 'limit' number of items
  return limit ? data.slice(0, limit) : data;
}
// Function to get Programs
export async function getAllPrograms(limit?: number): Promise<Programs[]> {
  try {
    const response = await fetch(`${baseUrl}programs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok){
      const programsData = await response.json();
      // console.log("getDataPrograms   ",data);
      const data: Programs[] = programsData.data;
      return limit ? data.slice(0, limit) : data;
    } else{
      console.log(`Failed to fetch programs. Status:${response.status}`)
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return []
  }
}


// Function to create Programs
interface createProgram {
  name: string;
  description: string;
  tagline: string;
  goals: object;
  media: object;
  metrics: Object;
  endorsement: string;
  projects: object;
}

export async function createProgram(programData: createProgram): Promise<createProgram | null> {
  try {
    const response = await fetch(baseUrl+"programs", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(programData), 
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`); 
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating program:", error);
    return null; 
  }
}

export async function updateProgram(id: string,programData: createProgram): Promise<createProgram | null> {
  try {
    const response = await fetch(baseUrl+`programs/${id}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(programData), 
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`); 
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating program:", error);
    return null; 
  }
}

// Function to get Program by ID
export async function getProgramById(id: string): Promise<Programs | null> {
  try {
    const response = await fetch(baseUrl+"programs/${id}", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    // console.log("Fetched Program Data for ${id}:", data);
    return data;
  } catch (error) {
    console.error("Error fetching program:", error);
    return null;
  }
}

export async function deleteProgramById(id: string): Promise<boolean> {
 try{
  const response = await fetch(`${baseUrl}programs/${id}`, {
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
      `Failed to delete the program. Status: ${response.status}`
    );
    return false;
  }
 }
 catch(error){
  console.error("Error deleting program:", error);
  return false;
 }
}

export type Projects = {
  id: string;
  username: string;
  donation: string;
  status: "Pending" | "Processing" | "Success" | "failed";
  email: string;
};

// Function to get all Projects
export async function getAllProjects(limit?: number): Promise<Projects[]> {
  try {
    const response = await fetch(`${baseUrl}projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const projectsData = await response.json();
      const data: Projects[] = projectsData.data;
      return limit ? data.slice(0, limit) : data;
    } else {
      console.error(`Failed to fetch projects. Status: ${response.status}`);
      return [];
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// Function to get a Project by ID
export async function getProjectById(id: string): Promise<Projects | null> {
  try {
    const response = await fetch(`${baseUrl}projects/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    return null;
  }
}

// Function to create a new Project
interface CreateProject {
  username: string;
  donation: string;
  status: "Pending" | "Processing" | "Success" | "failed";
  email: string;
}

export async function createProject(
  projectData: CreateProject
): Promise<Projects | null> {
  try {
    const response = await fetch(`${baseUrl}projects`, {
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

// Function to update an existing Project
export async function updateProject(
  id: string,
  projectData: CreateProject
): Promise<Projects | null> {
  try {
    const response = await fetch(`${baseUrl}projects/${id}`, {
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
    console.error(`Error updating project with ID ${id}:`, error);
    return null;
  }
}

// Function to delete a Project by ID
export async function deleteProjectById(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}projects/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return true;
    } else {
      console.error(`Failed to delete project. Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`Error deleting project with ID ${id}:`, error);
    return false;
  }
}




// Function to get Projects
export async function getDataProjects(limit?: number): Promise<Projects[]> {
  const data: Projects[] = [
    { id: "1", username: "Mat", donation: "100", status: "Pending", email: "davis@example.com" },
    { id: "2", username: "Mathew", donation: "222", status: "Success", email: "lisa@example.com" },
    { id: "3", username: "Lucas", donation: "350", status: "Pending", email: "lucas@example.com" },
    { id: "4", username: "Sophia", donation: "200", status: "Success", email: "sophia@example.com" },
    { id: "5", username: "Jackson", donation: "150", status: "Pending", email: "jackson@example.com" },
    { id: "6", username: "Oliver", donation: "250", status: "Pending", email: "oliver@example.com" },

  ];
  
  return limit ? data.slice(0, limit) : data;
}

// Function to get Programs
export async function getAllCampaigns(limit?: number): Promise<Campaigns[]> {
  try {
    const response = await fetch(`${baseUrl}campaigns`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const campaignsData = await response.json();
      // console.log("getDataCampaigns   ",data);
      const data: Campaigns[] = campaignsData.data;
      return limit ? data.slice(0, limit) : data;
    } else {
      console.log(`Failed to fetch campaigns. Status:${response.status}`)
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return []
  }
}

// Function to get Campaigns 
interface createCampaign {
  title: string;
  tagline: string;
  goal: string;
  campaignStory: string;
  timeline: string;
  beneficiaryInformation: string;
  donateOptions: boolean;
  campaignUpdates: string;
  shareOptions: string;
  isActive: boolean;
}

export async function createCampaign(campaignData: createCampaign): Promise<createCampaign | null> {
  try {
    const response = await fetch(baseUrl + "campaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaignData),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating campaign:", error);
    return null;
  }
}

export async function updateCampaign(id: string, campaignData: createCampaign): Promise<createCampaign | null> {
  try {
    const response = await fetch(baseUrl + `campaigns/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaignData),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating campaign:", error);
    return null;
  }
}

export async function getCampaignById(id: string): Promise<Campaigns | null> {
  try {
    const response = await fetch(baseUrl + `campaigns/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    // console.log("Fetched Campaign Data for ${id}:", data);
    return data;
  } catch (error) {
    console.error("Error fetching campaign: ", error);
    return null;
  }
}

export async function deleteCampaignById(id: string): Promise<boolean> {
  try {
    const response = await fetch(baseUrl + `campaigns/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // console.log(`Deleted campaign with ID: ${id}`);
      return true;
    } else {
      console.error(
        `Failed to delete the campaign. Status: ${response.status}`
      );
      return false;
    }
  }
  catch (error) {
    console.error("Error deleting campaign:", error);
    return false;
  }
}

// Function to get Volunteers
export async function getDataVolunteer(limit?: number): Promise<Volunteer[]> {
  const data: Volunteer[] = [
    { id: "1", username: "Mat", donation: "100", status: "Pending", email: "davis@example.com" },
    { id: "2", username: "Jennifer", donation: "222", status: "Success", email: "lisa@example.com" },
    { id: "3", username: "Oliver", donation: "250", status: "Pending", email: "oliver@example.com" },
    { id: "4", username: "Lucas", donation: "350", status: "Success", email: "lucas@example.com" },
    { id: "5", username: "Sophia", donation: "300", status: "Pending", email: "sophia@example.com" },
    { id: "6", username: "Oliver", donation: "250", status: "Pending", email: "oliver@example.com" },

  ];
  
  return limit ? data.slice(0, limit) : data;
}
