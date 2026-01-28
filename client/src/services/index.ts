// Export all services from a central location
export { apiClient } from './api';
export { 
  default as ApiService,
  type Program, 
  type User, 
  type Campaign, 
  type Event, 
  type Project, 
  type Volunteer, 
  type ApiResponse 
} from './apiService';

// You can add more specialized services here if needed
// export { AuthService } from './authService';
// export { FileUploadService } from './fileUploadService';
// etc.
