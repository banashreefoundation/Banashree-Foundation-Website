import { Event } from "../Events/columns";
const baseUrl ="http://localhost:4001/api/v1/";

interface createEvent {
  title: string,
  description: string,
  startDateTime: Date;
  endDateTime: Date;
  venue: string;
  focusAreas: string;
  program?: string;
  targetAudience: string;
  objectives: string;
  impact: string;
  donateOption: boolean;
  pocDetails: string;
}

function getToken() {
  return JSON.parse(String(localStorage.getItem('token')))
}

export async function createEvent(eventData: createEvent): Promise<createEvent | null> {
  try {
    const response = await fetch(baseUrl+"events", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json", 
        'Authorization': 'Bearer ' + getToken()
      },
      body: JSON.stringify(eventData), 
    });
    if (!response.ok) {
      throw new Error(`Error event: ${response.statusText}`); 
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating event:", error);
    return null; 
  }
}

export async function getAllEvents(limit?: number): Promise<Event[]> {
  try {
    const response = await fetch(`${baseUrl}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + getToken()
      },
    });
    if (response.ok){
      const eventData = await response.json();
      const data: Event[] = eventData
      return limit ? data.slice(0, limit) : data;
    } else{
      console.log(`Failed to fetch events. Status:${response.status}`)
      return [];
    }
  } catch (error) {
    console.error("Error fetching event data:", error);
    return []
  }
}

export async function getEnabledEvents(limit?: number): Promise<Event[]> {
  try {
    const flagResponse = await fetch(`${baseUrl}/config`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken(),
      },
    });

    if (!flagResponse.ok) {
      console.log(`Failed to fetch config. Status: ${flagResponse.status}`);
      return [];
    }
    const configData = await flagResponse.json();
    const isEventEnabled = Boolean(configData?.isEventEnabled);
    if (!isEventEnabled) {
      console.log("Event fetching is disabled in config.");
      return [];
    }
    const response = await fetch(`${baseUrl}/events/isEventEnabled/${isEventEnabled}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken(),
      },
    });

    if (!response.ok) {
      console.log(`Failed to fetch events. Status: ${response.status}`);
      return [];
    }
    const eventData = await response.json();
    const data: Event[] = Array.isArray(eventData) ? eventData : [];
    return limit ? data.slice(0, limit) : data;

  } catch (error) {
    console.error("Error fetching enabled event data:", error);
    return [];
  }
}

export async function updateEvent(id: string,eventData: createEvent): Promise<createEvent | null> {
  try {
    const response = await fetch(baseUrl+`events/${id}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
        'Authorization': getToken()
      },
      body: JSON.stringify(eventData), 
    });
    console.log("Error updating event:",response );
    if (!response.ok) {
      throw new Error(`Error Event: ${response.statusText}`); 
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating event:", error);
    return null; 
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    const response = await fetch(`${baseUrl}/events/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export async function deleteEventById(id: string): Promise<boolean> {
 try{
  const response = await fetch(`${baseUrl}events/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getToken()
    },
  });

  if (response.ok) {
    return true;
  } else {
    console.error(
      `Failed to delete the event. Status: ${response.status}`
    );
    return false;
  }
 }
 catch(error){
  console.error("Error deleting event:", error);
  return false;
 }
}


