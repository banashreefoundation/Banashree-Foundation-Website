import { apiClient } from './api';

// Types for Program data
export interface Program {
  _id?: string;
  title: string;
  image?: string; // Deprecated - for backward compatibility
  media?: {
    images?: string[];
    videos?: string[];
    gallery?: string[];
  };
  tagline: string;
  detailedDescription: string;
  goal?: string;
  goals?: string[];
  key_metrics?: {
    [key: string]: number;
  };
  metrics?: string[];
  endorsement?: string;
  impact?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Types for other entities (add more as needed)
export interface User {
  _id?: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Campaign {
  _id?: string;
  title: string;
  tagline: string;
  goal: string;
  campaignStory: string;
  specificBreakdown: string;
  impactOfContribution: string;
  timeline: string;
  beneficiaryInformation: string;
  mediaUrl: string;
  donateOption: string;
  campaignUpdates: string;
  shareOptions: string;
  endorsementsOrPartnerships: string;
  isActive: boolean;
  campaignID: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Event {
  _id?: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  venue: string;
  focusAreas: string;
  targetAudience: string;
  objectives: string;
  impact: string;
  media: string[];
  donateOption: boolean;
  pocDetails: string;
  createdBy: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  updateHistory?: any[];
  eventID?: number;
  __v?: number;
}

export interface Project {
  _id?: string;
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
  endorsementAndPartnership?: string;
  image?: string; // Project main image
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Volunteer {
  _id?: string;
  personalDetails: {
    fullname: string;
    email: string;
    phoneNumber: string;
    location: string;
    city: string;
    state: string;
  };
  skillsAndInterestsDetails: any;
  volunteerTypeDetails: any;
  motivationDetails: any;
  emergencyContactDetails: any;
  termConditionAndPermissionDetails: any;
  createdAt?: string;
  updatedAt?: string;
}

// Generic API Response interface
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Common API Service
export class ApiService {
  
  // ===== PROGRAMS API =====
  static async getPrograms(): Promise<Program[]> {
    try {
      const response = await apiClient.get<ApiResponse<Program[]>>('/programs');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch programs:', error);
      throw error;
    }
  }

  static async getProgramById(id: string): Promise<Program> {
    try {
      const response = await apiClient.get<ApiResponse<Program>>(`/programs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch program with ID ${id}:`, error);
      throw error;
    }
  }

  static async createProgram(programData: Omit<Program, '_id' | 'createdAt' | 'updatedAt'>): Promise<Program> {
    try {
      const response = await apiClient.post<ApiResponse<Program>>('/programs', programData);
      return response.data;
    } catch (error) {
      console.error('Failed to create program:', error);
      throw error;
    }
  }

  static async updateProgram(id: string, programData: Partial<Program>): Promise<Program> {
    try {
      const response = await apiClient.put<ApiResponse<Program>>(`/programs/${id}`, programData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update program with ID ${id}:`, error);
      throw error;
    }
  }

  static async deleteProgram(id: string): Promise<void> {
    try {
      await apiClient.delete(`/programs/${id}`);
    } catch (error) {
      console.error(`Failed to delete program with ID ${id}:`, error);
      throw error;
    }
  }

  // ===== USERS API =====
  static async getUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<ApiResponse<User[]>>('/users');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch user with ID ${id}:`, error);
      throw error;
    }
  }

  static async createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const response = await apiClient.post<ApiResponse<User>>('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  // ===== CAMPAIGNS API =====
  static async getCampaigns(): Promise<Campaign[]> {
    try {
      const response = await apiClient.get<ApiResponse<Campaign[]>>('/campaigns');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      throw error;
    }
  }

  static async getCampaignById(id: string): Promise<Campaign> {
    try {
      const response = await apiClient.get<ApiResponse<Campaign>>(`/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch campaign with ID ${id}:`, error);
      throw error;
    }
  }

  static async createCampaign(campaignData: Omit<Campaign, '_id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> {
    try {
      const response = await apiClient.post<ApiResponse<Campaign>>('/campaigns', campaignData);
      return response.data;
    } catch (error) {
      console.error('Failed to create campaign:', error);
      throw error;
    }
  }

  // ===== EVENTS API =====
  static async getEvents(): Promise<Event[]> {
    try {
      const response = await apiClient.get<Event[]>('/events/isEventEnabled/true');
      // The API returns an array directly
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Failed to fetch events:', error);
      throw error;
    }
  }

  static async getEventById(id: string): Promise<Event> {
    try {
      const response = await apiClient.get<ApiResponse<Event>>(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch event with ID ${id}:`, error);
      throw error;
    }
  }

  static async createEvent(eventData: Omit<Event, '_id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    try {
      const response = await apiClient.post<ApiResponse<Event>>('/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Failed to create event:', error);
      throw error;
    }
  }

  // ===== PROJECTS API =====
  static async getProjects(): Promise<Project[]> {
    try {
      const response = await apiClient.get<ApiResponse<Project[]>>('/projects');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    }
  }

  static async getProjectById(id: string): Promise<Project> {
    try {
      const response = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch project with ID ${id}:`, error);
      throw error;
    }
  }

  static async createProject(projectData: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    try {
      const response = await apiClient.post<ApiResponse<Project>>('/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  }

  // ===== VOLUNTEERS API =====
  static async getVolunteers(): Promise<Volunteer[]> {
    try {
      const response = await apiClient.get<ApiResponse<Volunteer[]>>('/volunteers');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch volunteers:', error);
      throw error;
    }
  }

  static async getVolunteerById(id: string): Promise<Volunteer> {
    try {
      const response = await apiClient.get<ApiResponse<Volunteer>>(`/volunteers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch volunteer with ID ${id}:`, error);
      throw error;
    }
  }

  static async createVolunteer(volunteerData: Omit<Volunteer, '_id' | 'createdAt' | 'updatedAt'>): Promise<Volunteer> {
    try {
      const response = await apiClient.post<ApiResponse<Volunteer>>('/volunteers', volunteerData);
      return response.data;
    } catch (error) {
      console.error('Failed to create volunteer:', error);
      throw error;
    }
  }

  // ===== GENERIC METHODS =====
  // You can add more generic methods here for custom endpoints
  static async customGet<T>(endpoint: string): Promise<T> {
    try {
      const response = await apiClient.get<ApiResponse<T>>(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch from ${endpoint}:`, error);
      throw error;
    }
  }

  static async customPost<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await apiClient.post<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to post to ${endpoint}:`, error);
      throw error;
    }
  }

  static async customPut<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await apiClient.put<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to put to ${endpoint}:`, error);
      throw error;
    }
  }

  static async customDelete(endpoint: string): Promise<void> {
    try {
      await apiClient.delete(endpoint);
    } catch (error) {
      console.error(`Failed to delete from ${endpoint}:`, error);
      throw error;
    }
  }
}

export default ApiService;
