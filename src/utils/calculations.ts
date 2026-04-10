import type { Service, Project } from '../types';

export function toMonthlyCost(service: Service): number {
  if (service.billingCycle === 'yearly') return service.cost / 12;
  // One-time costs are intentionally excluded from recurring monthly totals
  if (service.billingCycle === 'one-time') return 0;
  return service.cost;
}

export function projectMonthlyTotal(project: Project): number {
  return project.services.reduce((sum, s) => sum + toMonthlyCost(s), 0);
}

export function grandMonthlyTotal(projects: Project[]): number {
  return projects.reduce((sum, p) => sum + projectMonthlyTotal(p), 0);
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
