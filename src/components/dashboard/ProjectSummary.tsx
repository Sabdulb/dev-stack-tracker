import { projectMonthlyTotal, toMonthlyCost, formatCurrency } from '../../utils/calculations';
import type { Project } from '../../types';

interface ProjectSummaryProps {
  project: Project;
  currency: string;
  onSelect: () => void;
}

export function ProjectSummary({ project, currency, onSelect }: ProjectSummaryProps) {
  const monthly = projectMonthlyTotal(project);

  // Group services by category and sum monthly costs
  const byCategory = project.services.reduce<Record<string, number>>((acc, s) => {
    const cat = s.category;
    acc[cat] = (acc[cat] ?? 0) + toMonthlyCost(s);
    return acc;
  }, {});

  const categories = Object.entries(byCategory)
    .filter(([, cost]) => cost > 0)
    .sort(([, a], [, b]) => b - a);

  return (
    <button
      onClick={onSelect}
      className="text-left p-5 rounded-xl border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: project.color ?? 'var(--color-border-strong)' }}
        />
        <span className="font-semibold text-gray-900 truncate">{project.name}</span>
      </div>

      <div className="text-2xl font-bold text-gray-900 mb-1">
        {formatCurrency(monthly, currency)}
        <span className="text-sm font-normal text-gray-400">/mo</span>
      </div>
      <div className="text-xs text-gray-400 mb-3">
        {project.services.length} service{project.services.length !== 1 ? 's' : ''}
      </div>

      {categories.length > 0 && (
        <div className="space-y-1">
          {categories.map(([cat, cost]) => (
            <div key={cat} className="flex justify-between text-xs text-gray-500">
              <span>{cat}</span>
              <span>{formatCurrency(cost, currency)}/mo</span>
            </div>
          ))}
        </div>
      )}

      {project.services.length === 0 && (
        <p className="text-xs text-gray-400 italic">No services yet</p>
      )}
    </button>
  );
}
