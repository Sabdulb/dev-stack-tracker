export type Category =
  | 'Infra'
  | 'Storage'
  | 'API'
  | 'Auth'
  | 'Email'
  | 'Hosting'
  | 'Database'
  | 'CI/CD'
  | 'Other';

export const CATEGORIES: Category[] = [
  'Infra',
  'Storage',
  'API',
  'Auth',
  'Email',
  'Hosting',
  'Database',
  'CI/CD',
  'Other',
];

export interface Service {
  id: string;
  name: string;
  cost: number; // monthly cost in USD (0 = free)
  billingCycle: 'monthly' | 'yearly' | 'one-time';
  category: Category | string; // preset or custom string
  tier?: string;
  url?: string;
  notes?: string;
  createdAt: string; // ISO
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  services: Service[];
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  version: number;
  projects: Project[];
  settings: {
    currency: 'USD' | 'EUR' | 'GBP';
    defaultProjectId: string;
  };
}

export type ImportMode = 'replace' | 'merge';

export interface FullExport extends AppState {
  type: 'full';
}

export interface ProjectExport {
  type: 'project';
  version: number;
  project: Project;
}

export type ExportData = FullExport | ProjectExport;
