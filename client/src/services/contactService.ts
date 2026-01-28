import { apiClient } from './api';
import { 
  Contact, 
  ContactCreate, 
  ContactUpdate,
  ContactQueryParams, 
  ContactApiResponse, 
  ContactStats 
} from '@/types/contact.types';

// Contact API Service
export class ContactService {
  
  // ===== GET ALL CONTACTS =====
  static async getContacts(params?: ContactQueryParams): Promise<ContactApiResponse<Contact[]>> {
    try {
      const queryString = params 
        ? '?' + new URLSearchParams(
            Object.entries(params)
              .filter(([_, value]) => value !== undefined)
              .map(([key, value]) => [key, String(value)])
          ).toString()
        : '';
      
      const response = await apiClient.get<ContactApiResponse<Contact[]>>(`contacts${queryString}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      throw error;
    }
  }

  // ===== GET CONTACT BY ID =====
  static async getContactById(id: string): Promise<Contact> {
    try {
      const response = await apiClient.get<ContactApiResponse<Contact>>(`contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch contact with ID ${id}:`, error);
      throw error;
    }
  }

  // ===== GET CONTACTS BY EMAIL =====
  static async getContactsByEmail(email: string): Promise<Contact[]> {
    try {
      const response = await apiClient.get<ContactApiResponse<Contact[]>>(`contacts/email/${email}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch contacts for email ${email}:`, error);
      throw error;
    }
  }

  // ===== GET CONTACTS BY TYPE =====
  static async getContactsByType(type: Contact['inquiryType']): Promise<Contact[]> {
    try {
      const response = await apiClient.get<ContactApiResponse<Contact[]>>(`contacts/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch contacts of type ${type}:`, error);
      throw error;
    }
  }

  // ===== GET PENDING CONTACTS =====
  static async getPendingContacts(): Promise<Contact[]> {
    try {
      const response = await apiClient.get<ContactApiResponse<Contact[]>>('contacts/pending');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pending contacts:', error);
      throw error;
    }
  }

  // ===== GET CONTACT STATISTICS =====
  static async getContactStats(): Promise<ContactStats> {
    try {
      const response = await apiClient.get<ContactApiResponse<ContactStats>>('contacts/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch contact statistics:', error);
      throw error;
    }
  }

  // ===== CREATE CONTACT (PUBLIC) =====
  static async createContact(contactData: ContactCreate): Promise<Contact> {
    try {
      const response = await apiClient.post<ContactApiResponse<Contact>>('contacts', contactData);
      return response.data;
    } catch (error) {
      console.error('Failed to create contact:', error);
      throw error;
    }
  }

  // ===== UPDATE CONTACT =====
  static async updateContact(id: string, contactData: ContactUpdate): Promise<Contact> {
    try {
      const response = await apiClient.put<ContactApiResponse<Contact>>(`contacts/${id}`, contactData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update contact with ID ${id}:`, error);
      throw error;
    }
  }

  // ===== UPDATE CONTACT STATUS =====
  static async updateContactStatus(id: string, status: Contact['status']): Promise<Contact> {
    try {
      const response = await apiClient.put<ContactApiResponse<Contact>>(`contacts/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Failed to update status for contact with ID ${id}:`, error);
      throw error;
    }
  }

  // ===== RESOLVE CONTACT =====
  static async resolveContact(id: string, notes?: string): Promise<Contact> {
    try {
      const response = await apiClient.put<ContactApiResponse<Contact>>(`contacts/${id}/resolve`, { notes });
      return response.data;
    } catch (error) {
      console.error(`Failed to resolve contact with ID ${id}:`, error);
      throw error;
    }
  }

  // ===== DELETE CONTACT =====
  static async deleteContact(id: string): Promise<void> {
    try {
      await apiClient.delete(`contacts/${id}`);
    } catch (error) {
      console.error(`Failed to delete contact with ID ${id}:`, error);
      throw error;
    }
  }



  // ===== DELETE OLD CONTACTS =====
  static async deleteOldContacts(days: number): Promise<{ deletedCount: number; cutoffDate: Date }> {
    try {
      const response = await apiClient.delete<ContactApiResponse<{ deletedCount: number; cutoffDate: Date }>>(
        `contacts/old/${days}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to delete contacts older than ${days} days:`, error);
      throw error;
    }
  }
}

export default ContactService;