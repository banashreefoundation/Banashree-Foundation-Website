import { Volunteer } from "../Volunteer/columns";
const baseUrl ="http://localhost:4001/api/v1/";

interface PersonalDetails {
  fullname: string;
  email: string;
  phoneNumber: string;
  location: string;
  city: string;
  state: string;
  availability: string;
}

interface InterestsAndSkillsDetails {
  interests: string,
  skills: string,
}

interface volunteerTypeDetails  {
  volunteerType: string,
  isAvailableForTravel: string,
}

interface motivationDetails {
  reasonForJoinBanashree: string,
  objective: string
}

interface emergencyContactDetails {
  contactName: string,
  phoneNumber: string,
  relation: string
}

interface createVolunteer {
  personalDetails: PersonalDetails,
  skillsAndInterestsDetails: InterestsAndSkillsDetails,
  volunteerTypeDetails: volunteerTypeDetails,
  motivationDetails: motivationDetails,
  emergencyContactDetails: emergencyContactDetails
}


export async function createVolunteer(volunteerData: createVolunteer): Promise<createVolunteer | null> {
  try {
    const response = await fetch(baseUrl+"volunteers", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(volunteerData), 
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

export async function getAllVolunteers(limit?: number): Promise<Volunteer[]> {
  try {
    const response = await fetch(`${baseUrl}/volunteers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok){
      const volunteerData = await response.json();
      const data: Volunteer[] = volunteerData.data;
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

export async function updateVolunteer(id: string,volunteerData: createVolunteer): Promise<createVolunteer | null> {
  try {
    const response = await fetch(baseUrl+`/volunteers/${id}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(volunteerData), 
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

export async function getVolunteerById(id: string): Promise<Volunteer | null> {
  try {
    const response = await fetch(`${baseUrl}/volunteers/${id}`, {
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
    console.error("Error fetching program:", error);
    return null;
  }
}

export async function deleteVolunteerById(id: string): Promise<boolean> {
 try{
  const response = await fetch(`${baseUrl}volunteers/${id}`, {
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


