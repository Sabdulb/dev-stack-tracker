import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { grandMonthlyTotal, formatCurrency } from '../../utils/calculations';
import { ProjectSummary } from './ProjectSummary';
import { NewProjectModal } from '../modals/NewProjectModal';

interface DashboardProps {
  onSelectProject: (id: string) => void;
}

export function Dashboard({ onSelectProject }: DashboardProps) {
  const { projects, settings } = useStore();
  const [showNewProject, setShowNewProject] = useState(false);
  const grandTotal = grandMonthlyTotal(projects);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Grand total */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-fg-muted uppercase tracking-wider mb-2">
          Total Monthly Spend
        </h2>
        <div className="text-4xl font-bold text-fg">
          {formatCurrency(grandTotal, settings.currency)}
          <span className="text-lg font-normal text-fg-muted">/mo</span>
        </div>
        <p className="text-sm text-fg-muted mt-1">
          {formatCurrency(grandTotal * 12, settings.currency)}/yr across{' '}
          {projects.length} project{projects.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Project grid */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <p className="text-lg mb-2">No projects yet</p>
          <button
            onClick={() => setShowNewProject(true)}
            className="text-sm text-indigo-600 hover:underline"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            By Project
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectSummary
                key={project.id}
                project={project}
                currency={settings.currency}
                onSelect={() => onSelectProject(project.id)}
              />
            ))}
          </div>
        </>
      )}

      <NewProjectModal open={showNewProject} onOpenChange={setShowNewProject} />
    </div>
  );
}
