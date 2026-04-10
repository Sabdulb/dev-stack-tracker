import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Project, Service, ImportMode } from '../types';
import { exportToJSON } from '../utils/importExport';

const GENERAL_PROJECT_ID = 'general';

interface Actions {
  addProject: (name: string, description?: string, color?: string) => void;
  updateProject: (id: string, updates: Partial<Pick<Project, 'name' | 'description' | 'color'>>) => void;
  deleteProject: (id: string) => void;
  addService: (projectId: string, service: Omit<Service, 'id' | 'createdAt'>) => void;
  updateService: (projectId: string, serviceId: string, updates: Partial<Omit<Service, 'id' | 'createdAt'>>) => void;
  deleteService: (projectId: string, serviceId: string) => void;
  setCurrency: (currency: AppState['settings']['currency']) => void;
  importState: (incoming: AppState, mode: ImportMode) => void;
  addProjectFromExport: (project: Project) => void;
  addServicesToProject: (projectId: string, services: Service[]) => void;
  exportState: () => void;
}

type Store = AppState & Actions;

function createDefaultProject(): Project {
  const now = new Date().toISOString();
  return {
    id: GENERAL_PROJECT_ID,
    name: 'General',
    description: 'Services shared across projects',
    services: [],
    createdAt: now,
    updatedAt: now,
  };
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      version: 1,
      projects: [createDefaultProject()],
      settings: {
        currency: 'USD',
        defaultProjectId: GENERAL_PROJECT_ID,
      },

      addProject: (name, description, color) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              id: crypto.randomUUID(),
              name,
              description,
              color,
              services: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        })),

      deleteProject: (id) =>
        set((state) => {
          const remaining = state.projects.filter((p) => p.id !== id);
          const defaultId = state.settings.defaultProjectId === id
            ? (remaining[0]?.id ?? GENERAL_PROJECT_ID)
            : state.settings.defaultProjectId;
          return {
            projects: remaining,
            settings: { ...state.settings, defaultProjectId: defaultId },
          };
        }),

      addService: (projectId, serviceData) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  services: [
                    ...p.services,
                    {
                      ...serviceData,
                      id: crypto.randomUUID(),
                      createdAt: new Date().toISOString(),
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        })),

      updateService: (projectId, serviceId, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  services: p.services.map((s) =>
                    s.id === serviceId ? { ...s, ...updates } : s
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        })),

      deleteService: (projectId, serviceId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  services: p.services.filter((s) => s.id !== serviceId),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        })),

      setCurrency: (currency) =>
        set((state) => ({
          settings: { ...state.settings, currency },
        })),

      importState: (incoming, mode) => {
        if (mode === 'replace') {
          set({
            version: incoming.version,
            projects: incoming.projects,
            settings: incoming.settings,
          });
        } else {
          // Merge: deduplicate by project id
          set((state) => {
            const existingIds = new Set(state.projects.map((p) => p.id));
            const newProjects = incoming.projects.filter((p) => !existingIds.has(p.id));
            return {
              ...state,
              projects: [...state.projects, ...newProjects],
            };
          });
        }
      },

      addProjectFromExport: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...project,
              // Regenerate IDs to prevent collisions on repeated imports
              id: crypto.randomUUID(),
              services: project.services.map((s) => ({
                ...s,
                id: crypto.randomUUID(),
              })),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      addServicesToProject: (projectId, services) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  services: [
                    ...p.services,
                    ...services.map((s) => ({
                      ...s,
                      id: crypto.randomUUID(),
                    })),
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        })),

      exportState: () => exportToJSON(get()),
    }),
    {
      name: 'dev-stack-tracker',
      version: 1,
      migrate: (persisted, _version) => {
        // Future migrations go here:
        // if (_version === 0) { persisted = migrateV0toV1(persisted); }
        return persisted as Store;
      },
    }
  )
);
