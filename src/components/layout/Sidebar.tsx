import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { projectMonthlyTotal, formatCurrency } from '../../utils/calculations';
import { NewProjectModal } from '../modals/NewProjectModal';

interface SidebarProps {
  activeProjectId: string | null;
  activePanel: 'dashboard' | 'project';
  onSelectProject: (id: string) => void;
  onSelectDashboard: () => void;
  mobileOpen: boolean;
}

export function Sidebar({
  activeProjectId,
  activePanel,
  onSelectProject,
  onSelectDashboard,
  mobileOpen,
}: SidebarProps) {
  const { projects, settings } = useStore();
  const [showNewProject, setShowNewProject] = useState(false);

  return (
    <aside className={`w-56 shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col fixed inset-y-0 top-[65px] z-40 transition-transform duration-200 md:static md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Dashboard link */}
        <button
          onClick={onSelectDashboard}
          className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
            activePanel === 'dashboard'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Dashboard
        </button>

        <div className="mt-4 px-4 pb-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Projects
          </span>
        </div>

        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={`w-full text-left px-4 py-2 transition-colors ${
              activePanel === 'project' && activeProjectId === project.id
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              {project.color && (
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: project.color }}
                />
              )}
              <span className="text-sm truncate">{project.name}</span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5 pl-4">
              {formatCurrency(projectMonthlyTotal(project), settings.currency)}/mo
            </div>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setShowNewProject(true)}
          className="w-full text-sm py-2 rounded-md border border-dashed border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
        >
          + New Project
        </button>
      </div>

      <NewProjectModal open={showNewProject} onOpenChange={setShowNewProject} />
    </aside>
  );
}
