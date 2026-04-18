import { useState } from 'react';
import { useStore } from '../../store/useStore';
import {
  formatCurrency,
  grandMonthlyTotal,
  projectMonthlyTotal,
} from '../../utils/calculations';
import { NewProjectModal } from '../modals/NewProjectModal';
import { cn, Icon, IconButton } from '../ui';

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

  const totalLabel = `${formatCurrency(
    grandMonthlyTotal(projects),
    settings.currency
  )}/mo`;

  const isDashboardActive = activePanel === 'dashboard';

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 top-[52px] z-40 flex w-60 shrink-0 flex-col',
          'border-r border-border bg-surface',
          'transition-transform duration-200 md:static md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <SidebarRow
            active={isDashboardActive}
            onClick={onSelectDashboard}
            label="Overview"
            trailing={
              <span className="font-mono text-[11px] text-fg-subtle">
                {totalLabel}
              </span>
            }
          />

          <div className="mt-5 flex items-center justify-between px-3 pb-1">
            <span className="text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
              Projects
            </span>
            <IconButton
              icon="plus"
              label="New project"
              size="sm"
              iconSize={12}
              className="h-6 w-6"
              onClick={() => setShowNewProject(true)}
            />
          </div>

          {projects.length === 0 ? (
            <div className="px-3 py-4 text-xs text-fg-subtle">
              No projects yet.
            </div>
          ) : (
            projects.map((project) => {
              const isActive =
                activePanel === 'project' && activeProjectId === project.id;
              return (
                <SidebarRow
                  key={project.id}
                  active={isActive}
                  onClick={() => onSelectProject(project.id)}
                  leading={
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: project.color ?? 'var(--color-border-strong)',
                      }}
                    />
                  }
                  label={project.name}
                  trailing={
                    <span className="font-mono text-[11px] text-fg-subtle">
                      {formatCurrency(
                        projectMonthlyTotal(project),
                        settings.currency
                      )}
                    </span>
                  }
                />
              );
            })
          )}
        </nav>

        <div className="border-t border-border p-3">
          <button
            onClick={() => setShowNewProject(true)}
            className={cn(
              'flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-border px-3 py-1.5',
              'text-xs font-medium text-fg-muted',
              'transition-colors duration-150',
              'hover:border-accent hover:text-accent'
            )}
          >
            <Icon name="plus" size={12} />
            New Project
          </button>
        </div>
      </aside>

      <NewProjectModal open={showNewProject} onOpenChange={setShowNewProject} />
    </>
  );
}

interface SidebarRowProps {
  active: boolean;
  onClick: () => void;
  label: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

function SidebarRow({
  active,
  onClick,
  label,
  leading,
  trailing,
}: SidebarRowProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        active
          ? 'bg-accent-subtle text-accent'
          : 'text-fg hover:bg-surface-muted'
      )}
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent"
        />
      )}
      {leading}
      <span className="flex-1 truncate text-sm font-medium">{label}</span>
      {trailing}
    </button>
  );
}
