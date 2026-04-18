import { useState } from 'react';
import type { Project } from '../../types';
import { useStore } from '../../store/useStore';
import {
  projectMonthlyTotal,
  toMonthlyCost,
  formatCurrency,
} from '../../utils/calculations';
import {
  AlertDialog,
  AlertDialogContent,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  IconButton,
} from '../ui';
import { SegmentBar } from '../charts/SegmentBar';

interface ProjectSummaryProps {
  project: Project;
  currency: string;
  onSelect: () => void;
}

export function ProjectSummary({
  project,
  currency,
  onSelect,
}: ProjectSummaryProps) {
  const { updateProject, deleteProject } = useStore();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const monthly = projectMonthlyTotal(project);
  const yearly = monthly * 12;

  const byCategory = project.services.reduce<Record<string, number>>(
    (acc, s) => {
      acc[s.category] = (acc[s.category] ?? 0) + toMonthlyCost(s);
      return acc;
    },
    {}
  );

  const segments = Object.entries(byCategory)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([category, value]) => ({ category, value }));

  const serviceCount = project.services.length;

  function handleRename(e: Event) {
    e.preventDefault();
    const next = window.prompt('Rename project', project.name);
    if (next && next.trim() && next.trim() !== project.name) {
      updateProject(project.id, { name: next.trim() });
    }
  }

  const isGeneral = project.id === 'general';

  return (
    <>
      <Card
        interactive
        onClick={onSelect}
        className="group relative p-5 text-left"
      >
        <div className="mb-3 flex items-center gap-2">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{
              backgroundColor: project.color ?? 'var(--color-border-strong)',
            }}
          />
          <span className="flex-1 truncate text-sm font-semibold text-fg">
            {project.name}
          </span>
          <div
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 transition-opacity group-hover:opacity-100"
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton
                  icon="more-horizontal"
                  label="Project actions"
                  size="sm"
                  iconSize={14}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={handleRename}>
                  <Icon name="pencil" size={14} />
                  Rename
                </DropdownMenuItem>
                {!isGeneral && (
                  <DropdownMenuItem
                    danger
                    onSelect={() => setConfirmDelete(true)}
                  >
                    <Icon name="trash" size={14} />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mb-0.5 font-mono text-2xl font-semibold text-fg">
          {formatCurrency(monthly, currency)}
          <span className="ml-1 text-sm font-normal text-fg-muted">/mo</span>
        </div>
        <div className="mb-4 text-xs text-fg-muted">
          {formatCurrency(yearly, currency)}/yr
        </div>

        <SegmentBar segments={segments} height={4} className="rounded-full" />
        <div className="mt-2 text-xs text-fg-subtle">
          {serviceCount} service{serviceCount !== 1 ? 's' : ''}
        </div>
      </Card>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent
          title={`Delete "${project.name}"?`}
          description="This project and all of its services will be permanently removed."
          confirmLabel="Delete"
          danger
          onConfirm={() => deleteProject(project.id)}
        />
      </AlertDialog>
    </>
  );
}
