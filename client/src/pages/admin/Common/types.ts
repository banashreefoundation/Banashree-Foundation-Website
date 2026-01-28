export type Campaigns = {
    id: string;
    username: string;
    donation: string;
    status: "Pending" | "Processing" | "Success" | "failed";
    email: string;
  };
  
  export type Initiatives = {
    id: string,
    title: string;
    tagLine: string;
    description: string;
    goal: string;
    metrics: string;
  };
  
  export type Programs = {
    id: string;
    username: string;
    donation: string;
    status: "Pending" | "Processing" | "Success" | "failed";
    email: string;
  };
  export type Projects = {
    name: string;
  program: string;
  objective: string;
  description: string;
  beneficiaries: string;
  location: {
    city: string;
    state: string;
  };
  status: 'Planned' | 'In Progress' | 'Completed';
  key_activities: string[];
  expected_outcomes: string[];
  collaborating_partners: string[];
  gallery?: string;
  get_involved?: string;
  donate?: string;
  }
  export type Volunteer = {
    id: string;
    username: string;
    donation: string;
    status: "Pending" | "Processing" | "Success" | "failed";
    email: string;
  };
  