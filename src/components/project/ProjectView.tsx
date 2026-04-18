import { useState } from 'react';
import { useStore } from '../../store/useStore';
import {
  formatCurrency,
  projectMonthlyTotal,
  toMonthlyCost,
} from '../../utils/calculations';
import { ServiceRow } from './ServiceRow';
import { AddServiceForm } from './AddServiceForm';
import { NewProjectModal } from '../modals/NewProjectModal';
import {
  AlertDialog,
  AlertDialogContent,
  Button,
  Card,
  CategoryChip,
  cn,
  EmptyState,
  Icon,
  Input,
} from '../ui';
import { Donut } from '../charts/Donut';

interface ProjectViewProps {
  projectId: string | null;
  onProjectDeleted: () => void;
  onBackToDashboard: () => void;
}

type Tab = 'services' | 'breakdown';

export function ProjectView({
  projectId,
  onProjectDeleted,
  onBackToDashboard,
}: ProjectViewProps) {
  const { projects, settings, deleteProject, updateProject } = useStore();
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [tab, setTab] = useState<Tab>('services');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <EmptyState
          icon="layout"
          title="No project selected"
          description="Pick a project from the sidebar or create a new one."
          action={
            <Button onClick={() => setShowNewProject(true)}>
              <Icon name="plus" size={14} />
              New Project
            </Button>
          }
        />
        <NewProjectModal open={showNewProject} onOpenChange={setShowNewProject} />
      </div>
    );
  }

  const monthly = projectMonthlyTotal(project);
  const yearly = monthly * 12;
  const serviceCount = project.services.length;
  const avg = serviceCount > 0 ? monthly / serviceCount : 0;

  const byCategory = project.services.reduce<Record<string, number>>(
    (acc, s) => {
      acc[s.category] = (acc[s.category] ?? 0) + toMonthlyCost(s);
      return acc;
    },
    {}
  );
  const categorySegments = Object.entries(byCategory)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([category, value]) => ({ category, value }));

  const isGeneral = project.id === 'general';

  function startEdit() {
    setNameDraft(project!.name);
    setEditingName(true);
  }

  function commitEdit() {
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== project!.name) {
      updateProject(project!.id, { name: trimmed });
    }
    setEditingName(false);
  }

  function cancelEdit() {
    setEditingName(false);
  }

  function handleDelete() {
    deleteProject(project!.id);
    onProjectDeleted();
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <nav className="mb-2 flex items-center gap-1 text-xs text-fg-muted">
            <button
              onClick={onBackToDashboard}
              className="hover:text-fg transition-colors"
            >
              Dashboard
            </button>
            <Icon name="chevron-right" size={12} className="text-fg-subtle" />
            <span className="text-fg">{project.name}</span>
          </nav>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      project.color ?? 'var(--color-border-strong)',
                  }}
                />
                {editingName ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      commitEdit();
                    }}
                    className="flex-1"
                  >
                    <Input
                      value={nameDraft}
                      onChange={(e) => setNameDraft(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                      className="h-8 text-xl font-semibold"
                    />
                  </form>
                ) : (
                  <button
                    onClick={startEdit}
                    className={cn(
                      'group flex items-center gap-1.5 rounded-sm',
                      'text-xl font-semibold text-fg',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
                    )}
                  >
                    <span>{project.name}</span>
                    <Icon
                      name="pencil"
                      size={12}
                      className="text-fg-subtle opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </button>
                )}
              </div>
              {project.description && (
                <p className="mt-1 text-sm text-fg-muted">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Metric
              label="Monthly"
              value={formatCurrency(monthly, settings.currency)}
            />
            <Metric
              label="Yearly"
              value={formatCurrency(yearly, settings.currency)}
            />
            <Metric label="Services" value={String(serviceCount)} />
            <Metric
              label="Avg / service"
              value={formatCurrency(avg, settings.currency)}
            />
          </dl>

          <div className="mt-4 inline-flex rounded-md border border-border bg-surface-muted p-0.5">
            <TabButton
              active={tab === 'services'}
              onClick={() => setTab('services')}
            >
              Services
            </TabButton>
            <TabButton
              active={tab === 'breakdown'}
              onClick={() => setTab('breakdown')}
            >
              Breakdown
            </TabButton>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-6">
        {tab === 'services' ? (
          <>
            <Card className="overflow-hidden">
              {project.services.length === 0 ? (
                <EmptyState
                  icon="plus"
                  title="No services yet"
                  description="Add your first service below to start tracking costs."
                />
              ) : (
                <div className="divide-y divide-border">
                  {project.services.map((service) => (
                    <ServiceRow
                      key={service.id}
                      projectId={project.id}
                      service={service}
                      currency={settings.currency}
                    />
                  ))}
                </div>
              )}
            </Card>
            <div className="mt-4">
              <AddServiceForm projectId={project.id} />
            </div>
          </>
        ) : (
          <BreakdownPanel
            segments={categorySegments}
            monthly={monthly}
            currency={settings.currency}
          />
        )}

        {!isGeneral && (
          <div className="mt-10 flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-sm font-medium text-fg">Delete project</p>
              <p className="text-xs text-fg-muted">
                Permanently remove this project and all its services.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmDelete(true)}
              className="text-danger hover:bg-danger-subtle hover:text-danger"
            >
              <Icon name="trash" size={14} />
              Delete
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent
          title={`Delete "${project.name}"?`}
          description="This project and all of its services will be permanently removed."
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
        />
      </AlertDialog>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
        {label}
      </dt>
      <dd className="mt-0.5 font-mono text-sm font-semibold text-fg">
        {value}
      </dd>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-sm px-3 py-1 text-xs font-medium transition-colors',
        active
          ? 'bg-surface text-fg shadow-xs'
          : 'text-fg-muted hover:text-fg'
      )}
    >
      {children}
    </button>
  );
}

function BreakdownPanel({
  segments,
  monthly,
  currency,
}: {
  segments: { category: string; value: number }[];
  monthly: number;
  currency: string;
}) {
  if (segments.length === 0) {
    return (
      <EmptyState
        icon="layout"
        title="Nothing to break down yet"
        description="Add services with recurring costs to see the distribution."
      />
    );
  }

  return (
    <Card className="p-6">
      <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex justify-center">
          <Donut segments={segments} size={180} thickness={18}>
            <span className="font-mono text-base font-semibold text-fg">
              {formatCurrency(monthly, currency)}
            </span>
            <span className="text-[10px] text-fg-subtle">/mo</span>
          </Donut>
        </div>
        <ul className="space-y-2">
          {segments.map((s) => {
            const pct = Math.round((s.value / monthly) * 100);
            return (
              <li
                key={s.category}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <CategoryChip category={s.category} />
                <div className="flex items-center gap-4">
                  <span className="font-mono text-fg-muted">{pct}%</span>
                  <span className="font-mono font-medium text-fg">
                    {formatCurrency(s.value, currency)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
