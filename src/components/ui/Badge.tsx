/* eslint-disable react-refresh/only-export-components */
import type { HTMLAttributes } from 'react';
import { cn } from './cn';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warn' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-surface-muted text-fg-muted',
  accent: 'bg-accent-subtle text-accent',
  success: 'bg-success-subtle text-success',
  warn: 'bg-warn-subtle text-warn',
  danger: 'bg-danger-subtle text-danger',
};

export function Badge({
  tone = 'neutral',
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-xs px-1.5 py-0.5 text-[11px] font-medium',
        toneClasses[tone],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

const CATEGORY_TOKEN: Record<string, string> = {
  Infra: 'text-cat-infra bg-cat-infra/10',
  Storage: 'text-cat-storage bg-cat-storage/10',
  API: 'text-cat-api bg-cat-api/10',
  Auth: 'text-cat-auth bg-cat-auth/10',
  Email: 'text-cat-email bg-cat-email/10',
  Hosting: 'text-cat-hosting bg-cat-hosting/10',
  Database: 'text-cat-database bg-cat-database/10',
  'CI/CD': 'text-cat-cicd bg-cat-cicd/10',
  Other: 'text-cat-other bg-cat-other/10',
};

export function CategoryChip({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const token = CATEGORY_TOKEN[category] ?? CATEGORY_TOKEN.Other;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-xs px-1.5 py-0.5 text-[11px] font-medium',
        token,
        className
      )}
    >
      {category}
    </span>
  );
}

const CATEGORY_VAR: Record<string, string> = {
  Infra: '--color-cat-infra',
  Storage: '--color-cat-storage',
  API: '--color-cat-api',
  Auth: '--color-cat-auth',
  Email: '--color-cat-email',
  Hosting: '--color-cat-hosting',
  Database: '--color-cat-database',
  'CI/CD': '--color-cat-cicd',
  Other: '--color-cat-other',
};

export function categoryColorVar(category: string): string {
  return CATEGORY_VAR[category] ?? CATEGORY_VAR.Other;
}
