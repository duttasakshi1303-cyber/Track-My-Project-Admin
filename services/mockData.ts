
import { Project, ProjectStatus, User, UserRole } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'U1', name: 'Sarah Connor', email: 'sarah@admin.com', role: UserRole.ADMIN, avatar: 'SC', status: 'Active', lastActive: 'Now' },
  { id: 'U2', name: 'Mike Ross', email: 'mike@devteam.com', role: UserRole.TEAM_LEAD, avatar: 'MR', status: 'Active', lastActive: '2h ago' },
  { id: 'U3', name: 'Rachel Zane', email: 'rachel@devteam.com', role: UserRole.DEVELOPER, avatar: 'RZ', status: 'Active', lastActive: '5m ago' },
  { id: 'U4', name: 'John Doe', email: 'john@clientcorp.com', role: UserRole.CLIENT, avatar: 'JD', status: 'Active', lastActive: '1d ago' },
  { id: 'U5', name: 'Jane Smith', email: 'jane@startup.io', role: UserRole.CLIENT, avatar: 'JS', status: 'Inactive', lastActive: '1w ago' },
];

export const generateMockProjects = (): Project[] => {
  return [
    {
      id: 'PRJ-2024-001',
      title: 'E-Commerce Redesign',
      clientName: 'ClientCorp Inc.',
      clientId: 'U4',
      description: 'Full redesign of the main e-commerce platform with focus on mobile optimization and checkout conversion.',
      techStack: ['Next.js', 'Shopify', 'Tailwind', 'Node.js'],
      startDate: '2024-01-15',
      deadline: '2024-04-30',
      status: ProjectStatus.IN_PROGRESS,
      progress: 65,
      assignedTeam: ['U2', 'U3'],
      budget: '$45,000',
      repositoryUrl: 'github.com/clientcorp/storefront-v2'
    },
    {
      id: 'PRJ-2024-002',
      title: 'Internal HR Portal',
      clientName: 'StartupIO',
      clientId: 'U5',
      description: 'Employee management dashboard with leave tracking and payroll integration.',
      techStack: ['React', 'Firebase', 'GCP'],
      startDate: '2024-02-01',
      deadline: '2024-03-15',
      status: ProjectStatus.IN_REVIEW,
      progress: 90,
      assignedTeam: ['U2'],
      budget: '$20,000',
      repositoryUrl: 'github.com/startupio/hr-dashboard'
    },
    {
      id: 'PRJ-2024-003',
      title: 'Mobile App MVP',
      clientName: 'TechVentures',
      clientId: 'U4',
      description: 'Cross-platform mobile application for food delivery tracking.',
      techStack: ['React Native', 'Supabase', 'Google Maps API'],
      startDate: '2024-03-01',
      deadline: '2024-06-01',
      status: ProjectStatus.PLANNING,
      progress: 15,
      assignedTeam: ['U3'],
      budget: '$35,000',
      repositoryUrl: 'github.com/techventures/delivery-app'
    },
    {
      id: 'PRJ-2024-004',
      title: 'Legacy System Migration',
      clientName: 'Enterprise Ltd',
      clientId: 'U4',
      description: 'Migrating on-premise Oracle DB to AWS RDS and rewriting middleware in Go.',
      techStack: ['Go', 'AWS', 'Docker', 'Oracle'],
      startDate: '2023-11-01',
      deadline: '2024-02-28',
      status: ProjectStatus.ON_HOLD,
      progress: 45,
      assignedTeam: ['U2', 'U3'],
      budget: '$80,000',
      repositoryUrl: 'github.com/enterprise/migration'
    }
  ];
};

export const MOCK_STATS_HISTORY = [
  { name: 'Mon', submissions: 12 },
  { name: 'Tue', submissions: 19 },
  { name: 'Wed', submissions: 15 },
  { name: 'Thu', submissions: 25 },
  { name: 'Fri', submissions: 32 },
  { name: 'Sat', submissions: 10 },
  { name: 'Sun', submissions: 5 },
];
