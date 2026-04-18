import { useState } from 'react';
import { useStore } from '../../store/useStore';
import {
  formatCurrency,
  grandMonthlyTotal,
  toMonthlyCost,
} from '../../utils/calculations';
import { ProjectSummary } from './ProjectSummary';
import { NewProjectModal } from '../modals/NewProjectModal';
import {
  Badge,
  Button,
  Card,
  CategoryChip,
  EmptyState,
  Icon,
} from '../ui';
import { Donut } from '../charts/Donut';

interface DashboardProps {
  onSelectProject: (id: string) => void;
}

export function Dashboard({ onSelectProject }: DashboardProps) {
  const { projects, settings } = useStore();
  const [showNewProject, setShowNewProject] = useState(false);

  const grandTotal = grandMonthlyTotal(projects);
  const allServices = projects.flatMap((p) => p.services);
  const recurringCount = allServices.filter(
    (s) => s.billingCycle !== 'one-time'
  ).length;
  const oneTimeCount = allServices.length - recurringCount;

  const byCategory = allServices.reduce<Record<string, number>>((acc, s) => {
    acc[s.category] = (acc[s.category] ?? 0) + toMonthlyCost(s);
    return acc;
  }, {});

  const categorySegments = Object.entries(byCategory)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([category, value]) => ({ category, value }));

  const topCategory = categorySegments[0];

  const mostExpensiveService = allServices
    .filter((s) => s.billingCycle !== 'one-time')
    .reduce<{ name: string; monthly: number } | null>((best, s) => {
      const m = toMonthlyCost(s);
      if (!best || m > best.monthly) return { name: s.name, monthly: m };
      return best;
    }, null);

  const topFive = categorySegments.slice(0, 5);

  if (projects.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <EmptyState
          icon="layout"
          title="No projects yet"
          description="Create your first project to start tracking subscriptions."
          action={
            <Button onClick={() => setShowNewProject(true)}>
              <Icon name="plus" size={14} />
              New Project
            </Button>
          }
        />
        <NewProjectModal
          open={showNewProject}
          onOpenChange={setShowNewProject}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
              Total monthly spend
            </p>
            <div className="font-mono text-6xl font-semibold tracking-tight text-fg">
              {formatCurrency(grandTotal, settings.currency)}
              <span className="ml-2 align-middle text-2xl font-normal text-fg-muted">
                /mo
              </span>
            </div>
            <p className="mt-2 text-sm text-fg-muted">
              {formatCurrency(grandTotal * 12, settings.currency)}/yr · across{' '}
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="neutral">
                {recurringCount} recurring
              </Badge>
              {oneTimeCount > 0 && (
                <Badge tone="neutral">{oneTimeCount} one-time</Badge>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <KpiTile
                label="Top category"
                value={topCategory?.category ?? '—'}
                sub={
                  topCategory
                    ? `${formatCurrency(topCategory.value, settings.currency)}/mo`
                    : 'No services yet'
                }
              />
              <KpiTile
                label="Most expensive service"
                value={mostExpensiveService?.name ?? '—'}
                sub={
                  mostExpensiveService
                    ? `${formatCurrency(mostExpensiveService.monthly, settings.currency)}/mo`
                    : '—'
                }
              />
            </div>
          </div>

          {categorySegments.length > 0 && (
            <aside className="hidden self-end lg:block">
              <Card className="p-5">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
                  By category
                </p>
                <div className="flex flex-col items-center">
                  <Donut segments={categorySegments} size={140} thickness={14}>
                    <span className="font-mono text-sm font-semibold text-fg">
                      {formatCurrency(grandTotal, settings.currency)}
                    </span>
                    <span className="text-[10px] text-fg-subtle">/mo</span>
                  </Donut>
                </div>
                <ul className="mt-4 space-y-1.5">
                  {topFive.map((s) => {
                    const pct = Math.round((s.value / grandTotal) * 100);
                    return (
                      <li
                        key={s.category}
                        className="flex items-center justify-between text-xs"
                      >
                        <CategoryChip category={s.category} />
                        <span className="font-mono text-fg-muted">
                          {pct}%
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </aside>
          )}
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
              By project
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectSummary
                key={project.id}
                project={project}
                currency={settings.currency}
                onSelect={() => onSelectProject(project.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <NewProjectModal open={showNewProject} onOpenChange={setShowNewProject} />
    </div>
  );
}

interface KpiTileProps {
  label: string;
  value: string;
  sub: string;
}

function KpiTile({ label, value, sub }: KpiTileProps) {
  return (
    <Card className="p-4">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
        {label}
      </p>
      <p className="truncate text-sm font-semibold text-fg">{value}</p>
      <p className="mt-0.5 font-mono text-xs text-fg-muted">{sub}</p>
    </Card>
  );
}
