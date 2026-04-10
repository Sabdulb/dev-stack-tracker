import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { projectMonthlyTotal, formatCurrency } from '../../utils/calculations';
import { ServiceRow } from './ServiceRow';
import { AddServiceForm } from './AddServiceForm';
import { NewProjectModal } from '../modals/NewProjectModal';

interface ProjectViewProps {
  projectId: string | null;
  onProjectDeleted: () => void;
}

export function ProjectView({ projectId, onProjectDeleted }: ProjectViewProps) {
  const { projects, settings, deleteProject, updateProject } = useStore();
  const [showEditName, setShowEditName] = useState(false);
  const [editName, setEditName] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
        <p className="text-lg mb-2">No project selected</p>
        <button
          onClick={() => setShowNewProject(true)}
          className="text-sm text-indigo-600 hover:underline"
        >
          Create a project
        </button>
        <NewProjectModal open={showNewProject} onOpenChange={setShowNewProject} />
      </div>
    );
  }

  const monthly = projectMonthlyTotal(project);

  function startEditName() {
    setEditName(project!.name);
    setShowEditName(true);
  }

  function saveEditName(e: React.FormEvent) {
    e.preventDefault();
    if (editName.trim()) {
      updateProject(project!.id, { name: editName.trim() });
    }
    setShowEditName(false);
  }

  function handleDelete() {
    if (window.confirm(`Delete project "${project!.name}" and all its services?`)) {
      deleteProject(project!.id);
      onProjectDeleted();
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Project header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            {showEditName ? (
              <form onSubmit={saveEditName} className="flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-xl font-bold border-b-2 border-indigo-500 focus:outline-none bg-transparent"
                  autoFocus
                  onBlur={saveEditName}
                />
              </form>
            ) : (
              <div className="flex items-center gap-2">
                {project.color && (
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                )}
                <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
                <button
                  onClick={startEditName}
                  className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
            {project.description && (
              <p className="text-sm text-gray-500 mt-1">{project.description}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(monthly, settings.currency)}/mo
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {project.services.length} service{project.services.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Service list */}
      <div className="divide-y divide-gray-100">
        {project.services.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-400">
            <p className="text-sm">No services yet.</p>
            <p className="text-xs mt-1">Add your first service below.</p>
          </div>
        )}
        {project.services.map((service) => (
          <ServiceRow
            key={service.id}
            projectId={project.id}
            service={service}
            currency={settings.currency}
          />
        ))}
      </div>

      <AddServiceForm projectId={project.id} />

      {/* Danger zone */}
      {project.id !== 'general' && (
        <div className="px-6 py-4 border-t border-gray-100 mt-4">
          <button
            onClick={handleDelete}
            className="text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            Delete this project
          </button>
        </div>
      )}
    </div>
  );
}
