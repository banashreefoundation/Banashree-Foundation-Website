import { Testimonial } from "../Testimonials/columns";

const baseUrl = "http://localhost:4001/api/v1/";

interface CreateTestimonial {
  name: string;
  designation: string;
  message: string;
  status?: "pending" | "approved" | "rejected";
  isPublished?: boolean;
  order?: number;
}

function getToken() {
  return JSON.parse(String(localStorage.getItem("token")));
}

export async function createTestimonial(
  testimonialData: CreateTestimonial
): Promise<CreateTestimonial | null> {
  try {
    const formData = new FormData();
    formData.append('name', testimonialData.name);
    formData.append('designation', testimonialData.designation);
    formData.append('message', testimonialData.message);
    
    if (testimonialData.status) {
      formData.append('status', testimonialData.status);
    }
    
    if (testimonialData.isPublished !== undefined) {
      formData.append('isPublished', String(testimonialData.isPublished));
    }
    
    if (testimonialData.order !== undefined) {
      formData.append('order', String(testimonialData.order));
    }
    
    // Handle image if it exists
    if ((testimonialData as any).image instanceof File) {
      formData.append('image', (testimonialData as any).image);
    }
    
    const response = await fetch(baseUrl + "testimonials", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Error creating testimonial: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return null;
  }
}

export async function getAllTestimonials(
  limit?: number
): Promise<Testimonial[]> {
  try {
    console.log('Calling API:', `${baseUrl}testimonials`);
    const response = await fetch(`${baseUrl}testimonials`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    });
    
    console.log('API Response status:', response.status);
    
    if (response.ok) {
      const responseData = await response.json();
      console.log('Testimonial response data:', responseData);
      
      // Handle response format: { testimonials: [], pagination: {} }
      const data: Testimonial[] = Array.isArray(responseData.testimonials) 
        ? responseData.testimonials 
        : Array.isArray(responseData) 
        ? responseData 
        : [];
      
      return limit ? data.slice(0, limit) : data;
    } else {
      const errorText = await response.text();
      console.error(`Failed to fetch testimonials. Status: ${response.status}`, errorText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching testimonial data:", error);
    return [];
  }
}

export async function getPublishedTestimonials(
  limit?: number
): Promise<Testimonial[]> {
  try {
    const response = await fetch(`${baseUrl}testimonials/published`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log(`Failed to fetch testimonials. Status: ${response.status}`);
      return [];
    }
    const testimonialData = await response.json();
    
    // Handle response format: { testimonials: [] } or direct array
    const data: Testimonial[] = Array.isArray(testimonialData.testimonials)
      ? testimonialData.testimonials
      : Array.isArray(testimonialData)
      ? testimonialData
      : [];
      
    return limit ? data.slice(0, limit) : data;
  } catch (error) {
    console.error("Error fetching published testimonials:", error);
    return [];
  }
}

export async function getTestimonialById(
  id: string
): Promise<Testimonial | null> {
  try {
    const response = await fetch(`${baseUrl}testimonials/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch testimonial with ID ${id}. Status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching testimonial with ID ${id}:`, error);
    return null;
  }
}

export async function updateTestimonial(
  id: string,
  testimonialData: Partial<CreateTestimonial>
): Promise<Testimonial | null> {
  try {
    const formData = new FormData();
    
    if (testimonialData.name) {
      formData.append('name', testimonialData.name);
    }
    
    if (testimonialData.designation) {
      formData.append('designation', testimonialData.designation);
    }
    
    if (testimonialData.message) {
      formData.append('message', testimonialData.message);
    }
    
    if (testimonialData.status) {
      formData.append('status', testimonialData.status);
    }
    
    if (testimonialData.isPublished !== undefined) {
      formData.append('isPublished', String(testimonialData.isPublished));
    }
    
    if (testimonialData.order !== undefined) {
      formData.append('order', String(testimonialData.order));
    }
    
    // Handle image if it exists
    if ((testimonialData as any).image instanceof File) {
      formData.append('image', (testimonialData as any).image);
    }
    
    const response = await fetch(`${baseUrl}testimonials/${id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update testimonial with ID ${id}. Status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating testimonial with ID ${id}:`, error);
    return null;
  }
}

export async function deleteTestimonialById(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}testimonials/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete testimonial with ID ${id}. Status: ${response.status}`
      );
    }
    return true;
  } catch (error) {
    console.error(`Error deleting testimonial with ID ${id}:`, error);
    return false;
  }
}

export async function approveTestimonial(id: string): Promise<Testimonial | null> {
  try {
    const response = await fetch(`${baseUrl}testimonials/${id}/approve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to approve testimonial with ID ${id}. Status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error approving testimonial with ID ${id}:`, error);
    return null;
  }
}

export async function rejectTestimonial(id: string): Promise<Testimonial | null> {
  try {
    const response = await fetch(`${baseUrl}testimonials/${id}/reject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to reject testimonial with ID ${id}. Status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error rejecting testimonial with ID ${id}:`, error);
    return null;
  }
}

export async function publishTestimonial(id: string): Promise<Testimonial | null> {
  try {
    const response = await fetch(`${baseUrl}testimonials/${id}/publish`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to publish testimonial with ID ${id}. Status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error publishing testimonial with ID ${id}:`, error);
    return null;
  }
}

export async function unpublishTestimonial(id: string): Promise<Testimonial | null> {
  try {
    const response = await fetch(`${baseUrl}testimonials/${id}/unpublish`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to unpublish testimonial with ID ${id}. Status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error unpublishing testimonial with ID ${id}:`, error);
    return null;
  }
}
