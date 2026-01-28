export interface Contact {
    _id: string; // Make it required
    name: string;
    email: string;
    phone?: string;
    inquiryType: 'general' | 'partnership' | 'volunteer' | 'donation' | 'other';
    subject: string;
    message: string;
    status: 'new' | 'in-progress' | 'resolved' | 'closed';
    createdAt: Date;
    updatedAt: Date;
    resolvedAt?: Date;
    resolvedBy?: {
      _id: string;
      name: string;
      email: string;
    };
    notes?: string;
  }
  
  // For creating contacts (without _id, createdAt, updatedAt)
  export type ContactCreate = Omit<Contact, '_id' | 'createdAt' | 'updatedAt' | 'resolvedAt' | 'resolvedBy' | 'status' | 'notes'>;
  
  // For updating contacts (partial)
  export type ContactUpdate = Partial<Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>>;
  
  // Query parameters for filtering contacts
  export interface ContactQueryParams {
    page?: number;
    limit?: number;
    status?: 'new' | 'in-progress' | 'resolved' | 'closed';
    inquiryType?: 'general' | 'partnership' | 'volunteer' | 'donation' | 'other';
    email?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }
  
  // API Response interface for contacts
  export interface ContactApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }
  
  // Statistics Response
  export interface ContactStats {
    total: number;
    pending: number;
    resolved: number;
    byType: Array<{
      _id: string;
      count: number;
    }>;
  }