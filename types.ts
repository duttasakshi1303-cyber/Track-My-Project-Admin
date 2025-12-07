
export enum UserRole {
  ADMIN = 'Admin',
  TEAM_LEAD = 'Team Lead',
  DEVELOPER = 'Developer',
  CLIENT = 'Client'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
}

export enum ProjectStatus {
  PLANNING = 'Planning',
  IN_PROGRESS = 'In Progress',
  IN_REVIEW = 'In Review',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed'
}

export interface Project {
  id: string;
  title: string;
  clientName: string;
  clientId: string;
  description: string;
  techStack: string[];
  startDate: string;
  deadline: string;
  status: ProjectStatus;
  progress: number; // 0-100
  assignedTeam: string[]; // User IDs
  budget: string;
  repositoryUrl: string;
}

export interface AIHealthCheckResult {
  healthScore: number; // 0-100
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  keyRisks: string[];
  recommendations: string[];
}

export enum IncidentSeverity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum IncidentStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved'
}

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  affectedSystem: string;
  description?: string;
  timestamp: string;
}

export interface AIAnalysisResult {
  riskScore: number;
  summary: string;
  recommendedActions: string[];
}
